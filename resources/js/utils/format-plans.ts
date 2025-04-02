import type { Plan } from '@/types/pricing';

/**
 * Interfaz para los datos de características recibidos del servidor
 */
interface FeatureData {
    included?: boolean;
    text?: string;
    icon?: string;
}

/**
 * Formatea los datos de planes recibidos del servidor para mostrarlos correctamente
 * en el componente PricingCards.
 *
 * @param serverPlans - Planes recibidos del servidor
 * @returns Planes formateados para el componente PricingCards
 */
export default function formatPlans(serverPlans: any[]): Plan[] {
    if (!Array.isArray(serverPlans)) {
        console.warn('formatPlans: se esperaba un array de planes');
        return [];
    }

    return serverPlans.map((plan) => {
        // Formatea el precio para mostrarlo con el símbolo de moneda
        const formattedPrice = typeof plan.price === 'number' ? `$${plan.price.toFixed(2)}` : plan.price?.toString() || '$0';

        // Formatea el período con una barra antes
        const formattedPeriod = plan.period ? `/${plan.period}` : '/mes';

        // Validamos la variante del badge para asegurar que sea una de las permitidas
        let badgeVariant: 'default' | 'primary' | 'secondary' = 'default';
        if (plan.badge?.variant === 'primary') {
            badgeVariant = 'primary';
        } else if (plan.badge?.variant === 'secondary') {
            badgeVariant = 'secondary';
        }

        return {
            id: plan.id,
            title: plan.title || 'Plan sin nombre',
            description: plan.description || 'Sin descripción',
            price: formattedPrice,
            period: formattedPeriod,
            highlight: Boolean(plan.highlight),

            // Formatea el badge si existe (devolvemos undefined en lugar de null)
            badge: plan.badge
                ? {
                      text: plan.badge.text || '',
                      variant: badgeVariant,
                  }
                : undefined,

            // Texto y variante del botón (asegurando que buttonVariant sea del tipo correcto)
            buttonText: plan.buttonText || 'Suscribirse',
            buttonVariant: plan.buttonVariant === 'outline' || plan.buttonVariant === 'default' ? plan.buttonVariant : 'default',

            // Widget de pago si existe
            paymentWidget: plan.paymentWidget || undefined,

            // Formato de características
            features: Array.isArray(plan.features)
                ? plan.features.map((feature: FeatureData) => ({
                      included: Boolean(feature.included),
                      text: feature.text || '',
                      icon: feature.icon || undefined,
                  }))
                : [],
        };
    });
}
