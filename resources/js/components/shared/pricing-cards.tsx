import { Badge as UIBadge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X, Zap, Users, Headphones, BarChart, Download, Code, Server, Mail, User } from "lucide-react"
import { useEffect, useRef, useState, useMemo, memo, useCallback } from "react"
import { useScript } from "../../hooks/use-script"
import type { Plan } from "../../types/pricing"
import { router } from "@inertiajs/react"
import { SmoothScrollLink } from "./smooth-scroll-link"

// Declaración para TypeScript más precisa
declare global {
    interface Window {
        wompi?: {
            initialize: () => void
        }
        route: (name: string, params?: any) => string
    }
}

// Definición de interfaces para mejorar el tipado
interface Feature {
    text: string;
    included: boolean;
    icon?: string;
}

interface PricingCardsProps {
    plans: Plan[];
    defaultActiveCard?: number;
    onCardSelect?: (planId: string | number) => void;
}

// Mapa de iconos para acceso O(1)
const ICON_MAP = {
    users: Users,
    headphones: Headphones,
    "bar-chart": BarChart,
    download: Download,
    code: Code,
    server: Server,
    mail: Mail,
    zap: Zap,
    user: User,
} as const;

// Componente Feature memoizado
const Feature = memo(({ feature }: { feature: Feature }) => {
    if (!feature.text) return null;

    // Renderizar icono
    let icon = <User className="text-gray-500 mr-3 h-5 w-5" />;

    if (!feature.included) {
        icon = <X className="text-destructive/70 mr-3 h-5 w-5" />;
    } else if (feature.icon && feature.icon in ICON_MAP) {
        const IconComponent = ICON_MAP[feature.icon as keyof typeof ICON_MAP];
        icon = <IconComponent className="text-gray-500 mr-3 h-5 w-5" />;
    }

    return (
        <li className={cn("flex items-center", !feature.included && "text-gray-400")}>
            {icon}
            <span className="text-base text-gray-700">{feature.text}</span>
        </li>
    );
});

// Asignar nombre para devtools
Feature.displayName = "Feature";

