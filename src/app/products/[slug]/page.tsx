
import { products } from '@/lib/data';
import ShopLayout from '@/components/layout/shop-layout';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);

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
             <Button size="lg" className="w-full">Add to Cart</Button>
             <Button size="lg" variant="outline" className="w-full">Add to Wishlist</Button>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}
