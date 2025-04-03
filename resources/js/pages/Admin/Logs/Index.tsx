import AppLayoutAdmin from "@/layouts/app-layout-admin";
import { BreadcrumbItem } from "@/types";
import { ErrorLogFilters } from "@/components/admin/error-logs/error-logs-filters";
import { ErrorLogsTable } from "@/components/admin/error-logs/error-logs-table";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Error Logs',
        href: '/admin/errors',
    }
]
export default function Index() {
    return (
        <AppLayoutAdmin breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-4 m-2">

                <ErrorLogFilters />
                <ErrorLogsTable />
            </div>
        </AppLayoutAdmin>
    )
}
