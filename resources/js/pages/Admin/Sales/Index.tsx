
import AppLayoutAdmin from '@/layouts/app-layout-admin';
import { SalesTimeframeSelector } from '@/components/admin/sales/sales-time-selector';
import { SalesOverview } from '@/components/admin/sales/sales-overview';
import { SalesChart } from '@/components/admin/sales/sales-chart';
import { SalesTable } from '@/components/admin/sales/sales-table';
import { BreadcrumbItem } from '@/types';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Sales',
        href: '/admin/sales',
    }
]
export default function Index() {
    return (
        <AppLayoutAdmin breadcrumbs={breadcrumbs}>
            <div className='gap-2'>
                <SalesTimeframeSelector />
                <SalesOverview />
                <SalesChart />
                <SalesTable />
            </div>
        </AppLayoutAdmin>
    );
}
