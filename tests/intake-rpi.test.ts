import { generateKeyPairSync } from 'node:crypto';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  openBundle,
  publishDraft,
  prepareWorkspace,
  sealBundle,
  skillEvidence,
  validateFiles,
  bundleWorkspace,
} from '../scripts/demo/intake-rpi.mjs';

const files = [
  { path: 'docs/BRD.md', content: 'Draft' },
  { path: 'docs/use-case-brief.md', content: 'Fictional request' },
  { path: 'docs/hve-run-status.md', content: 'Review required' },
];

describe('isolated HVE intake handoff', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('records only skill calls with a successful completion event', () => {
    const trace = [
      {
        type: 'tool.execution_start',
        data: {
          toolCallId: '1',
          toolName: 'skill',
          arguments: { skill: 'rpi-research' },
        },
      },
      {
        type: 'tool.execution_complete',
        data: { toolCallId: '1', success: true },
      },
      {
        type: 'tool.execution_start',
        data: {
          toolCallId: '2',
          toolName: 'skill',
          arguments: { skill: 'rpi-plan' },
        },
      },
      {
        type: 'tool.execution_complete',
        data: { toolCallId: '2', success: false },
      },
    ]
      .map((event) => JSON.stringify(event))
      .join('\n');
    expect(skillEvidence(trace)).toEqual({ research: true, plan: false });
  });

  it('rejects unsafe and duplicate draft paths', () => {
    expect(() =>
      validateFiles([
        ...files,
        { path: '.github/workflows/evil.yml', content: 'x' },
      ]),
    ).toThrow();
    expect(() =>
      validateFiles([
        ...files,
        { path: '.copilot-tracking/research/../plans/x.md', content: 'x' },
      ]),
    ).toThrow();
    expect(() => validateFiles([...files, files[0]])).toThrow();
  });

  it('authenticates encrypted drafts and binds them to the intake', () => {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    const envelope = sealBundle({ issueNumber: 6, files }, publicKey);
    expect(envelope).not.toContain('Fictional request');
    expect(openBundle(envelope, privateKey, 6)).toEqual(files);
    expect(() => openBundle(envelope, privateKey, 7)).toThrow(
      'Intake number mismatch',
    );
    const altered = JSON.parse(envelope);
    altered.tag = Buffer.alloc(16).toString('base64');
    expect(() => openBundle(JSON.stringify(altered), privateKey, 6)).toThrow();
  });

  it('preserves intake data and reports BRD and skill evidence without claiming completion', () => {
    const root = mkdtempSync(join(tmpdir(), 'hve-intake-test-'));
    try {
      const { publicKey, privateKey } = generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
      prepareWorkspace(
        { number: 6, title: 'New app', body: 'Fictional details' },
        root,
      );
      const trace = join(root, 'trace.jsonl');
      writeFileSync(
        trace,
        [
          {
            type: 'tool.execution_start',
            data: {
              toolCallId: '1',
              toolName: 'skill',
              arguments: { skill: 'rpi-research' },
            },
          },
          {
            type: 'tool.execution_complete',
            data: { toolCallId: '1', success: true },
          },
        ]
          .map((event) => JSON.stringify(event))
          .join('\n'),
      );
      const envelope = bundleWorkspace(
        root,
        trace,
        '0',
        '0',
        'yes',
        6,
        publicKey,
      );
      const output = openBundle(envelope, privateKey, 6);
      expect(
        output.find((file) => file.path === 'docs/BRD.md')?.content,
      ).toContain('Fictional details');
      const status = output.find(
        (file) => file.path === 'docs/hve-run-status.md',
      )?.content;
      expect(status).toContain('Research skill invoked: yes');
      expect(status).toContain('Plan skill invoked: no');
      expect(status).toContain('BRD file changed: yes');
      expect(status).toContain('Invocation is not completion');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('refuses to publish to a different or public repository before any writes', async () => {
    const fetchMock = vi.fn(async (_url: string, _init: RequestInit) => ({
      ok: true,
      json: async () => ({
        id: 12,
        private: false,
        owner: { login: 'mitmartin' },
      }),
    }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(publishDraft(files, 6, 12, 'token')).rejects.toThrow(
      'Destination',
    );
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ method: 'GET' });
  });

  it('creates a draft PR without updating the default branch', async () => {
    const fetchMock = vi.fn(async (url: string, init: RequestInit) => {
      let payload: object;
      if (url.endsWith('/repos/mitmartin/hve-intake-6'))
        payload = { id: 12, private: true, owner: { login: 'mitmartin' } };
      else if (url.endsWith('/git/ref/heads/main'))
        payload = { object: { sha: 'base-commit' } };
      else if (url.endsWith('/git/commits/base-commit'))
        payload = { tree: { sha: 'base-tree' } };
      else if (url.endsWith('/git/blobs')) payload = { sha: 'blob' };
      else if (url.endsWith('/git/trees')) payload = { sha: 'tree' };
      else if (url.endsWith('/git/commits')) payload = { sha: 'commit' };
      else if (url.endsWith('/git/refs')) payload = {};
      else if (url.endsWith('/pulls'))
        payload = {
          html_url: 'https://github.com/mitmartin/hve-intake-6/pull/1',
        };
      else throw new Error(`Unexpected request: ${url} ${init.method}`);
      return { ok: true, json: async () => payload };
    });
    vi.stubGlobal('fetch', fetchMock);
    await expect(publishDraft(files, 6, 12, 'token')).resolves.toContain(
      '/pull/1',
    );
    const calls = fetchMock.mock.calls;
    const createRef = calls.find(([url]) => url.endsWith('/git/refs'));
    const createPr = calls.find(([url]) => url.endsWith('/pulls'));
    expect(JSON.parse(String(createRef?.[1].body))).toMatchObject({
      ref: 'refs/heads/intake/research-plan-6',
    });
    expect(JSON.parse(String(createPr?.[1].body))).toMatchObject({
      draft: true,
      base: 'main',
    });
    expect(
      calls.some(
        ([url, init]) =>
          url.includes('/git/refs/heads/main') && init.method !== 'GET',
      ),
    ).toBe(false);
  });
});
