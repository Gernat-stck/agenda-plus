import AppSidebarLayout from "@/layouts/app/app-sidebar-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import ListaClientes from "@/components/clients/clientes-tabla";
import { Cliente } from "@/types/clients";
import { category } from "@/types/services";
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lista de Clientes',
        href: '/clients',
    },
];
export default function clients({ clients, category }: { clients: Cliente[], category: category[] }) {
    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Clients">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <main className="size-full flex-col p-2 bg-background rounded-b-2xl m-auto">
                <ListaClientes clients={clients} category={category} />
            </main>
        </AppSidebarLayout>
    )
}