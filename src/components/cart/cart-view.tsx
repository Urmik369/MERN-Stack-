'use client';

import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { X, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function CartView() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <div className="space-y-6">
      {cartItems.length === 0 ? (
        <div className="text-center border-2 border-dashed border-border rounded-lg p-12">
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">Your cart is empty</h2>
          <p className="text-muted-foreground mt-2">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border bg-card">
          {cartItems.map(({ product, quantity }) => (
            <div key={product.id} className="flex items-center p-4 space-x-4">
              <Image
                src={product.image.src}
                alt={product.image.alt}
                width={80}
                height={80}
                className="rounded-md object-cover"
                data-ai-hint={product.image.hint}
              />
              <div className="flex-grow space-y-1">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <p className="text-sm font-medium">₹{product.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => updateQuantity(product.id, parseInt(e.target.value, 10))}
                  className="w-16 h-9"
                />
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(product.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
           <div className="p-4 space-y-4">
            <div className="flex justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground">Shipping and taxes calculated at checkout.</p>
            <Button className="w-full" size="lg">Proceed to Checkout</Button>
          </div>
        </div>
      )}
    </div>
  );
}
