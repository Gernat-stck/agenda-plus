import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';
interface PlanFeature {
    included: boolean;
    text: string;
    icon?: string;
}

interface Plan {
    id: number;
    badge?: { text: string; variant: 'primary' | 'secondary' };
    highlight?: boolean;
    buttonText: string;
    buttonVariant: 'default' | 'outline';
    title: string;
    description: string;
    price: string;
    period: string;
    features: PlanFeature[];
}

export default function GetSuscription() {
    const [activeCard, setActiveCard] = useState<number>(1);

    const plans: Plan[] = [
        {
            id: 0,
            title: 'Plan Gratuito',
            description: 'Funcionalidades básicas',
            price: '$0',
            period: '/mes',
            badge: { text: 'Actual', variant: 'secondary' },
            features: [
                { included: true, text: 'Acceso limitado' },
                { included: true, text: 'Funciones básicas' },
                { included: false, text: 'Sin contenido premium' },
                { included: false, text: 'Sin soporte prioritario' },
            ],
            buttonText: 'Plan Actual',
            buttonVariant: 'outline',
        },
        {
            id: 1,
            title: 'Plan Premium',
            description: 'Todo lo que necesitas',
            price: '$9.99',
            period: '/mes',
            badge: { text: 'Popular', variant: 'primary' },
            features: [
                { included: true, text: 'Acceso completo al contenido' },
                { included: true, text: 'Funciones exclusivas' },
                { included: true, text: 'Soporte estándar' },
                { included: true, text: 'Sin anuncios' },
            ],
            buttonText: 'Suscribirse Ahora',
            buttonVariant: 'default',
            highlight: true,
        },
        {
            id: 2,
            title: 'Plan Pro',
            description: 'Para usuarios avanzados',
            price: '$19.99',
            period: '/mes',
            features: [
                { included: true, text: 'Todo lo del plan Premium' },
                { included: true, text: 'Funciones avanzadas' },
                { included: true, text: 'Soporte prioritario 24/7' },
                { included: true, text: 'Acceso anticipado a nuevas funciones', icon: 'zap' },
            ],
            buttonText: 'Elegir Pro',
            buttonVariant: 'outline',
        },
    ];

    return (
        <div className="from-muted/40 to-muted/60 flex min-h-screen flex-col items-center justify-center bg-gradient-to-b p-4">
            <div className="w-full max-w-4xl">
                <div className="text-center">
                    <Badge variant="outline" className="mb-2 px-3 py-1 text-sm font-medium">
                        Acceso Restringido
                    </Badge>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Suscripción Requerida</h1>
                    <p className="text-muted-foreground mt-3">Necesitas una suscripción activa para acceder a este contenido premium</p>
                </div>

                <div className="relative flex h-[500px] items-center justify-center">
                    {plans.map((plan, index) => (
                        <Card
                            key={plan.id}
                            className={cn(
                                'absolute cursor-pointer transition-all duration-500 ease-in-out',
                                activeCard === index
                                    ? 'z-20 scale-100 opacity-100 shadow-xl'
                                    : index < activeCard
                                      ? 'left-0 z-10 scale-90 -rotate-6 opacity-80 shadow-md hover:opacity-90'
                                      : 'right-0 z-10 scale-90 rotate-6 opacity-80 shadow-md hover:opacity-90',
                                plan.highlight && activeCard === index ? 'border-primary/30' : 'border-muted/60',
                            )}
                            onClick={() => setActiveCard(index)}
                        >
                            <div className="relative overflow-hidden">
                                {plan.badge && (
                                    <div className="absolute top-4 right-4">
                                        <Badge
                                            className={plan.badge.variant === 'primary' ? 'bg-primary text-primary-foreground px-3 py-1' : ''}
                                            variant={plan.badge.variant === 'primary' ? 'default' : 'secondary'}
                                        >
                                            {plan.badge.text}
                                        </Badge>
                                    </div>
                                )}
                                {plan.highlight && activeCard === index && (
                                    <div className="bg-primary/10 absolute -top-12 -right-12 h-24 w-24 rounded-full"></div>
                                )}
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl">{plan.title}</CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>
                                    <div className="mt-2 flex items-baseline text-3xl font-bold">
                                        {plan.price}
                                        <span className="text-muted-foreground ml-1 text-sm font-medium">{plan.period}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-6">
                                    <ul className="space-y-2 text-sm">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className={cn('flex items-center', !feature.included && 'text-muted-foreground')}>
                                                {feature.included ? (
                                                    // Si está incluido, muestra el ícono correspondiente
                                                    feature.icon === 'zap' ? (
                                                        <Zap className="mr-2 h-4 w-4 text-amber-500" />
                                                    ) : (
                                                        <CheckCircle2
                                                            className={cn('mr-2 h-4 w-4', activeCard === index ? 'text-primary' : 'text-primary/70')}
                                                        />
                                                    )
                                                ) : (
                                                    // Si no está incluido, muestra la X
                                                    <X className="text-destructive/70 mr-2 h-4 w-4" />
                                                )}
                                                {feature.text}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button variant={plan.buttonVariant as 'default' | 'outline'} className="w-full">
                                        {plan.buttonText}
                                    </Button>
                                </CardFooter>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-center justify-center space-y-4 text-center">
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
