'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { products } from '@/lib/data';

const ProductSchema = z.object({
  name: z.string(),
  category: z.string(),
});

const RecommendationRequestSchema = z.object({
  cartItems: z.array(ProductSchema).describe("List of items currently in the shopping cart."),
  currentDate: z.string().describe("The current date in ISO format (YYYY-MM-DD)."),
});

const RecommendationResponseSchema = z.array(
  z.object({
    id: z.string().describe('The ID of the recommended product from the available products list.'),
    name: z.string().describe('The name of the recommended product.'),
    reason: z.string().describe('A short reason why this item is recommended, referencing the items in the cart.'),
  })
).max(3);


const allProductNames = products.map(p => `${p.name} (ID: ${p.id})`).join('\n');

const prompt = ai.definePrompt({
  name: 'styleRecommenderPrompt',
  input: {schema: RecommendationRequestSchema},
  output: {schema: RecommendationResponseSchema},
  prompt: `You are a personal stylist for an e-commerce store. Your goal is to recommend products to users based on the items in their shopping cart.

Today's date is {{{currentDate}}}.

Here are the items in the user's cart:
{{#each cartItems}}
- {{{this.name}}} (Category: {{{this.category}}})
{{/each}}

Here is the list of all available products they can be recommended:
${allProductNames}

Based on the cart items and current fashion trends, provide up to 3 product recommendations from the available products list.
For each recommendation, provide the product ID, name, and a short, compelling reason why it would be a great addition, referencing their current cart items.

Do not recommend items that are already in the cart. Ensure the recommended product IDs are from the available products list.
`,
});


export const styleRecommender = ai.defineFlow(
  {
    name: 'styleRecommender',
    inputSchema: RecommendationRequestSchema,
    outputSchema: RecommendationResponseSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output || [];
  }
);
