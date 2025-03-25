import type { TimeSlot } from '@/types/calendar';
import axios from 'axios';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

export function useAvailableSlots(userId?: string) {
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(false);

    const loadAvailableSlots = async (date: Date) => {
        setLoading(true);
        try {
            const dateStr = format(date, 'yyyy-MM-dd');
            // Usar userId si está disponible para obtener slots específicos de ese usuario
            const endpoint = userId ? `/book/appointments/slots/${dateStr}/${userId}` : `/available/slots/${dateStr}`;

            const response = await axios.get(endpoint);

            // Manejar diferentes formatos de respuesta
            if (Array.isArray(response.data)) {
                setAvailableSlots(response.data);
            } else if (response.data && response.data.slots) {
                setAvailableSlots(response.data.slots);
            } else if (response.data && response.data.availableSlots) {
                setAvailableSlots(response.data.availableSlots);
            } else {
                console.error('Formato de respuesta inesperado:', response.data);
                setAvailableSlots([]);
                toast.error('Error al cargar los horarios disponibles');
            }
        } catch (error) {
            console.error('Error al cargar los horarios disponibles:', error);
            toast.error('Error al cargar los horarios disponibles');
            setAvailableSlots([]);
        } finally {
            setLoading(false);
        }
    };

    return { availableSlots, loading, loadAvailableSlots };
}
