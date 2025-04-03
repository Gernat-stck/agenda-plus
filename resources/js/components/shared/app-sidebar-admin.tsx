import { NavFooter } from '@/components/shared/nav-footer';
import { NavMain } from '@/components/shared/nav-main';
import { NavUser } from '@/components/shared/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ChartColumnBig, CreditCard, Info, LayoutGrid, Package, UserCheck2 } from 'lucide-react';
import AppLogoIcon from './app-logo-icon';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Ventas',
        url: '/admin/sales',
        icon: ChartColumnBig,
    },
    {
        title: 'Usuarios',
        url: '/admin/users',
        icon: UserCheck2,
    },
    {
        title: 'Suscripciones',
        url: '/admin/membership',
        icon: CreditCard
    },
    {
        title: 'Plans',
        url: '/admin/plans',
        icon: Package
    }, {
        title: 'Errors Logs',
        url: '/admin/errors',
        icon: Info
    }
];
const footerNavItems: NavItem[] = [
];
export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogoIcon iconClassName='w-8 h-8' />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
