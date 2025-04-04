import { Badge as UIBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { BarChart, Code, Download, Headphones, Mail, Server, User, Users, X, Zap } from 'lucide-react';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import type { Plan } from '../../types/pricing';
import { SmoothScrollLink } from './smooth-scroll-link';

// Add this at the beginning of the component, right after the imports
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
};

// Declaración para TypeScript más precisa// Actualiza la declaración existente al inicio de tu archivo
declare global {
    interface Window {
        wompi: {
            initialize: () => void;
        };
        route: (name: string, params?: any) => string;
        // Añadir las nuevas propiedades personalizadas
        _wompiInitCallbacks?: Array<() => void>;
        _wompiReady?: () => void;
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

// Función para obtener el ID del botón de Wompi
function getWompiButtonId(planId: string | number): string {
    return `wompi-button-${planId}`;
}

// Mapa de iconos para acceso O(1)
const ICON_MAP = {
    users: Users,
    headphones: Headphones,
    'bar-chart': BarChart,
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
    let icon = <User className="mr-3 h-5 w-5 text-gray-500" />;

    if (!feature.included) {
        icon = <X className="text-destructive/70 mr-3 h-5 w-5" />;
    } else if (feature.icon && feature.icon in ICON_MAP) {
        const IconComponent = ICON_MAP[feature.icon as keyof typeof ICON_MAP];
        icon = <IconComponent className="mr-3 h-5 w-5 text-gray-500" />;
    }

    return (
        <li className={cn('flex items-center text-sm sm:text-base', !feature.included && 'text-gray-400')}>
            {icon}
            <span className="text-sm text-gray-700 sm:text-base dark:text-gray-300">{feature.text}</span>
        </li>
    );
});

// Asignar nombre para devtools
Feature.displayName = 'Feature';

// Componente PricingCard memoizado
const PricingCard = memo(
    ({
        plan,
        isActive,
        isHomePage,
        index,
        activeCard,
        isTransitioning,
        onClick,
        cardRef,
        wompiFailure,
        wompiInitialized,
    }: {
        plan: Plan;
        isActive: boolean;
        isHomePage: boolean;
        index: number;
        activeCard: number;
        isTransitioning: boolean;
        onClick: () => void;
        cardRef: (el: HTMLDivElement | null) => void;
        wompiFailure: boolean;
        wompiInitialized: boolean;
    }) => {
        const isPopular = plan.badge?.text === 'Popular';
        const isMobile = useIsMobile();

        // Cálculos de posicionamiento y estilo
        const { xPosition, zIndex, rotation, scale, opacity } = useMemo(() => {
            let xPos = 0,
                z = 10,
                rot = 0,
                s = 0.95,
                op = 0.9;

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
                xPos = isMobile
                    ? side * (180 + (stepsFromCenter - 1) * 40)
                    : side * (window.innerWidth < 768 ? 220 : 360) + (stepsFromCenter - 1) * (window.innerWidth < 768 ? 40 : 80);

                // Rotación basada en el lado
                rot = side * 6;

                // z-index y opacidad disminuyen con la distancia
                z = isPopular ? 20 : Math.max(10 - stepsFromCenter, 1);
                op = Math.max(0.9 - (stepsFromCenter - 1) * 0.15, 0.3);
            }

            return { xPosition: xPos, zIndex: z, rotation: rot, scale: s, opacity: op };
        }, [isActive, index, activeCard, isPopular, isMobile]);

        // Clase para el efecto neón
        const neonClass = isActive ? (isPopular ? 'popular-neon-effect' : 'neon-effect') : '';

        return (
            <Card
                ref={cardRef}
                className={cn(
                    'xs:w-[320px] absolute min-h-[450px] w-[280px] cursor-pointer transition-all duration-500 ease-in-out sm:w-[350px] md:w-[380px]',
                    neonClass,
                    isTransitioning ? 'pointer-events-none' : '',
                )}
                style={{
                    transform: `translateX(${xPosition}px) rotateY(${rotation}deg) scale(${scale})`,
                    zIndex,
                    opacity,
                    boxShadow: isActive ? '0 10px 30px rgba(0, 0, 0, 0.08)' : '0 5px 15px rgba(0, 0, 0, 0.05)',
                }}
                onClick={onClick}
            >
                <div className="relative flex h-full flex-col overflow-hidden rounded-lg">
                    {plan.badge && (
                        <div className="absolute top-0 right-0 z-10">
                            <UIBadge
                                className={cn(
                                    'rounded-tl-none rounded-tr-md rounded-br-none rounded-bl-md px-4 py-1 text-sm font-medium',
                                    isPopular
                                        ? 'bg-black text-white dark:bg-white dark:text-black'
                                        : 'bg-gray-800 text-white dark:bg-white dark:text-black',
                                )}
                            >
                                {plan.badge.text}
                            </UIBadge>
                        </div>
                    )}
                    <CardHeader className="pt-4 pb-2 sm:pt-6 sm:pb-4">
                        <CardTitle className="text-xl font-bold sm:text-2xl">{plan.title}</CardTitle>
                        <CardDescription className="mt-1 text-sm text-gray-500 sm:text-base">{plan.description}</CardDescription>
                        <div className="mt-3 flex items-baseline sm:mt-5">
                            <span className="text-3xl font-bold sm:text-4xl">{plan.price}</span>
                            <span className="ml-1 text-sm font-normal text-gray-500 sm:text-base">{plan.period}</span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 pb-4 sm:pb-6">
                        <ul className="space-y-4">
                            {plan.features.map((feature, featureIndex) => (
                                <Feature key={featureIndex} feature={feature} />
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter className="mt-auto pt-2 pb-6">
                        {isHomePage && plan.paymentWidget ? (
                            <Button
                                onClick={() => router.visit(window.route('register'))}
                                className={cn(
                                    'h-11 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-base text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:from-purple-600 hover:to-pink-600 hover:shadow-purple-500/40',
                                )}
                            >
                                <SmoothScrollLink to={window.route('register')}>{'Registrarse'}</SmoothScrollLink>
                            </Button>
                        ) : plan.paymentWidget ? (
                            <>
                                {!wompiFailure && (
                                    <div
                                        className="wompi_button_widget w-full opacity-0"
                                        data-url-pago={plan.paymentWidget}
                                        id={getWompiButtonId(plan.id)}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            width: '100%',
                                            minHeight: '44px',
                                            transition: 'opacity 0.3s ease-in-out',
                                        }}
                                    />
                                )}
                                {wompiFailure && (
                                    <div className="flex h-11 w-full items-center justify-center rounded-md border bg-white text-red-500">
                                        Error al cargar el botón de pago
                                    </div>
                                )}
                            </>
                        ) : (
                            <Button disabled className="h-11 w-full text-base" variant="outline">
                                Próximamente
                            </Button>
                        )}
                    </CardFooter>
                </div>
            </Card>
        );
    },
);

// Asignar nombre para devtools
PricingCard.displayName = 'PricingCard';

export function PricingCards({ plans, defaultActiveCard = 1, onCardSelect }: PricingCardsProps) {
    const isMobile = useIsMobile();

    // Encontrar el índice de la tarjeta con badge "Popular"
    const popularIndex = useMemo(() => plans.findIndex((plan) => plan.badge?.text === 'Popular'), [plans]);

    // Estado
    const [activeCard, setActiveCard] = useState<number>(popularIndex !== -1 ? popularIndex : defaultActiveCard);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Referencias
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Verificar si estamos en la página principal o en membership
    const isHomePage = useMemo(() => window.location.pathname === '/', []);
    const isMembershipPage = useMemo(() => window.location.pathname === '/membership', []);

    const [wompiInitialized, setWompiInitialized] = useState(false);
    const [wompiFailure, setWompiFailure] = useState(false);

    // Inicializar refs para las tarjetas
    useEffect(() => {
        if (cardsRef.current.length !== plans.length) {
            cardsRef.current = Array(plans.length).fill(null);
        }
    }, [plans.length]);

    useEffect(() => {
        // Solo proceder si estamos en la página de membresía
        if (!isMembershipPage) {
            return;
        }

        // Limpiar cualquier estado previo
        setWompiInitialized(false);
        setWompiFailure(false);

        // Bloquear y eliminar cualquier script existente de Wompi
        const existingScript = document.querySelector('script[src*="wompi.pagos.js"]');
        if (existingScript && existingScript.parentNode) {
            existingScript.parentNode.removeChild(existingScript);
        }

        // Agregar estilos para animaciones con reset previo
        const addStyles = () => {
            // Eliminar estilos existentes para evitar conflictos
            const existingStyle = document.getElementById('wompi-transition-style');
            if (existingStyle) existingStyle.remove();

            const wompiStyle = document.createElement('style');
            wompiStyle.id = 'wompi-transition-style';
            wompiStyle.textContent = `
            /* Ocultar botón de Wompi original con !important para asegurar que siempre se aplique */
            .wompi_button_widget iframe, 
            .wompi_button_widget form {
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
            }
            
            /* Estilo para nuestro contenido controlado */
            .wompi_button_widget {
                position: relative !important;
                opacity: 1 !important; 
                transition: opacity 0.3s ease-in-out;
                min-height: 44px;
            }
            
            /* Animación del skeleton */
            .skeleton-loading {
                background: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.5) 50%, rgba(0,0,0,0) 100%);
                animation: shimmer 1.5s infinite;
                background-size: 200% 100%;
            }
            
            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            
            /* Control de animaciones para el botón personalizado */
            .wompi-button-container {
                opacity: 0;
                transform: translateY(4px);
                transition: all 0.3s ease-out;
            }
            
            /* Wrapper para mantener dimensiones consistentes */
            .skeleton-wrapper {
                width: 100%; 
                height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 20;
                position: relative;
            }
            
            /* Clase activa para skeleton - asegurando prioridad */
            .skeleton-active {
                z-index: 10;
            }
            
            /* Prevenir interferencias externas */
            .wompi_button_widget * {
                z-index: 1;
            }
            
            .wompi_button_widget .our-content {
                z-index: 20;
            }
        `;
            document.head.appendChild(wompiStyle);
        };

        // Mostrar skeleton loader para todos los widgets de Wompi
        const showSkeletonLoaders = () => {
            document.querySelectorAll('.wompi_button_widget').forEach((widget) => {
                const element = widget as HTMLElement;

                // Añadir clase de control
                element.classList.add('skeleton-active');

                // Capturar el URL de pago para usarlo después
                const urlPago = element.dataset.urlPago || element.getAttribute('data-url-pago');
                if (urlPago) {
                    element.dataset.urlPago = urlPago;
                }

                // Vaciar completamente el elemento para eliminar cualquier contenido de Wompi
                element.innerHTML = `
                <div class="our-content skeleton-wrapper">
                    <div class="w-full h-11 flex items-center justify-center bg-white border rounded-md overflow-hidden">
                        <div class="w-full h-full relative bg-gradient-to-r from-gray-100 to-gray-200">
                            <div class="absolute inset-0 skeleton-loading"></div>
                        </div>
                    </div>
                </div>
            `;

                // Asegurar visibilidad y estilo correcto
                element.style.opacity = '1';
                element.style.position = 'relative';
            });
        };

        // Función dedicada a limpiar cualquier interferencia de Wompi
        const cleanWompiInterference = () => {
            document.querySelectorAll('.wompi_button_widget').forEach((widget) => {
                const element = widget as HTMLElement;

                // Eliminar iframes o forms que Wompi pueda haber insertado
                element.querySelectorAll('iframe, form').forEach((node) => {
                    if (node.parentNode) {
                        node.parentNode.removeChild(node);
                    }
                });

                // Asegurarse que nuestro contenido esté visible y al frente
                const ourContent = element.querySelector('.our-content');
                if (!ourContent) {
                    showSkeletonLoaders(); // Re-insertar nuestro contenido si fue eliminado
                }
            });
        };

        // Cargar nuestros botones personalizados finales
        const loadCustomButtons = () => {
            document.querySelectorAll('.wompi_button_widget').forEach((widget) => {
                const element = widget as HTMLElement;
                const urlPago = element.dataset.urlPago || element.getAttribute('data-url-pago');

                // Eliminar la clase skeleton-active
                element.classList.remove('skeleton-active');

                // Configurar el container para nuestro botón
                element.innerHTML = `
                <div class="our-content wompi-button-container" style="width:100%; max-width:100%; display:flex; justify-content:center;">
                    ${
                        urlPago
                            ? `<a 
                            href="${urlPago}" 
                            class="flex items-center justify-center gap-2 bg-gradient-to-br from-purple-500 to-pink-200 text-white py-2 px-4 rounded-md hover:from-purple-600 hover:to-pink-600 hover:shadow-purple-500/40 duration-300 transition-colors w-full max-w-xs"
                        >      
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-shield-check-icon lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
                            <span>Pagar con <span class="font-bold">Wompi</span></span>
                        </a>`
                            : `<div class="w-full h-11 flex items-center justify-center bg-white border rounded-md text-red-500">
                            No se encontró enlace de pago
                        </div>`
                    }
                </div>
            `;

                // Animar la aparición con un pequeño retardo
                setTimeout(() => {
                    const buttonContainer = element.querySelector('.wompi-button-container');
                    if (buttonContainer instanceof HTMLElement) {
                        buttonContainer.style.opacity = '1';
                        buttonContainer.style.transform = 'translateY(0)';
                    }
                }, 100);
            });

            setWompiInitialized(true);
        };

        // Secuencia de inicialización
        const initializeSequence = () => {
            // 1. Agregar estilos primero (prioridad alta)
            addStyles();

            // 2. Mostrar skeletons inmediatamente
            showSkeletonLoaders();

            // 3. Configurar un intervalo para limpiar interferencias constantemente
            const cleanupInterval = setInterval(cleanWompiInterference, 100);

            // 4. Instalar un MutationObserver en cada widget para detectar cambios
            const observerConfig = { childList: true, subtree: true, attributes: true };
            const observers: MutationObserver[] = [];

            document.querySelectorAll('.wompi_button_widget').forEach((widget) => {
                const observer = new MutationObserver(() => {
                    // Si Wompi modifica el contenido, restaurar nuestro skeleton
                    if (!wompiInitialized) {
                        cleanWompiInterference();
                    }
                });

                observer.observe(widget, observerConfig);
                observers.push(observer);
            });

            // 5. Cargar el script de Wompi solo para obtener tokens (pero nunca mostrar sus botones)
            setTimeout(() => {
                const script = document.createElement('script');
                script.src = 'https://pagos.wompi.sv/js/wompi.pagos.js';
                script.async = true;
                script.defer = true;

                // Cuando el script cargue, seguir mostrando nuestro skeleton
                script.onload = () => {
                    // Limpiar interferencia de inmediato
                    cleanWompiInterference();

                    // Esperar un tiempo antes de mostrar nuestros botones personalizados
                    setTimeout(() => {
                        clearInterval(cleanupInterval);
                        loadCustomButtons();
                    }, 1500);
                };

                // Si hay un error, cargar nuestros botones personalizados directamente
                script.onerror = () => {
                    clearInterval(cleanupInterval);
                    loadCustomButtons();
                    setWompiFailure(true);
                    console.error('Error al cargar el script de Wompi');
                };

                document.head.appendChild(script);
            }, 300);

            // 6. Timeout de seguridad para asegurar que siempre mostramos algo
            const safetyTimeout = setTimeout(() => {
                clearInterval(cleanupInterval);
                if (!wompiInitialized) {
                    loadCustomButtons();
                }
            }, 5000);

            // 7. Limpieza al desmontar el componente
            return () => {
                clearInterval(cleanupInterval);
                clearTimeout(safetyTimeout);
                observers.forEach((observer) => observer.disconnect());

                const wompiStyle = document.getElementById('wompi-transition-style');
                if (wompiStyle) wompiStyle.remove();
            };
        };

        // Iniciar la secuencia
        return initializeSequence();
    }, [isMembershipPage]);

    // Add this useEffect after the other useEffect hooks
    useEffect(() => {
        const handleResize = () => {
            // Force re-render to update positions based on new screen size
            setActiveCard((prev) => prev);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Manejador de clic en tarjetas
    const handleCardClick = (index: number) => {
        if (isTransitioning || activeCard === index) return;

        setIsTransitioning(true);
        setActiveCard(index);

        if (onCardSelect) {
            onCardSelect(plans[index].id);
        }

        setTimeout(() => setIsTransitioning(false), 500);
    };

    return (
        <div className="w-full">
            <div
                ref={containerRef}
                className="relative mx-auto flex min-h-[550px] w-full max-w-[1200px] items-center justify-center overflow-hidden sm:min-h-[600px] md:min-h-[650px]"
                style={{ perspective: '1000px' }}
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
                        wompiFailure={wompiFailure}
                        wompiInitialized={wompiInitialized}
                    />
                ))}
            </div>
        </div>
    );
}
