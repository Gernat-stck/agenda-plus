import AppLayoutAdmin from "@/layouts/app-layout-admin";
import { SubscriptionStats } from "@/components/admin/membership/subscriptions-stats";
import { SubscriptionFilters } from "@/components/admin/membership/subscriptions-filter";
import { SubscriptionsTable } from "@/components/admin/membership/subscriptions-table";

export default function Index() {
    return (
        <AppLayoutAdmin breadcrumbs={[]}>
            <div className="flex flex-col gap-6 m-2">
                <SubscriptionStats />
                <SubscriptionFilters />
                <SubscriptionsTable />
            </div>
        </AppLayoutAdmin>
    )
}