// Componente PricingCard memoizado
const PricingCard = memo(({
    plan,
    isActive,
    isHomePage,
    index,
    activeCard,
    isTransitioning,
    onClick,
    cardRef
}: {
    plan: Plan
    isActive: boolean
    isHomePage: boolean
    index: number
    activeCard: number
    isTransitioning: boolean
    onClick: () => void
    cardRef: (el: HTMLDivElement | null) => void
}) => {
    const isPopular = plan.badge?.text === "Popular";

    // Cálculos de posicionamiento y estilo
    const { xPosition, zIndex, rotation, scale, opacity } = useMemo(() => {
        let xPos = 0, z = 10, rot = 0, s = 0.95, op = 0.9;

        if (isActive) {
            // Tarjeta activa (centro)
            xPos = 0;
            z = 30;
            s = 1;
            op = 1;
            rot = 0;
        } else {
            // Determinar posición relativa al centro (popular)
            const relativePosition = index - activeCard;

            // Determinar si es par o impar para alternar lados
            const isOdd = Math.abs(relativePosition) % 2 !== 0;

            // Calcular a qué distancia está del centro (en pasos)
            const stepsFromCenter = Math.ceil(Math.abs(relativePosition) / 2);

            // Determinar lado (izquierda o derecha)
            const side = isOdd ? 1 : -1;

            // Calcular posición X basada en distancia y lado
            xPos = side * (360 + ((stepsFromCenter - 1) * 80));

            // Rotación basada en el lado
            rot = side * 6;

            // z-index y opacidad disminuyen con la distancia
            z = isPopular ? 20 : Math.max(10 - stepsFromCenter, 1);
            op = Math.max(0.9 - (stepsFromCenter - 1) * 0.15, 0.3);
        }

        return { xPosition: xPos, zIndex: z, rotation: rot, scale: s, opacity: op };
    }, [isActive, index, activeCard, isPopular]);
    // Clase para el efecto neón
    const neonClass = isActive ? (isPopular ? "popular-neon-effect" : "neon-effect") : "";

    return (
        <Card
            ref={cardRef}
            className={cn(
                "absolute cursor-pointer transition-all duration-500 ease-in-out w-[320px] sm:w-[350px] md:w-[380px] min-h-[450px]",
                neonClass,
                isTransitioning ? "pointer-events-none" : "",
            )}
            style={{
                transform: `translateX(${xPosition}px) rotateY(${rotation}deg) scale(${scale})`,
                zIndex,
                opacity,
                boxShadow: isActive ? "0 10px 30px rgba(0, 0, 0, 0.08)" : "0 5px 15px rgba(0, 0, 0, 0.05)",
            }}
            onClick={onClick}
        >
            <div className="relative overflow-hidden flex flex-col h-full bg-white rounded-lg">
                {plan.badge && (
                    <div className="absolute top-0 right-0 z-10">
                        <UIBadge
                            className={cn(
                                "px-4 py-1 text-sm font-medium rounded-bl-md rounded-tr-md rounded-br-none rounded-tl-none",
                                isPopular ? "bg-black text-white" : "bg-gray-800 text-white",
                            )}
                        >
                            {plan.badge.text}
                        </UIBadge>
                    </div>
                )}
                <CardHeader className="pb-4 pt-6">
                    <CardTitle className="text-2xl font-bold">{plan.title}</CardTitle>
                    <CardDescription className="text-gray-500 mt-1">{plan.description}</CardDescription>
                    <div className="mt-5 flex items-baseline">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-gray-500 ml-1 text-base font-normal">{plan.period}</span>
                    </div>
                </CardHeader>
                <CardContent className="pb-6 flex-1">
                    <ul className="space-y-4">
                        {plan.features.map((feature, featureIndex) => (
                            <Feature key={featureIndex} feature={feature} />
                        ))}
                    </ul>
                </CardContent>
                <CardFooter className="mt-auto pt-2 pb-6">
                    {isHomePage ? (
                        <Button
                            onClick={() => router.visit(window.route("register"))}
                            className={cn(
                                "w-full h-11 text-base bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:from-purple-600 hover:to-pink-600 hover:shadow-purple-500/40",
                            )}
                        >

                            <SmoothScrollLink to={window.route("register")}>
                                {"Registrarse"}
                            </SmoothScrollLink>
                        </Button>
                    ) : plan.paymentWidget ? (
                        <div
                            className="wompi_button_widget w-full"
                            data-url-pago={plan.paymentWidget}
                            id={`wompi-button-${plan.id}`}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                            }}
                        ></div>
                    ) : (
                        <Button disabled className="w-full h-11 text-base" variant="outline">
                            Próximamente
                        </Button>
                    )}
                </CardFooter>
            </div>
        </Card>
    );
});

// Asignar nombre para devtools
PricingCard.displayName = "PricingCard";

