'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '@/hooks/use-cart';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import ShopLayout from '@/components/layout/shop-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

const addressSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    },
  });

  if (userLoading) {
    return <ShopLayout><div>Loading...</div></ShopLayout>;
  }

  if (!user) {
    router.push('/login?redirect=/checkout');
    return null;
  }
  
  if (cartItems.length === 0 && !userLoading) {
      router.push('/');
      return null;
  }

  const onSubmit = async (data: AddressFormValues) => {
    if (!user || !firestore) return;

    try {
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        userName: data.name,
        shippingAddress: data,
        items: cartItems.map(item => ({
            productId: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price
        })),
        totalAmount: cartTotal,
        status: 'Pending',
        orderDate: serverTimestamp(),
      };

      await addDoc(collection(firestore, 'orders'), orderData);
      
      toast({
        title: 'Order Placed!',
        description: 'Thank you for your purchase.',
      });

      clearCart();
      router.push('/checkout/success');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Checkout Failed',
        description: error.message,
      });
    }
  };

  return (
    <ShopLayout>
      <div className="lg:grid lg:grid-cols-2 lg:gap-12">
        <div className="mb-8 lg:mb-0">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>Enter the address where you want to receive your order.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="city" render={({ field }) => (
                            <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="postalCode" render={({ field }) => (
                            <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                  <FormField control={form.control} name="country" render={({ field }) => (
                    <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Placing Order...' : `Pay ₹${cartTotal.toFixed(2)}`}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div>
           <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {cartItems.map(item => (
                            <div key={item.product.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Image src={item.product.image.src} alt={item.product.image.alt} width={64} height={64} className="rounded-md" />
                                    <div>
                                        <p className="font-medium">{item.product.name}</p>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between font-semibold text-lg">
                            <p>Total</p>
                            <p>₹{cartTotal.toFixed(2)}</p>
                        </div>
                    </div>
                </CardContent>
           </Card>
        </div>
      </div>
    </ShopLayout>
  );
}
