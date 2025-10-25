import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function OrdersPage() {
  // In a real app, you would fetch this data from your backend
  const orders = [
    { id: "ORD001", customer: "Liam Johnson", email: "liam@example.com", date: "2023-06-23", status: "Shipped", total: "₹250.00" },
    { id: "ORD002", customer: "Olivia Smith", email: "olivia@example.com", date: "2023-06-24", status: "Shipped", total: "₹150.00" },
    { id: "ORD003", customer: "Noah Williams", email: "noah@example.com", date: "2023-06-25", status: "Pending", total: "₹350.00" },
    { id: "ORD004", customer: "Emma Brown", email: "emma@example.com", date: "2023-06-26", status: "Shipped", total: "₹450.00" },
    { id: "ORD005", customer: "Liam Johnson", email: "liam@example.com", date: "2023-06-27", status: "Pending", total: "₹550.00" },
  ];

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>A list of all orders in your store.</CardDescription>
          </CardHeader>
          <CardContent>
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
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-sm text-muted-foreground">{order.email}</div>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === 'Shipped' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{order.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
