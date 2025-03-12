import CalendarComponent from "@/components/calendar/page";
import AppSidebarLayout from "@/layouts/app/app-sidebar-layout";
import { BreadcrumbItem } from "@/types";
import { Cita } from "@/types/clients";
import { category } from "@/types/services";
import { Head } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Calendario',
        href: '/calendar',
    },
];
export default function Calendar({ appointments, categories }: { appointments: Cita[], categories: category[] }) {
    console.log(appointments);
    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Calendar">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <main className="size-full flex-col p-2 bg-background rounded-b-2xl">
                <CalendarComponent appointmentsData={appointments} categories={categories} />
            </main>
        </AppSidebarLayout>
    );
}