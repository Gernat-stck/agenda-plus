export interface Cita {
    id: string;
    fecha: string;
    estado: 'Programado' | 'Completado' | 'Pendiente' | 'Cancelado';
    metodoPago: 'tarjeta' | 'efectivo';
}

export interface Cliente {
    id: string;
    nombre: string;
    contacto: number;
    correo: string;
    citas: Cita[];
}
