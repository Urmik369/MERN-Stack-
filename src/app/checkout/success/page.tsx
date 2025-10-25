'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import ShopLayout from '@/components/layout/shop-layout';

export default function CheckoutSuccessPage() {
  return (
    <ShopLayout>
      <div className="flex justify-center items-center py-20">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <div className="mx-auto bg-green-100 rounded-full p-3 w-fit dark:bg-green-900/50">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-3xl font-headline mt-4">Order Placed Successfully!</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Thank you for your purchase. A confirmation has been sent to your email.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>You can view your order history in your account page.</p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/account">Go to My Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ShopLayout>
  );
}
