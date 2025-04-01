import { Appointment } from '@/types/events';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import { CalendarConfig, SpecialDate } from '../types/calendar';
import { Cita } from '../types/clients';

interface AppointmentActionsProps {
    config: CalendarConfig;
    specialDates?: SpecialDate[];
    onSuccess?: (updatedAppointment: Appointment) => void;
    onDelete?: (appointmentId: string) => void;
    onError?: (error: any) => void;
}

export function useAppointmentActions({ config, specialDates, onSuccess, onDelete, onError }: AppointmentActionsProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Función para generar colores aleatorios para las citas
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 10)];
        }
        return color;
    };

    // Convierte un objeto Cita a un objeto Appointment
    const mapCitaToAppointment = (cita: any): Appointment => {
        return {
            id: cita.appointment_id,
            title: cita.title,
            start: new Date(cita.start_time),
            end: new Date(cita.end_time),
            description: `Cliente: ${cita.client_name || 'Sin asignar'} | Estado: ${cita.status}${cita.payment_type ? ` | Pago: ${cita.payment_type}` : ''}`,
            backgroundColor: getRandomColor(),
            service_id: cita.service_id,
            status: cita.status,
            payment_type: cita.payment_type,
            clientName: cita.client_name || '',
            clientId: cita.client_id || '',
        };
    };

    // Convierte un array de Citas a un array de Appointments
    const mapCitasToAppointments = (citas: Cita[]): Appointment[] => {
        return citas.map(mapCitaToAppointment);
    };

    // Crea una nueva cita
    const createAppointment = (citaData: Cita) => {
        setIsLoading(true);

        // Formatear fechas para preservar la zona horaria local
        const formattedStartTime = format(citaData.start_time, 'yyyy-MM-dd HH:mm:ss');
        const formattedEndTime = format(citaData.end_time, 'yyyy-MM-dd HH:mm:ss');

        const createData = {
            client_id: citaData.client_id || config.client_id,
            service_id: citaData.service_id || '',
            title: citaData.title,
            start_time: formattedStartTime,
            end_time: formattedEndTime,
            status: citaData.status || 'pendiente',
            payment_type: citaData.payment_type || '',
        };

        router.post('appointments/calendar', createData, {
            onSuccess: () => {
                toast.success('Cita creada', {
                    description: `La cita "${citaData.title}" ha sido creada.`,
                    duration: 3000,
                });

                // Crear el objeto Appointment actualizado
                const createdAppointment: Appointment = {
                    id: citaData.appointment_id || 'temp-id', // El servidor asignará el ID real
                    title: citaData.title,
                    start: citaData.start_time,
                    end: citaData.end_time,
                    backgroundColor: getRandomColor(),
                    clientName: citaData.client_name || '',
                    clientId: citaData.client_id || config.client_id,
                    service_id: citaData.service_id || '',
                    status: citaData.status || 'pendiente',
                    payment_type: citaData.payment_type || '',
                };

                if (onSuccess) onSuccess(createdAppointment);
                setIsLoading(false);
            },
            onError: (error) => {
                console.error('Error creating appointment:', error);
                toast.error('Error al crear la cita', {
                    description: error.message || 'Verifica los datos e intenta nuevamente',
                    duration: 5000,
                });
                if (onError) onError(error);
                setIsLoading(false);
            },
        });
    };

    // Actualiza una cita existente
    const updateAppointment = (citaData: Cita) => {
        setIsLoading(true);

        // Formatear fechas para preservar la zona horaria local
        const formattedStartTime = format(citaData.start_time, 'yyyy-MM-dd HH:mm:ss');
        const formattedEndTime = format(citaData.end_time, 'yyyy-MM-dd HH:mm:ss');

        const updateData = {
            client_id: citaData.client_id || config.client_id,
            service_id: citaData.service_id || '',
            title: citaData.title,
            start_time: formattedStartTime,
            end_time: formattedEndTime,
            status: citaData.status || 'pendiente',
            payment_type: citaData.payment_type || '',
        };

        router.patch(`appointments/calendar/${citaData.appointment_id}`, updateData, {
            onSuccess: () => {
                toast.success('Cita actualizada', {
                    description: `La cita "${citaData.title}" ha sido modificada.`,
                    duration: 3000,
                });

                // Crear el objeto Appointment actualizado
                const updatedAppointment: Appointment = {
                    id: citaData.appointment_id,
                    title: citaData.title,
                    start: citaData.start_time,
                    end: citaData.end_time,
                    backgroundColor: getRandomColor(),
                    clientName: citaData.client_name || '',
                    clientId: citaData.client_id || config.client_id,
                    service_id: citaData.service_id || '',
                    status: citaData.status || 'pendiente',
                    payment_type: citaData.payment_type || '',
                };

                if (onSuccess) onSuccess(updatedAppointment);
                setIsLoading(false);
            },
            onError: (error) => {
                console.error('Error updating appointment:', error);
                toast.error('Error al actualizar la cita', {
                    description: error.message || 'Verifica los datos e intenta nuevamente',
                    duration: 5000,
                });
                if (onError) onError(error);
                setIsLoading(false);
            },
        });
    };

    // Elimina una cita
    const deleteAppointment = (appointmentId: string) => {
        setIsLoading(true);

        router.delete(`appointments/calendar/${appointmentId}`, {
            onSuccess: () => {
                toast.success('Cita eliminada', {
                    description: 'La cita ha sido eliminada correctamente.',
                    duration: 3000,
                });

                if (onDelete) onDelete(appointmentId);
                setIsLoading(false);
            },
            onError: (error) => {
                toast.error('Error al eliminar la cita', {
                    description: error.message || 'No se pudo eliminar la cita.',
                    duration: 5000,
                });
                if (onError) onError(error);
                setIsLoading(false);
            },
        });
    };

    // Actualiza la posición de una cita (drag & drop)
    const updateAppointmentPosition = (appointment: Appointment, newStart: Date, newEnd: Date) => {
        setIsLoading(true);

        // Formatear fechas
        const formattedStartTime = format(newStart, 'yyyy-MM-dd HH:mm:ss');
        const formattedEndTime = format(newEnd, 'yyyy-MM-dd HH:mm:ss');

        router.patch(
            `appointments/calendar/${appointment.id}`,
            {
                client_id: appointment.clientId || config.client_id,
                appointment_id: appointment.id,
                service_id: appointment.service_id || '',
                title: appointment.title,
                start_time: formattedStartTime,
                end_time: formattedEndTime,
                status: appointment.status || 'pendiente',
                payment_type: appointment.payment_type || '',
            },
            {
                onSuccess: () => {
                    toast.success('Cita actualizada', {
                        description: `La cita "${appointment.title}" ha sido movida correctamente.`,
                        duration: 3000,
                    });

                    // Crear el objeto Appointment actualizado
                    const updatedAppointment: Appointment = {
                        ...appointment,
                        start: newStart,
                        end: newEnd,
                    };

                    if (onSuccess) onSuccess(updatedAppointment);
                    setIsLoading(false);
                },
                onError: (error) => {
                    toast.error('Error al mover la cita', {
                        description: error.message || 'No se pudo actualizar la posición de la cita.',
                        duration: 5000,
                    });
                    if (onError) onError(error);
                    setIsLoading(false);
                },
            },
        );
    };

    return {
        isLoading,
        getRandomColor,
        mapCitaToAppointment,
        mapCitasToAppointments,
        createAppointment,
        updateAppointment,
        deleteAppointment,
        updateAppointmentPosition,
    };
}
