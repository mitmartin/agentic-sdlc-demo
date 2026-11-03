import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSeedData } from '../src/server/data/seed.js';
import {
  createWorkOrder,
  isOverdue,
  updateWorkOrder,
} from '../src/server/services/workOrders.js';
import type { WorkOrder } from '../src/server/domain/types.js';

describe('work orders', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-03-16T12:00:00Z'));
  });
  afterEach(() => vi.useRealTimers());

  it('creates a normalized open order linked to an existing asset', () => {
    const data = createSeedData();
    const result = createWorkOrder(data, {
      assetId: 'truck-1',
      title: '  Replace filter  ',
      priority: 'high',
      dueDate: '2026-03-20',
    });
    expect(result).toMatchObject({
      title: 'Replace filter',
      assetId: 'truck-1',
      status: 'open',
      assignee: 'Unassigned',
      createdAt: '2026-03-16T12:00:00.000Z',
    });
    expect(data.workOrders.at(-1)).toEqual(result);
  });

  it('rejects invalid creation without changing the store', () => {
    const data = createSeedData();
    const valid = {
      assetId: 'truck-1',
      title: 'Inspect',
      priority: 'high',
      dueDate: '2026-03-20',
    };
    for (const input of [
      null,
      [],
      { ...valid, title: ' ' },
      { ...valid, assetId: 'missing' },
      { ...valid, priority: 'urgent' },
      { ...valid, dueDate: '2026-02-30' },
      { ...valid, dueDate: 'not-a-date' },
      { ...valid, assignee: 42 },
    ]) {
      expect(() => createWorkOrder(data, input)).toThrow();
    }
    expect(data.workOrders).toHaveLength(25);
  });

  it('updates status and assignee while preserving other fields', () => {
    const data = createSeedData();
    const original = { ...data.workOrders[0]! };
    expect(
      updateWorkOrder(data, original.id, {
        status: 'in_progress',
        assignee: '  Casey Park ',
      }),
    ).toEqual({ ...original, status: 'in_progress', assignee: 'Casey Park' });
  });

  it('rejects missing orders and invalid patches without partial updates', () => {
    const data = createSeedData();
    const original = { ...data.workOrders[0]! };
    expect(() => updateWorkOrder(data, 'missing', { status: 'done' })).toThrow(
      'Work order not found.',
    );
    for (const input of [
      {},
      null,
      { status: 'unknown' },
      { status: 'done', assignee: '' },
    ]) {
      expect(() => updateWorkOrder(data, original.id, input)).toThrow();
    }
    expect(data.workOrders[0]).toEqual(original);
  });

  it('counts past unfinished work but excludes future and completed work', () => {
    const order: WorkOrder = {
      ...createSeedData().workOrders[0]!,
      status: 'open',
      dueDate: '2026-03-15',
    };
    expect(isOverdue(order)).toBe(true);
    expect(isOverdue({ ...order, dueDate: '2026-03-17' })).toBe(false);
    expect(isOverdue({ ...order, status: 'done' })).toBe(false);
  });
});
