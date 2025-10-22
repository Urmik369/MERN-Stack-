'use client';

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const { toast } = useToast();

    const handleAddToCart = () => {
        addToCart(product);
        toast({
            title: "Added to cart",
            description: `${product.name} has been added to your cart.`,
        });
    }

  return (
    <Card className="overflow-hidden group">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          data-ai-hint={product.image.hint}
        />
        <div className="absolute bottom-2 right-2">
            <Button size="icon" onClick={handleAddToCart} variant="secondary" className='rounded-full h-10 w-10 bg-background/80 hover:bg-background backdrop-blur-sm'>
                <Plus className="h-5 w-5"/>
            </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-base truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.category}</p>
        <p className="font-bold text-lg mt-1">${product.price.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
}
