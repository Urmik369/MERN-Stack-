
'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import ShopLayout from '@/components/layout/shop-layout';
import ProductGrid from '@/components/product/product-grid';
import ProductFilters from '@/components/product/product-filters';
import PaginationControls from '@/components/product/pagination-controls';
import { Skeleton } from '@/components/ui/skeleton';

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams['page'] ?? '1';
  const perPage = searchParams['per_page'] ?? '9';
  const searchTerm = (searchParams['q'] as string)?.toLowerCase() ?? '';
  let category = (searchParams['category'] as string) ?? 'all';

  const firestore = useFirestore();

  const productsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Product>(productsCollection);

  const categories = useMemo(() => {
    if (!products) return ['all', 'Men', 'Women'];
    const productCategories = products.map(p => p.category);
    const uniqueCategories = Array.from(new Set(productCategories));
    // Ensure 'Men' and 'Women' are included if they aren't in the products yet
    if (!uniqueCategories.includes('Men')) uniqueCategories.unshift('Men');
    if (!uniqueCategories.includes('Women')) uniqueCategories.unshift('Women');
    return ['all', ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    const getCategoryProducts = (cat: string) => {
      if (cat === 'Men') {
        return products.filter(p => ['T-Shirts', 'Jeans', 'Jackets', 'Hoodies', 'Footwear', 'Shirts', 'Shorts', 'Accessories'].includes(p.category));
      }
      if (cat === 'Women') {
        return products.filter(p => ['Dresses', 'T-Shirts', 'Jeans', 'Jackets', 'Hoodies', 'Footwear', 'Tops', 'Trousers', 'Skirts', 'Accessories'].includes(p.category));
      }
      if (cat === 'all' || !cat) {
        return products;
      }
      return products.filter(p => p.category === cat);
    }

    const categoryProducts = getCategoryProducts(category);

    return categoryProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
      return matchesSearch;
    });
  }, [products, category, searchTerm]);

  const start = (Number(page) - 1) * Number(perPage);
  const end = start + Number(perPage);
  const paginatedProducts = filteredProducts.slice(start, end);

  const totalPages = Math.ceil(filteredProducts.length / Number(perPage));

  return (
    <ShopLayout>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <ProductFilters categories={categories} />
        </aside>
        <div className="w-full md:w-3/4 lg:w-4/5">
          {isLoading ? (
            <ProductGridSkeleton />
          ) : paginatedProducts.length > 0 ? (
            <>
              <ProductGrid products={paginatedProducts} />
              <PaginationControls
                totalPages={totalPages}
                currentPage={Number(page)}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <h2 className="text-2xl font-headline font-bold mb-2">No Products Found</h2>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </ShopLayout>
  );
}
