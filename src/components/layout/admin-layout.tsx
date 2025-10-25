'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { LayoutDashboard, ShoppingCart, Package, Users, LogOut, Settings } from 'lucide-react';
import Logo from '@/components/shared/logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useUser } from '@/firebase';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon" variant="sidebar">
        <SidebarHeader className='p-4'>
          <div className="flex items-center gap-2">
            <div className='group-data-[[data-collapsible=icon]]:hidden'>
              <Logo />
            </div>
             <div className='hidden group-data-[[data-collapsible=icon]]:block'>
              <Logo isIconOnly />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className='p-4'>
           <Link href="/" passHref>
             <SidebarMenuButton tooltip={{ children: 'Log Out' }}>
                <LogOut />
                <span>Log Out</span>
            </SidebarMenuButton>
          </Link>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className='bg-background text-foreground'>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className='sm:hidden'/>
            <div className="flex-1"></div>
            <Avatar>
                <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/admin/40/40"} />
                <AvatarFallback>{user?.displayName?.charAt(0) || 'A'}</AvatarFallback>
            </Avatar>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
