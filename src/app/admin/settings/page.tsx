import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    return (
        <AdminLayout>
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold font-headline">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your store settings.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Store Information</CardTitle>
                        <CardDescription>Update your store's public details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="store-name">Store Name</Label>
                            <Input id="store-name" defaultValue="StyleSpace" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="store-email">Contact Email</Label>
                            <Input id="store-email" type="email" defaultValue="contact@stylespace.com" />
                        </div>
                        <Button>Save Changes</Button>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    )
}
