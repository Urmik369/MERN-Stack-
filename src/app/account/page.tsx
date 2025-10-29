
'use client';

import { useEffect } from "react";
import ShopLayout from "@/components/layout/shop-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, ShoppingBag, Heart, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from "firebase/auth";
import { useUser, useFirestore, useCollection, useMemoFirebase, useFirebaseApp } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { Order } from "@/lib/types";
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const getStatusVariant = (status: Order['status']) => {
  switch (status) {
    case 'Shipped': return 'default';
    case 'Pending': return 'secondary';
    case 'Delivered': return 'outline';
    default: return 'destructive';
  }
};


export default function AccountPage() {
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'orders'), orderBy('orderDate', 'desc'), limit(5));
  }, [firestore, user]);

  const { data: orders, isLoading: ordersLoading } = useCollection<Order>(ordersQuery);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: error.message,
      });
    }
  };

  if (userLoading || !user) {
    return (
      <ShopLayout>
        <div className="text-center py-20">Loading account details...</div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold font-headline">My Account</h1>
          <p className="text-muted-foreground">
            Manage your account settings and track your orders.
          </p>
        </header>
        <Separator />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.photoURL || "https://picsum.photos/seed/user/100/100"} alt={user.displayName || "User"} />
                  <AvatarFallback>{user.displayName?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{user.displayName || "User"}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <User /> Profile Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <ShoppingBag /> Order History
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Heart /> Wishlist
                </Button>
                <Separator />
                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive">
                  <LogOut /> Log Out
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your most recent purchases.</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="text-center text-muted-foreground py-8">Loading orders...</div>
                ) : orders && orders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">#{order.id.substring(0, 7)}</TableCell>
                          <TableCell>{format(order.orderDate.toDate(), 'PP')}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">Rs {order.totalAmount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <p>You have no recent orders.</p>
                    <Button variant="link" asChild className="text-accent-foreground hover:text-primary">
                      <Link href="/">Start Shopping</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
