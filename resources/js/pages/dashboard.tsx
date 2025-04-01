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
interface Stats {
    today_appointments: number;
    tomorrow_appointments: number;
    new_clients: number;
    clients_last_week: number;
    total_clients: number;
    today_revenue: number;
    weekly_revenue: number;
    monthly_revenue: number;
    chart_data: {
        monthly: { date: string; value: number }[];
        weekly: { date: string; value: number }[];
        daily: { date: string; value: number }[];
    };
}
export default function Dashboard({ auth, stats }: { auth: any; stats: Stats }) {
    const { setUser } = useAuth();
    const clientsStats = {
        new_clients: stats.new_clients,
        clients_last_week: stats.clients_last_week,
        total_clients: stats.total_clients,
    };
    useEffect(() => {
        setUser(auth.user);
    }, [auth.user, setUser]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <CitaOverview appointments={stats.today_appointments} tomorrowAppointments={stats.tomorrow_appointments} />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <ClientesOverview
                            new_clients={clientsStats.new_clients}
                            clients_last_week={clientsStats.clients_last_week}
                            total_clients={clientsStats.total_clients}
                        />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <WalletOverview
                            today_revenue={stats.today_revenue}
                            weekly_revenue={stats.weekly_revenue}
                            monthly_revenue={stats.monthly_revenue}
                        />
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <ChartOverview chartData={stats.chart_data} />
                </div>
            </div>
        </AppLayout>
    );
}
