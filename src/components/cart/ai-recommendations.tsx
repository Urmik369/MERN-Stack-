'use client';

import { useEffect, useState, useTransition } from 'react';
import { getStyleRecommendations } from '@/app/actions';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

function RecommendationSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-16 w-16 rounded-md" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function AiRecommendations() {
    const { cartItems, addToCart } = useCart();
    const [recommendations, setRecommendations] = useState<Product[]>([]);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (cartItems.length > 0) {
            startTransition(async () => {
                const result = await getStyleRecommendations(cartItems);
                setRecommendations(result);
            });
        } else {
            setRecommendations([]);
        }
    }, [cartItems]);

    if (cartItems.length === 0) {
        return null;
    }

    return (
        <Card className="bg-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="text-accent" />
                    You Might Also Like
                </CardTitle>
                <CardDescription>AI-powered suggestions based on your cart.</CardDescription>
            </CardHeader>
            <CardContent>
                {isPending ? (
                    <RecommendationSkeleton />
                ) : recommendations.length > 0 ? (
                    <div className="space-y-4">
                        {recommendations.map((product) => (
                            <div key={product.id} className="flex items-center space-x-4">
                                <Image
                                    src={product.image.src}
                                    alt={product.image.alt}
                                    width={64}
                                    height={64}
                                    className="rounded-md object-cover"
                                    data-ai-hint={product.image.hint}
                                />
                                <div className="flex-grow">
                                    <h4 className="font-semibold">{product.name}</h4>
                                    <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => addToCart(product)}>
                                    Add
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No recommendations available right now.</p>
                )}
            </CardContent>
        </Card>
    );
}
