export interface Servicio {
    [key: string]: any;
    service_id: string;
    user_id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    category: string;
}

export interface category {
    service_id: string;
    category: string;
}
