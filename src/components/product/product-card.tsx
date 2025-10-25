'use client';

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import Link from 'next/link';

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
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={product.image.hint}
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <h3 className="font-semibold text-base truncate">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="text-sm text-muted-foreground">{product.category}</p>
        <div className="flex items-center justify-between mt-1">
          <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
          <Button size="icon" onClick={handleAddToCart} variant="secondary" className='rounded-full h-8 w-8 bg-background/80 hover:bg-background backdrop-blur-sm'>
              <Plus className="h-4 w-4"/>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
