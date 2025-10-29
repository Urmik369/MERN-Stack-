import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CustomersPage() {
  const customers = [
    { name: "Liam Johnson", email: "liam@example.com", image: "https://picsum.photos/seed/liam/40/40", date: "2023-06-23" },
    { name: "Olivia Smith", email: "olivia@example.com", image: "https://picsum.photos/seed/olivia/40/40", date: "2023-06-24" },
    { name: "Noah Williams", email: "noah@example.com", image: "https://picsum.photos/seed/noah/40/40", date: "2023-06-25" },
    { name: "Emma Brown", email: "emma@example.com", image: "https://picsum.photos/seed/emma/40/40", date: "2023-06-26" },
    { name: "Liam Johnson", email: "liam@example.com", image: "https://picsum.photos/seed/liam2/40/40", date: "2023-06-27" },
  ];

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Customers</CardTitle>
            <CardDescription>A list of all customers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer, index) => (
                  <TableRow key={`${customer.email}-${index}`}>
                    <TableCell className="font-medium flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={customer.image} />
                        <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {customer.name}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.date}</TableCell>
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
