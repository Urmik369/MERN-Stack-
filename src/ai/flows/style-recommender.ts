import { defineFlow } from 'genkit/flow';
import { z } from 'zod';
import { products } from '@/lib/data';

const ProductSchema = z.object({
  name: z.string(),
  category: z.string(),
});

const RecommendationRequestSchema = z.object({
  cartItems: z.array(ProductSchema),
  currentDate: z.string(),
});

const RecommendationResponseSchema = z.array(
  z.object({
    id: z.string().describe('The ID of the recommended product'),
    name: z.string().describe('The name of the recommended product'),
    reason: z.string().describe('A short reason why this item is recommended'),
  })
);

// This is a mock implementation of the style recommender flow.
// In a real application, this would use an LLM with a detailed prompt
// to generate recommendations based on the full product catalog and trends.

export const styleRecommender = defineFlow(
  {
    name: 'styleRecommender',
    inputSchema: RecommendationRequestSchema,
    outputSchema: RecommendationResponseSchema,
    authPolicy: (auth, input) => {
      // In a real app, you might check for user authentication here.
      // For now, we allow all requests.
    },
  },
  async ({ cartItems, currentDate }) => {
    console.log(`Generating recommendations for cart with ${cartItems.length} items on ${currentDate}`);
    
    if (cartItems.length === 0) {
      return [];
    }

    const cartItemIds = cartItems.map(item => item.name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, ''));

    // Simple recommendation logic: find items from different categories than what's in the cart.
    const cartCategories = new Set(cartItems.map(i => i.category));
    let recommendedProducts = products.filter(p => !cartItemIds.includes(p.id) && !cartCategories.has(p.category));

    // If no recommendations found, recommend items from any category.
    if(recommendedProducts.length < 3) {
      recommendedProducts = products.filter(p => !cartItemIds.includes(p.id));
    }
    
    // Shuffle and take top 3
    const shuffled = recommendedProducts.sort(() => 0.5 - Math.random());
    const finalRecommendations = shuffled.slice(0, 3);

    return finalRecommendations.map(p => ({
      id: p.id,
      name: p.name,
      reason: `A great addition to complete your look.`
    }));
  }
);
