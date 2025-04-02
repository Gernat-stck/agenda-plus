import { PlanForm } from '@/components/admin/plans/plans-form';
import { PlansTable } from '@/components/admin/plans/plans-table';
import { Button } from '@/components/ui/button';
import AppLayoutAdmin from '@/layouts/app-layout-admin';
import { BreadcrumbItem } from '@/types';
import { Plan } from '@/types/pricing';
import { ArrowLeft, PlusIcon } from 'lucide-react';
import { useState } from 'react';

interface PlansProps {
    plans: Plan[];
}
export default function Index({ plans }: PlansProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

    // Breadcrumbs dinámicos que cambian según el estado
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Admin Plans',
            href: '/admin/plans',
        },
        ...(isCreating ? [{ title: 'Crear Plan', href: '#' }] : []),
        ...(selectedPlan ? [{ title: 'Editar Plan', href: '#' }] : []),
    ];

    const handleCreateClick = () => {
        setIsCreating(true);
        setSelectedPlan(null);
    };

    const handleBackClick = () => {
        setIsCreating(false);
        setSelectedPlan(null);
    };

    const handleEditPlan = (id: string) => {
        // Buscar el plan por ID en el array de planes
        const planToEdit = plans.find((plan) => plan.id.toString() === id);
        if (planToEdit) {
            setSelectedPlan(planToEdit);
            setIsCreating(false);
        }
    };

    return (
        <AppLayoutAdmin breadcrumbs={breadcrumbs}>
            <div className="m-2 flex flex-col gap-4">
                {isCreating || selectedPlan ? (
                    <>
                        <div className="mt-3 flex items-center justify-between">
                            <Button
                                variant="outline"
                                onClick={handleBackClick}
                                className="flex items-center gap-2 border-purple-500/50 text-purple-500 transition-all duration-300 hover:bg-purple-500/10 hover:text-purple-400 dark:border-purple-400/50 dark:text-purple-400 dark:hover:text-purple-300"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Volver a la lista
                            </Button>
                        </div>
                        <PlanForm plan={selectedPlan} />
                    </>
                ) : (
                    // Mostrar la lista de planes
                    <>
                        <div className="mt-3 flex items-center justify-end">
                            <Button
                                variant="outline"
                                onClick={handleCreateClick}
                                className="flex items-center gap-2 border-purple-500/50 text-purple-500 transition-all duration-300 hover:bg-purple-500/10 hover:text-purple-400 dark:border-purple-400/80 dark:text-purple-400 dark:hover:text-purple-300"
                            >
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Crear Plan
                            </Button>
                        </div>
                        <PlansTable plans={plans} onEditPlan={handleEditPlan} />
                    </>
                )}
            </div>
        </AppLayoutAdmin>
    );
}
