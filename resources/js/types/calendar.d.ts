export interface CalendarConfig {
    id?: number;
    user_id: string;
    show_weekend: boolean;
    start_time: string;
    end_time: string;
    business_days: number[];
    max_appointments: number; //Nuevo parametro
    slot_min_time?: string;
    slot_max_time?: string;
    [key: string]: any;
}

export interface SpecialDate {
    id: number;
    user_id: string;
    specialdate_id: string;
    title: string;
    date: string;
    is_available: boolean;
    color?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface TimeSlot {
    startTime: string; // HH:mm formato
    endTime: string; // HH:mm formato
    available: number; // Plazas disponibles
}
