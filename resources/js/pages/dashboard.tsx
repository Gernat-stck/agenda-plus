import ChartOverview from '@/components/dashboard/chart-info-overview';
import CitaOverview from '@/components/dashboard/citas-overview';
import ClientesOverview from '@/components/dashboard/clientes-registrados';
import WalletOverview from '@/components/dashboard/wallet-overview';
import { useAuth } from '@/context/AuthContext';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];


export default function Dashboard({ auth }: { auth: any }) {
    const { setUser } = useAuth();

    useEffect(() => {
        setUser(auth.user);
    }, [auth.user, setUser]);
    //TODO: Intentar extraer las queries a un documento a parte para la reutilización de las mismas
    //TODO: Hacer los componentes responsive
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <CitaOverview />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <ClientesOverview />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <WalletOverview />
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <ChartOverview />
                </div>
            </div>
        </AppLayout>
    );
}
