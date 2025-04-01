import AppLayoutAdmin from "@/layouts/app-layout-admin";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { PlansTable } from "@/components/admin/plans/plans-table";
import { BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Plans',
        href: '/admin/plans',
    }
]
export default function Index() {
    //TODO: Realizar la adaptacion del form para el form
    return (
        <AppLayoutAdmin breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-4 m-2">
                <div className="flex items-center justify-end mt-3">
                    <Link href="/dashboard/plans/new">
                        <Button>
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Crear Plan
                        </Button>
                    </Link>
                </div>
                <PlansTable />
            </div>
        </AppLayoutAdmin>
    )
}
