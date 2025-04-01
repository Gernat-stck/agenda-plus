import AppLayoutAdmin from '@/layouts/app-layout-admin';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Head, Link } from '@inertiajs/react';
import { BarChart3, Users, CreditCard, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { SalesChart } from '../../components/admin/sales/sales-chart';
import { RecentSalesWidget } from '../../components/admin/sales/recent-sales-widget';
import { RecentErrorsWidget } from '../../components/admin/error-logs/recent-errors-widget';
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
export default function Dashboard() {
    return (
        <AppLayoutAdmin breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 m-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <span className="text-emerald-500 flex items-center">
                                <ArrowUpRight className="h-3 w-3" />
                                +20.1%
                            </span>
                            desde el mes pasado
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Suscripciones</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2,350</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <span className="text-emerald-500 flex items-center">
                                <ArrowUpRight className="h-3 w-3" />
                                +12.2%
                            </span>
                            desde el mes pasado
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12,234</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <span className="text-emerald-500 flex items-center">
                                <ArrowUpRight className="h-3 w-3" />
                                +3.1%
                            </span>
                            desde la semana pasada
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Errores Críticos</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <span className="text-rose-500 flex items-center">
                                <ArrowDownRight className="h-3 w-3" />
                                -8%
                            </span>
                            desde ayer
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 m-2">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Resumen de Ventas</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <SalesChart />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Ventas Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RecentSalesWidget />
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 m-2">
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Errores Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RecentErrorsWidget />
                    </CardContent>
                </Card>
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Distribución de Planes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                            Gráfico de distribución de planes
                        </div>
                    </CardContent>
                </Card>
            </div>

        </AppLayoutAdmin>
    )
}
