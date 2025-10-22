import { genkit } from '@/ai/genkit';
import { run } from '@genkit-ai/next';

// This is an advanced feature.
// For details, see https://firebase.google.com/docs/genkit/nextjs
export const POST = run({
  // IMPORTANT: This must be a top-level export called `genkit`.
  genkit: genkit,
});
