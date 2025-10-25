
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from "@/components/layout/admin-layout";

// This page is no longer needed as product management is removed.
// We will redirect to the main admin dashboard.
export default function AdminProductsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <p>Redirecting...</p>
      </div>
    </AdminLayout>
  );
}

    