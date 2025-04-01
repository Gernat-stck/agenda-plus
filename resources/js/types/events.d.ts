import { EventInput } from '@fullcalendar/core/index.js';

// Tipo para nuestras citas
export interface Appointment extends EventInput {
    id: string;
    title: string;
    start: Date | string;
    end: Date | string;
    description?: string;
    clientName?: string;
    clientPhone?: string;
    clientEmail?: string;
    backgroundColor?: string;
    service_id?: string;
    status?: 'pendiente' | 'en curso' | 'finalizado' | 'cancelado';
    payment_type?: 'tarjeta' | 'efectivo' | '';
}
