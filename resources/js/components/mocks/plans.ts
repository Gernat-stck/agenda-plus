import { Plan } from '@/types/pricing';
export const plans: Plan[] = [
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
        paymentWidget: 'https://u.wompi.sv/235192psZ',
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
        paymentWidget: 'https://u.wompi.sv/235192psZ', // Asumiendo la misma URL para este ejemplo
    },
];
