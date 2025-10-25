
'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import ShopLayout from '@/components/layout/shop-layout';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { notFound } from 'next/navigation';

function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
      <div>
        <Skeleton className="aspect-[3/4] w-full rounded-lg" />
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-3/4" />
        </div>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-8 w-1/3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}


export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const firestore = useFirestore();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const productQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'products'),
      where('slug', '==', params.slug),
      limit(1)
    );
  }, [firestore, params.slug]);

  const { data: products, isLoading } = useCollection<Product>(productQuery);
  const product = products?.[0];

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
    });
  }

  if (isLoading) {
    return (
      <ShopLayout>
        <ProductDetailSkeleton />
      </ShopLayout>
    );
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
          <p className="text-3xl font-bold">₹{product.price.toFixed(2)}</p>
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

// `generateStaticParams` is no longer needed as we are fetching data dynamically on the client.
// If you want to use server-side rendering with dynamic data, you would fetch from Firestore here.
// For this client-side example, we remove it.
// export async function generateStaticParams() {
//   // This would need to fetch all product slugs from Firestore at build time.
// }
