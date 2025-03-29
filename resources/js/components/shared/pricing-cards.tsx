import { Badge as UIBadge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle2, X, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useScript } from '../../hooks/use-script';
import { Plan } from '../../types/pricing';

interface PricingCardsProps {
    plans: Plan[];
    defaultActiveCard?: number;
    onCardSelect?: (planId: number) => void;
}

export function PricingCards({ plans, defaultActiveCard = 1, onCardSelect }: PricingCardsProps) {
    const [activeCard, setActiveCard] = useState<number>(defaultActiveCard);
    const cardsRef = useRef<(HTMLDivElement | undefined)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    useScript('https://pagos.wompi.sv/js/wompi.pagos.js');

    useEffect(() => {
        cardsRef.current = cardsRef.current.slice(0, plans.length);
    }, [plans.length]);

    const handleCardClick = (index: number) => {
        if (isTransitioning || activeCard === index) return;

        setIsTransitioning(true);
        setActiveCard(index);

        if (onCardSelect) {
            onCardSelect(plans[index].id);
        }

        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    };

    return (
        <div ref={containerRef} className="relative flex h-[400px] items-center justify-center">
            {plans.map((plan, index) => (
                <Card
                    key={plan.id}
                    ref={(el) => (cardsRef.current[index] = el)}
                    className={cn(
                        'absolute cursor-pointer transition-all duration-500 ease-in-out',
                        activeCard === index
                            ? 'z-20 scale-100 opacity-100 shadow-xl'
                            : index < activeCard
                              ? 'left-0 z-10 scale-90 -rotate-6 opacity-80 shadow-md hover:opacity-90'
                              : 'right-0 z-10 scale-90 rotate-6 opacity-80 shadow-md hover:opacity-90',
                        plan.highlight && activeCard === index ? 'border-primary/30' : 'border-muted/60',
                        isTransitioning ? 'pointer-events-none' : '',
                    )}
                    onClick={() => handleCardClick(index)}
                >
                    <div className="relative overflow-hidden">
                        {plan.badge && (
                            <div className="absolute top-4 right-4">
                                <UIBadge
                                    className={plan.badge.variant === 'primary' ? 'bg-primary text-primary-foreground px-3 py-1' : ''}
                                    variant={plan.badge.variant === 'primary' ? 'default' : 'secondary'}
                                >
                                    {plan.badge.text}
                                </UIBadge>
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
                                            feature.icon === 'zap' ? (
                                                <Zap className="mr-2 h-4 w-4 text-amber-500" />
                                            ) : (
                                                <CheckCircle2
                                                    className={cn('mr-2 h-4 w-4', activeCard === index ? 'text-primary' : 'text-primary/70')}
                                                />
                                            )
                                        ) : (
                                            <X className="text-destructive/70 mr-2 h-4 w-4" />
                                        )}
                                        {feature.text}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            {plan.paymentWidget && <div className="wompi_button_widget" data-url-pago={plan.paymentWidget}></div>}
                        </CardFooter>
                    </div>
                </Card>
            ))}
        </div>
    );
}
