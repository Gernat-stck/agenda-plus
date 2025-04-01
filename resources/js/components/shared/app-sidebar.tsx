import { NavFooter } from '@/components/shared/nav-footer';
import { NavMain } from '@/components/shared/nav-main';
import { NavUser } from '@/components/shared/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { CalendarCheck, Handshake, LayoutGrid, LifeBuoy, Link2Icon, UserCheck2 } from 'lucide-react';
import AppLogoIcon from './app-logo-icon';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Calendario',
        url: '/calendar',
        icon: CalendarCheck,
    },
    {
        title: 'Clientes',
        url: '/clients',
        icon: UserCheck2,
    },
    {
        title: 'servicios',
        url: '/services',
        icon: Handshake
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Atencion al cliente',
        url: '/support',
        icon: LifeBuoy,
    },
    {
        title: 'Link de registro',
        url: '/register/appointment/link',
        icon: Link2Icon,
    }
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
