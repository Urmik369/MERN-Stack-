
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

function MissingIndexAlert() {
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Firestore Index Required</AlertTitle>
            <AlertDescription>
                <p>To display all orders, a specific index must be created in your Firestore database. Please go to your Firebase Console and create it manually with the following settings:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm font-mono bg-muted p-4 rounded-md">
                    <li><strong>Collection ID:</strong> orders</li>
                    <li><strong>Fields to index:</strong>
                        <ul className="list-disc pl-5">
                            <li>orderDate | Descending</li>
                        </ul>
                    </li>
                    <li><strong>Query scope:</strong> Collection group</li>
                </ul>
                <p className="mt-2">After the index is built (which may take a few minutes), this page will work correctly.</p>
            </AlertDescription>
        </Alert>
    )
}


export default function OrdersPage() {
  const firestore = useFirestore();
  const [isPermissionError, setIsPermissionError] = useState(false);

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collectionGroup(firestore, 'orders'), orderBy('orderDate', 'desc'));
  }, [firestore]);

  const { data: orders, isLoading, error } = useCollection<Order>(ordersQuery);

  useEffect(() => {
    if (error && error.message.includes("permission-denied")) {
        // A permission denied error can mean one of two things:
        // 1. The security rules are incorrect.
        // 2. The required Firestore index is missing. Firestore checks rules *before* checking for an index.
        // If the rules are correct, the most likely cause is the missing index.
        setIsPermissionError(true);
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
            ) : isPermissionError ? (
                <MissingIndexAlert />
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
                    <TableCell className="text-right">Rs {order.totalAmount.toFixed(2)}</TableCell>
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
