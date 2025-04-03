import AppLayoutAdmin from "@/layouts/app-layout-admin";
import { BreadcrumbItem } from "@/types";
import { UserFilters } from "@/components/admin/users/user-filters";
import { UsersTable } from "@/components/admin/users/user-table";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Users',
        href: '/admin/users',
    }
]
export default function Index() {
    return (
        <AppLayoutAdmin breadcrumbs={[]}>
            <div className="flex flex-col gap-4 m-auto w-full h-full max-w-7xl p-4">
                <UserFilters />
                <UsersTable />
            </div>
        </AppLayoutAdmin>
    )
}
