'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Search } from 'lucide-react';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

type ProductFiltersProps = {
  categories: string[];
};

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearchTerm) {
      params.set('q', debouncedSearchTerm);
    } else {
      params.delete('q');
    }
    params.set('page', '1'); // Reset to first page on search
    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearchTerm, router, pathname, searchParams]);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('category', category);
    params.set('page', '1'); // Reset to first page on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <Label className="font-semibold text-base mb-3 block">Category</Label>
          <RadioGroup 
            defaultValue={searchParams.get('category') || 'all'}
            onValueChange={handleCategoryChange}
            className='space-y-2'
          >
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <RadioGroupItem value={category} id={category} />
                <Label htmlFor={category} className="capitalize font-normal">
                  {category}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
