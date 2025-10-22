'use server';

/**
 * @fileOverview Provides AI-powered style recommendations based on items in the shopping cart and current fashion trends.
 *
 * - getStyleRecommendations - A function that returns style recommendations based on cart items and current trends.
 * - StyleRecommendationsInput - The input type for the getStyleRecommendations function.
 * - StyleRecommendationsOutput - The return type for the getStyleRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StyleRecommendationsInputSchema = z.object({
  cartItems: z.array(
    z.string().describe('Name of the item in the cart.')
  ).describe('List of items currently in the shopping cart.'),
  currentDate: z.string().describe('The current date in ISO format (YYYY-MM-DD).'),
});

export type StyleRecommendationsInput = z.infer<typeof StyleRecommendationsInputSchema>;

const StyleRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.string().describe('Recommended clothing item.')
  ).describe('List of recommended clothing items based on cart and trends.'),
  reasoning: z.string().describe('Explanation of why the items were recommended.'),
});

export type StyleRecommendationsOutput = z.infer<typeof StyleRecommendationsOutputSchema>;

export async function getStyleRecommendations(input: StyleRecommendationsInput): Promise<StyleRecommendationsOutput> {
  return styleRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'styleRecommendationsPrompt',
  input: {schema: StyleRecommendationsInputSchema},
  output: {schema: StyleRecommendationsOutputSchema},
  prompt: `You are a personal stylist providing clothing recommendations to users based on their current shopping cart items and current fashion trends.

  Today's date is {{{currentDate}}}.

  Here are the items in the user's cart:
  {{#each cartItems}}
  - {{{this}}}
  {{/each}}

  Based on these items and current fashion trends, provide a list of clothing recommendations, and a short explanation of why each item is recommended. Respond using the output schema format.
  Ensure that the recommendations complement the existing cart items and align with current trends. Do not suggest items that are already in the cart.
  `,
});

const styleRecommendationsFlow = ai.defineFlow(
  {
    name: 'styleRecommendationsFlow',
    inputSchema: StyleRecommendationsInputSchema,
    outputSchema: StyleRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
