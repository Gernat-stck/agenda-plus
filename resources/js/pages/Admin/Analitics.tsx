
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BreadcrumbItem } from '../../types';
import AppLayoutAdmin from '../../layouts/app-layout-admin';
import { Head } from '@inertiajs/react';
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
export default function Analitics() {

    return (
        <AppLayoutAdmin breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard Analitics" />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 m-2">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Análisis de Ventas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                            Gráfico de análisis detallado
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Métricas de Usuarios</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                            Gráfico de métricas de usuarios
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayoutAdmin>
    )
}
