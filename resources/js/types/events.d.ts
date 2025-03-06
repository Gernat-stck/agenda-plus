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
}
