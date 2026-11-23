export interface DraftFile {
  path: string;
  content: string;
}

/** Records successful skill tool calls, not completion of their work. */
export function skillEvidence(trace: string): {
  research: boolean;
  plan: boolean;
};

/** Rejects paths outside the reviewable draft surface, duplicates, and oversized collections. */
export function validateFiles(files: unknown): DraftFile[];

/** Encrypts a draft bundle to an RSA public key for transfer between isolated jobs. */
export function sealBundle(bundle: object, publicKey: string): string;

/** Authenticates and decrypts a bundle, requiring the expected issue number and safe file paths. */
export function openBundle(
  envelope: string,
  privateKey: string,
  issueNumber: number,
): DraftFile[];

/** Publishes validated drafts to a new branch and draft PR in the exact private destination. */
export function publishDraft(
  files: DraftFile[],
  issueNumber: number,
  repositoryId: number,
  token: string,
): Promise<string>;
