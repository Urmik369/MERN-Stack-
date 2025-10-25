'use client';

import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from 'firebase/firestore';
import type { Order } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';

function OrdersTableSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="grid grid-cols-5 gap-4 p-2 border-b">
          <Skeleton className="h-5 w-20" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 ml-auto" />
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  const firestore = useFirestore();
  const ordersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'orders'), orderBy('orderDate', 'desc'));
  }, [firestore]);

  const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'Shipped': return 'default';
      case 'Pending': return 'secondary';
      case 'Delivered': return 'outline';
      default: return 'destructive';
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>A list of all orders in your store.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <OrdersTableSkeleton />
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id.substring(0, 7)}</TableCell>
                    <TableCell>
                        <div className="font-medium">{order.userName}</div>
                        <div className="text-sm text-muted-foreground">{order.userEmail}</div>
                    </TableCell>
                    <TableCell>
                      {order.orderDate ? format(order.orderDate.toDate(), 'PP') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">₹{order.totalAmount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
             { !isLoading && orders?.length === 0 && (
                <div className="text-center text-muted-foreground py-16">
                    <p>No orders have been placed yet.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