export function PricingCards({ plans, defaultActiveCard = 1, onCardSelect }: PricingCardsProps) {
    // Encontrar el índice de la tarjeta con badge "Popular"
    const popularIndex = useMemo(() =>
        plans.findIndex((plan) => plan.badge?.text === "Popular"),
        [plans]
    );

    // Estado
    const [activeCard, setActiveCard] = useState<number>(popularIndex !== -1 ? popularIndex : defaultActiveCard);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Referencias
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const wompiInitialized = useRef<boolean>(false);

    // Cargar script de Wompi
    const status = useScript("https://pagos.wompi.sv/js/wompi.pagos.js");

    // Añadir un debounce para la inicialización de Wompi
    const debouncedWompiInit = useCallback(() => {
        if (window.wompi) {
            clearTimeout((window as any)._wompiInitTimeout);
            (window as any)._wompiInitTimeout = setTimeout(() => {
                try {
                    window.wompi?.initialize();
                    console.log("Wompi inicializado (debounced)");
                } catch (error) {
                    console.error("Error al inicializar Wompi:", error);
                }
            }, 500);
        }
    }, []);

    // Inicializar refs para las tarjetas - Optimizado para evitar recreaciones innecesarias
    useEffect(() => {
        // Solo redimensionar si es necesario
        if (cardsRef.current.length !== plans.length) {
            cardsRef.current = Array(plans.length).fill(null);
        }
    }, [plans.length]);

    // Inicializar Wompi cuando el script esté listo
    useEffect(() => {
        if (status === "ready" && window.wompi) {
            // Pequeño retraso para asegurar que los elementos del DOM estén listos
            const timeoutId = setTimeout(() => {
                try {
                    window.wompi?.initialize();
                    wompiInitialized.current = true;
                    sessionStorage.setItem("wompiInitialized", "true");
                } catch (error) {
                    console.error("Error al inicializar Wompi:", error);
                }
            }, 500); // Aumentamos el tiempo a 500ms para dar más margen

            return () => clearTimeout(timeoutId);
        }
    }, [status]);

    // Re-inicializar Wompi cuando cambia la tarjeta activa o los planes
    useEffect(() => {
        if (window.wompi) {
            const timeoutId = setTimeout(() => {
                try {
                    window.wompi?.initialize();
                } catch (error) {
                    console.error("Error al reinicializar Wompi:", error);
                }
            }, 500);

            return () => clearTimeout(timeoutId);
        }
    }, [activeCard, plans]); // Agregamos plans como dependencia


    const handleCardClick = (index: number) => {
        // Evitar trabajo innecesario
        if (isTransitioning || activeCard === index) return;

        setIsTransitioning(true);
        setActiveCard(index);

        if (onCardSelect) {
            onCardSelect(plans[index].id);
        }

        setTimeout(() => setIsTransitioning(false), 500);
    };

    // Verificar si estamos en la página principal (calculado solo una vez)
    const isHomePage = useMemo(() => window.location.pathname === "/", []);
    // Detectar los botones de wompi cuando se renderizan
    useEffect(() => {
        if (!window.wompi || isHomePage) return; // No necesitamos esto en la homepage

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    // Si detectamos nuevos nodos, inicializamos wompi
                    setTimeout(() => {
                        if (window.wompi) {
                            window.wompi.initialize();
                        }
                    }, 200);
                    break;
                }
            }
        });

        // Observar cambios en el contenedor de tarjetas
        if (containerRef.current) {
            observer.observe(containerRef.current, { childList: true, subtree: true });
        }

        return () => observer.disconnect();
    }, [isHomePage]);
    const forceWompiInitialization = () => {
        if (window.wompi) {
            try {
                window.wompi.initialize();
                console.log("Wompi reinicializado manualmente");
            } catch (error) {
                console.error("Error al reinicializar Wompi manualmente:", error);
            }
        }
    };

    // Añadir un efecto para detectar cambios de ruta y forzar inicialización
    useEffect(() => {
        // Si no estamos en la homepage Y tenemos Wompi disponible, forzar inicialización
        if (!isHomePage && window.wompi) {
            const timeoutId = setTimeout(() => {
                try {
                    window.wompi?.initialize();
                    console.log("Wompi inicializado automáticamente al detectar cambio de página");
                } catch (error) {
                    console.error("Error al inicializar Wompi después del cambio de página:", error);
                }
            }, 800); // Damos más tiempo para que el DOM esté completamente listo

            return () => clearTimeout(timeoutId);
        }
    }, [isHomePage]); // Solo depende de isHomePage para evitar re-renders innecesarios

    // Utilizar en efecto para detectar cambio de página
    useEffect(() => {
        if (!isHomePage) {
            debouncedWompiInit();
        }
    }, [isHomePage, debouncedWompiInit]);

    // Usar también en el observer
    useEffect(() => {
        if (!window.wompi || isHomePage) return;

        const observer = new MutationObserver(() => {
            debouncedWompiInit();
        });

        if (containerRef.current) {
            observer.observe(containerRef.current, { childList: true, subtree: true });
        }

        return () => observer.disconnect();
    }, [isHomePage, debouncedWompiInit]);

    return (
        <div className="w-full">
            <div
                ref={containerRef}
                className="relative mx-auto max-w-[1200px] min-h-[650px] flex items-center justify-center"
                style={{ perspective: "1000px" }}
            >
                {plans.map((plan, index) => (
                    <PricingCard
                        key={plan.id}
                        plan={plan}
                        isActive={index === activeCard}
                        isHomePage={isHomePage}
                        index={index}
                        activeCard={activeCard}
                        isTransitioning={isTransitioning}
                        onClick={() => handleCardClick(index)}
                        cardRef={(el) => {
                            cardsRef.current[index] = el;
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

