
'use client';

import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collectionGroup, query, orderBy } from 'firebase/firestore';
import type { Order } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [firestoreErrorUrl, setFirestoreErrorUrl] = useState<string | null>(null);

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // A simplified query to help Firestore generate the correct index creation link.
    return query(
        collectionGroup(firestore, 'orders'), 
        orderBy('orderDate', 'desc')
    );
  }, [firestore]);

  const { data: orders, isLoading, error } = useCollection<Order>(ordersQuery);

  useEffect(() => {
    if (error) {
      const firebaseError = error as any;
      const urlMatch = firebaseError?.message?.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        setFirestoreErrorUrl(urlMatch[0]);
      }
    }
  }, [error]);


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
            ) : error ? (
                 <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Firestore Index Required</AlertTitle>
                    <AlertDescription>
                        A required Firestore index is missing, which is causing a permission error. To fix this, please click the link below to create the index in Firebase. The admin panel will work correctly once the index is built (which may take a few minutes).
                        <br />
                        {firestoreErrorUrl ? (
                            <a href={firestoreErrorUrl} target="_blank" rel="noopener noreferrer" className="font-bold underline mt-2 inline-block">
                                Create Firestore Index
                            </a>
                        ) : (
                           <p className="mt-2">Could not automatically generate the index creation link. Please check the browser's developer console for the full error message from Firebase, which contains the link, and create the index manually.</p>
                        )}
                    </AlertDescription>
                </Alert>
            ) : orders && orders.length > 0 ? (
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
            ) : (
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
