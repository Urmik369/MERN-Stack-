import AdminLayout from "@/components/layout/admin-layout";
import InventoryTable from "@/components/admin/inventory-table";

export default function AdminProductsPage() {
  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <InventoryTable />
      </div>
    </AdminLayout>
  );
}
