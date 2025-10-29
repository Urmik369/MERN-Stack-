
'use client';

import { products as localProducts } from '@/lib/data';
import type { Product } from '@/lib/types';
import ShopLayout from '@/components/layout/shop-layout';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { notFound } from 'next/navigation';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const product = localProducts.find((p) => p.slug === params.slug);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
    });
  }

  if (!product) {
    notFound();
  }

  return (
    <ShopLayout>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <div>
          <div className="aspect-[3/4] relative bg-muted rounded-lg">
            <Image
              src={product.image.src}
              alt={product.image.alt}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint={product.image.hint}
            />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-bold font-headline">{product.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-yellow-500">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current text-gray-300" />
            </div>
            <span className="text-sm text-muted-foreground">(123 reviews)</span>
          </div>
          <p className="text-3xl font-bold">Rs {product.price.toFixed(2)}</p>
          <p className="text-muted-foreground">{product.description}</p>
          
          <div className="space-y-4">
             <Button size="lg" className="w-full" onClick={handleAddToCart}>Add to Cart</Button>
             <Button size="lg" variant="outline" className="w-full">Add to Wishlist</Button>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
