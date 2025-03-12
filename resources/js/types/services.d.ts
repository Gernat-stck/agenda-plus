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
export interface Servicios {
    service_id: string;
    name: string;
    price: string;
    duration: number;
}
export interface category {
    name: string;
    services: Servicios[];
}
