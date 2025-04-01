import { SpecialDate } from '@/types/calendar';
import { EventInput } from '@fullcalendar/core';

export function useBackgroundEvents(specialDates: SpecialDate[] | undefined) {
    const backgroundEvents: EventInput[] =
        specialDates?.map((date) => {
            // Extraer solo la parte de la fecha (YYYY-MM-DD)
            const specialDateStr = date.date.substring(0, 10);

            return {
                id: `special-${date.id}`,
                title: date.title,
                start: specialDateStr,
                allDay: true,
                display: 'background',
                backgroundColor: date.color || '#ff9f89',
                extendedProps: {
                    description: date.description,
                    isAvailable: date.is_available,
                    type: 'special-date',
                },
            };
        }) || [];

    return backgroundEvents;
}
