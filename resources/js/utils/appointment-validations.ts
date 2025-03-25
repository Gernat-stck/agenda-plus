import { format } from "date-fns";
import { toast } from "sonner";
import type { CalendarConfig, SpecialDate } from "@/types/calendar";

export function isDateAvailable(date: Date, config: CalendarConfig, specialDates: SpecialDate[]): {
    isAvailable: boolean;
    errorMessage?: string;
} {
    const dayOfWeek = date.getDay();
    const dateString = format(date, "yyyy-MM-dd");
    
    // Validar día laboral
    if (!config.business_days.includes(dayOfWeek)) {
        return {
            isAvailable: false,
            errorMessage: "No puedes programar citas en días no laborables"
        };
    }
    
    // Validar fecha especial
    const isSpecialDateDisabled = specialDates?.some(
        specialDate => {
            const specialDateString = specialDate.date.substring(0, 10);
            return specialDateString === dateString && !specialDate.is_available;
        }
    );
    
    if (isSpecialDateDisabled) {
        return {
            isAvailable: false,
            errorMessage: "Esta fecha está marcada como no disponible en el calendario"
        };
    }
    
    return { isAvailable: true };
}

export function isTimeWithinBusinessHours(time: Date, config: CalendarConfig): {
    isWithin: boolean;
    errorMessage?: string;
} {
    const timeString = format(time, "HH:mm");
    
    if (timeString < config.start_time || timeString > config.end_time) {
        return {
            isWithin: false,
            errorMessage: `El horario laboral es de ${config.start_time} a ${config.end_time}`
        };
    }
    
    return { isWithin: true };
}