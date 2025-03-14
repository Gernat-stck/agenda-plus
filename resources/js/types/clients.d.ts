export interface Cita {
    appointment_id: string;
    service_id: string;
    title: string;
    start_time: Date;
    end_time: Date;
    status: 'pendiente' | 'en curso' | 'finalizado' | 'cancelado';
    payment_type: 'tarjeta' | 'efectivo' | '';
    client_name?: string;
    client_id?: string;
    [key: string]: any;
}

export interface Cliente {
    client_id: string;
    name: string;
    email: string;
    contact_number: string;
    citas?: Cita[];
}
