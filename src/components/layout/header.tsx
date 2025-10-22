'use client';

import Link from 'next/link';
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react';
import Logo from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '#', label: 'New Arrivals' },
  { href: '#', label: 'Men' },
  { href: '#', label: 'Women' },
];

export default function Header() {
  const { cartItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-10 w-40 lg:w-64" />
          </div>
          <Link href="/account" passHref>
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
