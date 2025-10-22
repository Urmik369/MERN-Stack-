'use server';

import { runFlow } from '@genkit-ai/next/server';
import { styleRecommender } from '@/ai/flows/style-recommender';
import { Product, CartItem } from '@/lib/types';
import { products } from '@/lib/data';

const toFlowInput = (items: CartItem[]) => {
  return items.map(item => ({
    name: item.product.name,
    category: item.product.category,
  }));
};

export async function getStyleRecommendations(cartItems: CartItem[]): Promise<Product[]> {
  if (cartItems.length === 0) {
    return [];
  }

  try {
    const recommendations = await runFlow(styleRecommender, {
      cartItems: toFlowInput(cartItems),
      currentDate: new Date().toISOString(),
    });

    const recommendedProducts = recommendations
      .map(rec => products.find(p => p.id === rec.id))
      .filter((p): p is Product => p !== undefined);

    return recommendedProducts;
  } catch (error) {
    console.error('Error fetching style recommendations:', error);
    // Return empty array or some default recommendations in case of an error
    return [];
  }
}
