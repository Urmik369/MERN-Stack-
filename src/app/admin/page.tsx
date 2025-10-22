import AdminLayout from "@/components/layout/admin-layout";
import InventoryTable from "@/components/admin/inventory-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-headline tracking-tight">Products</h1>
            <p className="text-muted-foreground">Manage your product inventory.</p>
          </div>
          <Button>
            <PlusCircle />
            Add Product
          </Button>
        </div>
        <InventoryTable />
      </div>
    </AdminLayout>
  );
}
