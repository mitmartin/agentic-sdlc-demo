export function makePrompt(issue: {
  number: number;
  title: string;
  body: string;
  pull_request?: object;
}): string;
