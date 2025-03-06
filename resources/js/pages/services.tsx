import GestionServicios from "@/components/services/gestion-servicios";
import AppSidebarLayout from "@/layouts/app/app-sidebar-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestion de Servicios',
        href: '/services',
    },
];
export default function services() {
    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Services">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <main className="size-full flex-col p-2 bg-background rounded-b-2xl m-auto">
                <GestionServicios />
            </main>
        </AppSidebarLayout>
    )
}