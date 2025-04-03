import { PricingCards } from '@/components/shared/pricing-cards';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Plan } from '@/types/pricing';
import formatPlans from '../../utils/format-plans';

interface PlansProps {
    plans: Plan[];
}

export default function GetSuscription({ plans }: PlansProps) {
    const formattedPlans = formatPlans(plans);

    return (
        <div className="from-muted/40 to-muted/60 flex min-h-screen flex-col items-center justify-center bg-gradient-to-b p-8 ">
            <div className="w-full max-w-4xl ">
                <div className="text-center -mb-7">
                    <Badge variant="outline" className="border-amber-300 px-3 py-1 mb-3 text-sm font-medium bg-amber-200/30">
                        Acceso Restringido
                    </Badge>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Suscripción Requerida</h1>
                    <p className="text-muted-foreground mt-3">Necesitas una suscripción activa para acceder a este contenido premium</p>
                </div>

                <PricingCards plans={formattedPlans} />

                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="bg-muted/50 rounded-lg p-6 shadow-sm">
                        <h3 className="mb-2 text-lg font-medium">¿Por qué suscribirse?</h3>
                        <p className="text-muted-foreground mb-4 text-sm">
                            Desbloquea todas las funciones y contenido premium con nuestra suscripción. Cancela en cualquier momento.
                        </p>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="bg-background rounded-md p-3 shadow-sm">
                                <CheckCircle2 className="text-primary mx-auto mb-2 h-6 w-6" />
                                <p className="text-xs font-medium">Contenido Exclusivo</p>
                            </div>
                            <div className="bg-background rounded-md p-3 shadow-sm">
                                <CheckCircle2 className="text-primary mx-auto mb-2 h-6 w-6" />
                                <p className="text-xs font-medium">Sin Anuncios</p>
                            </div>
                            <div className="bg-background rounded-md p-3 shadow-sm">
                                <CheckCircle2 className="text-primary mx-auto mb-2 h-6 w-6" />
                                <p className="text-xs font-medium">Soporte Premium</p>
                            </div>
                        </div>
                    </div>
                    <Link
                        href="/"
                        className="border-muted bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground mt-6 flex items-center justify-center rounded-md border px-4 py-2 text-sm transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a la página principal
                    </Link>
                </div>
            </div>
        </div>
    );
}
