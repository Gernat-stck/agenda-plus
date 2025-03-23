import AppSidebarLayout from "@/layouts/app/app-sidebar-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import ListaClientes from "@/components/clients/clientes-index";
import { Cliente } from "@/types/clients";
import { category } from "@/types/services";
import { CalendarConfig, SpecialDate } from "@/types/calendar";
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lista de Clientes',
        href: '/clients',
    },
];
export default function clients(
    {
        clients,
        category,
        config,
        specialDates
    }: {
        clients: Cliente[],
        category: category[],
        config: CalendarConfig,
        specialDates: SpecialDate[]
    }) {
    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Clients">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <main className="size-full flex-col p-1 bg-background rounded-b-2xl m-auto">
                <ListaClientes clients={clients} category={category} config={config} specialDates={specialDates} />
            </main>
        </AppSidebarLayout>
    )
}