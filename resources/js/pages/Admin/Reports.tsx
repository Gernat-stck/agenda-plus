import { Head } from "@inertiajs/react";
import AppLayoutAdmin from "../../layouts/app-layout-admin";
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { BreadcrumbItem } from "../../types";
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Analiticas',
        href: '/admin/dashboard/analitics',
    },
    {
        title: 'Reportes',
        href: '/admin/dashboard/reports',
    }
]
export default function Reports() {
    return (
        <AppLayoutAdmin breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard Reports" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 p-2">
                <Card className="col-span-7">
                    <CardHeader>
                        <CardTitle>Reportes Generados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                            Lista de reportes generados
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayoutAdmin>
    )
}
