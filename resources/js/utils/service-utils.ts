import type { category } from "@/types/services";

/**
 * Obtiene la duración de un servicio específico
 */
export function getServiceDuration(serviceId: string, categories: category[]): number {
    if (!serviceId) return 60; // Duración predeterminada
    
    for (const cat of categories) {
        const service = cat.services.find(s => s.service_id === serviceId);
        if (service) {
            return typeof service.duration === "number" 
                ? service.duration 
                : Number.parseInt(String(service.duration), 10);
        }
    }
    
    return 60; // Duración predeterminada si no encuentra el servicio
}

/**
 * Obtiene el nombre de un servicio específico
 */
export function getServiceName(serviceId: string, categories: category[]): string {
    if (!serviceId) return "";
    
    for (const cat of categories) {
        const service = cat.services.find(s => s.service_id === serviceId);
        if (service) {
            return service.name;
        }
    }
    
    return "";
}

/**
 * Obtiene el precio de un servicio específico
 */
export function getServicePrice(serviceId: string, categories: category[]): string {
    if (!serviceId) return "";
    
    for (const cat of categories) {
        const service = cat.services.find(s => s.service_id === serviceId);
        if (service) {
            return service.price.toString();
        }
    }
    
    return "";
}

/**
 * Retorna toda la información de un servicio de una vez
 */
export function getServiceInfo(serviceId: string, categories: category[]) {
    if (!serviceId) {
        return {
            name: "",
            price: "",
            duration: 60
        };
    }
    
    for (const cat of categories) {
        const service = cat.services.find(s => s.service_id === serviceId);
        if (service) {
            return {
                name: service.name,
                price: service.price.toString(),
                duration: typeof service.duration === "number" 
                    ? service.duration 
                    : Number.parseInt(String(service.duration), 10)
            };
        }
    }
    
    return { name: "", price: "", duration: 60 };
}