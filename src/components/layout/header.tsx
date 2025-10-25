
'use client';

import Link from 'next/link';
import { ShoppingBag, User, Search, Menu, Shield } from 'lucide-react';
import Logo from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/firebase';

const navLinks = [
  { href: '/?category=all', label: 'All' },
  { href: '/', label: 'New Arrivals' },
  { href: '/?category=Men', label: 'Men' },
  { href: '/?category=Women', label: 'Women' },
];

export default function Header() {
  const { cartItems } = useCart();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState('');

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchTerm(params.get('q') || '');
  }, [pathname]);


  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('search') as string;
    const params = new URLSearchParams(window.location.search);
    params.set('q', searchQuery);
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col h-full">
                    <div className="border-b p-4">
                        <Logo />
                    </div>
                    <nav className="flex flex-col gap-4 p-4">
                    {navLinks.map((link) => (
                        <SheetClose asChild key={link.label}>
                            <Link href={link.href} className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                                {link.label}
                            </Link>
                        </SheetClose>
                    ))}
                    {user && (
                      <SheetClose asChild>
                        <Link href="/admin" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                          Admin
                        </Link>
                      </SheetClose>
                    )}
                    </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden md:block">
            <Logo />
          </div>
        </div>

        <div className="md:hidden flex-1 flex justify-center">
            <Logo />
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-10 w-40 lg:w-64" 
              name="search" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          {user && (
            <Link href="/admin" passHref>
              <Button variant="ghost" size="icon">
                <Shield className="h-5 w-5" />
                <span className="sr-only">Admin Panel</span>
              </Button>
            </Link>
          )}
          <Link href={user ? '/account' : '/login'} passHref>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          </Link>
          <Link href="/cart" passHref>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-2 h-5 w-5 justify-center p-0" variant="destructive">{totalItems}</Badge>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
