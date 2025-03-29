export interface PlanFeature {
    included: boolean;
    text: string;
    icon?: string;
}

export interface Plan {
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
    paymentWidget?: string; // URL de pago o ID del widget
}
