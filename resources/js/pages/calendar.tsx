import AppSidebarLayout from "@/layouts/app/app-sidebar-layout";
import { Head } from "@inertiajs/react";

export default function Calendar() {
    return (
        <AppSidebarLayout>
            <Head title="Calendar">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div
                className="flex flex-col items-center justify-center h-full"
            >
                <h1 className="text-4xl font-semibold text-gray-800">
                    Calendario
                </h1>
            </div>
        </AppSidebarLayout>
    );
}