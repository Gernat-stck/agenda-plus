import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import AppearanceToggleDropdown from './appearance-dropdown';
import { Link, usePage } from '@inertiajs/react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { url } = usePage();
    const isCalendarPage = url.startsWith('/calendar') && url !== '/calendar/config';

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 glow-border-bottom px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-2 ml-auto">
                {isCalendarPage && (
                    <Link href="/calendar/config">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                        >
                            <Settings className="h-4 w-4" />
                            <span className="hidden sm:inline">Configuración</span>
                        </Button>
                    </Link>
                )}
                <AppearanceToggleDropdown />
            </div>
        </header>
    );
}
