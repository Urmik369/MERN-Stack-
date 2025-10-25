import { products } from '@/lib/data';
import type { Product } from '@/lib/types';
import ShopLayout from '@/components/layout/shop-layout';
import ProductGrid from '@/components/product/product-grid';
import ProductFilters from '@/components/product/product-filters';
import PaginationControls from '@/components/product/pagination-controls';

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams['page'] ?? '1';
  const perPage = searchParams['per_page'] ?? '9';
  const searchTerm = (searchParams['q'] as string)?.toLowerCase() ?? '';
  let category = (searchParams['category'] as string) ?? 'all';

  // Handle Men/Women categories
  const getCategoryProducts = (cat: string) => {
    if (cat === 'Men') {
      return products.filter(p => ['T-Shirts', 'Jeans', 'Jackets', 'Hoodies', 'Footwear'].includes(p.category));
    }
    if (cat === 'Women') {
      return products.filter(p => ['Dresses', 'T-Shirts', 'Jeans', 'Jackets', 'Hoodies', 'Footwear'].includes(p.category));
    }
    if (cat === 'all' || !cat) {
      return products;
    }
    return products.filter(p => p.category === cat);
  }

  const categoryProducts = getCategoryProducts(category);

  const filteredProducts = categoryProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
    return matchesSearch;
  });

  const start = (Number(page) - 1) * Number(perPage);
  const end = start + Number(perPage);
  const paginatedProducts = filteredProducts.slice(start, end);

  const totalPages = Math.ceil(filteredProducts.length / Number(perPage));

  const categories = ['all', 'Men', 'Women', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <ShopLayout>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <ProductFilters categories={categories} />
        </aside>
        <div className="w-full md:w-3/4 lg:w-4/5">
          {paginatedProducts.length > 0 ? (
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
