import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatForDisplay(date: Date): string {
    return format(date, 'PPP', { locale: es });
}

export function formatForAPI(date: Date): string {
    return format(date, "yyyy-MM-dd'T'HH:mm:ss");
}
                                                                                                                                                   
export function formatDateForSlot(date: Date): string {
    return format(date, 'yyyy-MM-dd');
}

export function formatTime(date: Date): string {
    return format(date, 'HH:mm');
}

export function formatTimeRange(start: Date, end: Date): string {
    return `${formatTime(start)} - ${formatTime(end)}`;
}
