import ShopLayout from "@/components/layout/shop-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, ShoppingBag, Heart, LogOut } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
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
                  <AvatarImage src="https://picsum.photos/seed/user/100/100" alt="User Name" />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">Alex Doe</CardTitle>
                  <CardDescription>alex.doe@example.com</CardDescription>
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
                <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive">
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
                <div className="text-center text-muted-foreground py-8">
                  <p>You have no recent orders.</p>
                  <Button variant="link" asChild className="text-accent-foreground hover:text-primary">
                    <Link href="/">Start Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
