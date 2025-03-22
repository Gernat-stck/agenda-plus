import type { Cita } from '@/types/clients';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { toast } from 'sonner';

interface UseAppointmentRegistrationProps {
    userId: string;
    redirectRoute: string;
}

export function useAppointmentRegistration({ userId, redirectRoute }: UseAppointmentRegistrationProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSaveAppointment = (appointment: Cita) => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        // Formatear los datos para enviar al servidor
        const formattedAppointment = {
            ...appointment,
            start_time: format(appointment.start_time, "yyyy-MM-dd'T'HH:mm:ss"),
            end_time: format(appointment.end_time, "yyyy-MM-dd'T'HH:mm:ss"),
            user_id: userId,
        };

        // Enviar los datos al servidor usando Inertia
        router.post(route('appointments.public.store'), formattedAppointment, {
            onSuccess: () => {
                toast.success('Cita agendada correctamente', {
                    description: `${appointment.title} para el ${format(appointment.start_time, 'PPP', { locale: es })} a las ${format(appointment.start_time, 'HH:mm')}`,
                });
            },
            onError: (errors) => {
                // Mostrar errores
                Object.keys(errors).forEach((key) => {
                    toast.error(errors[key]);
                });
                setIsSubmitting(false);
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    const handleCancel = () => {
        // Redirigir a la página anterior o a la lista de citas
        router.visit(redirectRoute);
    };

    return {
        isSubmitting,
        handleSaveAppointment,
        handleCancel,
    };
}
