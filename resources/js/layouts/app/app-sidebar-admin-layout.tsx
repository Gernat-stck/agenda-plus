import { AppContent } from '@/components/shared/app-content';
import { AppShell } from '@/components/shared/app-shell';
import { AppSidebar } from '@/components/shared/app-sidebar-admin';
import { AppSidebarHeader } from '@/components/shared/app-sidebar-admin-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarAdminLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
