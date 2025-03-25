import { CalendarConfig, SpecialDate } from '@/types/calendar';
import { Cita } from '@/types/clients';
import { Appointment } from '@/types/events';
import { category } from '@/types/services';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function useCalendarEvents({
    appointments,
    setAppointments,
    selectedAppointment,
    setSelectedAppointment,
    isAppointmentDialogOpen,
    setIsAppointmentDialogOpen,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
    selectedDate,
    setSelectedDate,
    showDragConfirmation,
    setShowDragConfirmation,
    showFinalDragConfirmation,
    setShowFinalDragConfirmation,
    draggedEventInfo,
    setDraggedEventInfo,
    getRandomColor,
    safeConfig,
    categories,
    config,
    specialDates,
}: {
    appointments: Appointment[];
    setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
    selectedAppointment: Appointment | null;
    setSelectedAppointment: React.Dispatch<React.SetStateAction<Appointment | null>>;
    isAppointmentDialogOpen: boolean;
    setIsAppointmentDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isDetailsDialogOpen: boolean;
    setIsDetailsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedDate: Date | null;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
    showDragConfirmation: boolean;
    setShowDragConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
    showFinalDragConfirmation: boolean;
    setShowFinalDragConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
    draggedEventInfo: any;
    setDraggedEventInfo: React.Dispatch<React.SetStateAction<any>>;
    getRandomColor: () => string;
    safeConfig: CalendarConfig;
    categories: category[];
    config: CalendarConfig;
    specialDates: SpecialDate[];
}) {
    // Función para obtener la duración del servicio
    const getServiceDuration = (serviceId: string | undefined): number => {
        if (!serviceId) return 60;

        for (const cat of categories) {
            const service = cat.services.find((s) => s.service_id === serviceId);
            if (service) {
                return service.duration;
            }
        }
        return 60;
    };

    // Función adaptadora para convertir de Appointment a Cita
    const appointmentToCita = (appointment: Appointment | null): Cita | null => {
        if (!appointment) return null;

        return {
            appointment_id: appointment.id,
            service_id: appointment.service_id || '',
            title: appointment.title,
            start_time: appointment.start instanceof Date ? appointment.start : new Date(appointment.start),
            end_time: appointment.end instanceof Date ? appointment.end : new Date(appointment.end),
            status: appointment.status || 'pendiente',
            payment_type: appointment.payment_type || '',
        };
    };

    // Función para actualizar una cita existente
    const handleUpdateAppointment = (citaData: Cita) => {
        // Formatear fechas para preservar la zona horaria local
        const formattedStartTime = format(citaData.start_time, 'yyyy-MM-dd HH:mm:ss');
        const formattedEndTime = format(citaData.end_time, 'yyyy-MM-dd HH:mm:ss');

        // Crear el objeto de datos a enviar al servidor
        const updateData = {
            client_id: safeConfig.client_id,
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

                // Convertir citaData a un objeto Appointment para actualizar el estado local
                const updatedAppointment: Appointment = {
                    id: citaData.appointment_id,
                    title: citaData.title,
                    start: citaData.start_time,
                    end: citaData.end_time,
                    backgroundColor: selectedAppointment?.backgroundColor || getRandomColor(),
                    clientName: citaData.client_name,
                    clientId: config.client_id,
                    service_id: citaData.service_id,
                    status: citaData.status,
                    payment_type: citaData.payment_type,
                };

                setAppointments(appointments.map((apt) => (apt.id === citaData.appointment_id ? updatedAppointment : apt)));
                setIsAppointmentDialogOpen(false);
                setSelectedAppointment(null);
            },
            onError: (error) => {
                console.error('Error updating appointment:', error);
                toast.error('Error al actualizar la cita', {
                    description: error.message || 'Verifica los datos e intenta nuevamente',
                    duration: 5000,
                });
            },
        });
    };

    // Función para eliminar una cita
    const handleDeleteAppointment = (id: string) => {
        const appointmentToDelete = appointments.find((apt) => apt.id === id);

        router.delete(`appointments/calendar/${id}`, {
            onSuccess: () => {
                toast.success('Cita eliminada', {
                    description: appointmentToDelete ? `La cita "${appointmentToDelete.title}" ha sido eliminada.` : 'La cita ha sido eliminada.',
                    duration: 3000,
                });

                setAppointments(appointments.filter((apt) => apt.id !== id));
                setIsDetailsDialogOpen(false);
                setSelectedAppointment(null);
            },
            onError: (error) => {
                toast.error('Error al eliminar la cita', {
                    description: error.message,
                    duration: 5000,
                });
            },
        });
    };

    // Manejador para hacer clic en una fecha
    const handleDateClick = (info: any) => {
        setSelectedDate(info.date);
        setSelectedAppointment(null);
        toast.info('Debes seleccionar una cita para editarla', {
            description: 'Haz clic en una cita para ver más detalles o editarla.',
            duration: 3000,
        });
    };

    // Manejador para hacer clic en un evento
    const handleEventClick = (info: any) => {
        const appointment = appointments.find((apt) => apt.id === info.event.id);
        if (appointment) {
            setSelectedAppointment(appointment);
            setIsDetailsDialogOpen(true);
        }
    };

    // Manejador para editar una cita
    const handleEditAppointment = () => {
        setIsDetailsDialogOpen(false);
        setIsAppointmentDialogOpen(true);
    };

    // Manejador para cuando se arrastra y suelta un evento
    const handleEventDrop = (info: any) => {
        // Validaciones de día y horario
        const { event } = info;
        const newDate = event.start;
        const dayOfWeek = newDate.getDay();
        const newTimeString = format(newDate, 'HH:mm');

        // Validar día laborable
        if (!config.business_days.includes(dayOfWeek)) {
            info.revert();
            toast.error('Día no disponible', {
                description: 'No puedes programar citas en días no laborables.',
                duration: 3000,
            });
            return;
        }

        // Validar horario laboral
        if (newTimeString < config.start_time || newTimeString > config.end_time) {
            info.revert();
            toast.error('Horario no disponible', {
                description: `El horario laboral es de ${config.start_time} a ${config.end_time}.`,
                duration: 3000,
            });
            return;
        }

        // Validar fecha especial
        const dateString = format(newDate, 'yyyy-MM-dd');
        const isSpecialDateDisabled = specialDates?.some((specialDate) => specialDate.date === dateString && !specialDate.is_available);

        if (isSpecialDateDisabled) {
            info.revert();
            toast.error('Fecha no disponible', {
                description: 'Esta fecha está marcada como no disponible en el calendario.',
                duration: 3000,
            });
            return;
        }

        setDraggedEventInfo(info);
        setShowDragConfirmation(true);
        info.revert();
    };

    // Manejadores para la confirmación de arrastre
    const handleDragConfirm = () => {
        setShowDragConfirmation(false);
        setShowFinalDragConfirmation(true);
    };

    const handleFinalDragConfirm = () => {
        setShowFinalDragConfirmation(false);

        if (draggedEventInfo) {
            const { event } = draggedEventInfo;
            const originalAppointment = appointments.find((apt) => apt.id === event.id);

            if (originalAppointment) {
                const serviceDuration = getServiceDuration(originalAppointment.service_id);
                const newStart = event.start;
                const newEnd = new Date(newStart.getTime() + serviceDuration * 60000);

                if (format(newEnd, 'HH:mm') > config.end_time) {
                    toast.warning('La cita excede el horario laboral', {
                        description: 'La hora de finalización queda fuera del horario configurado.',
                        duration: 3000,
                    });
                }

                const updatedAppointment: Appointment = {
                    ...originalAppointment,
                    start: newStart,
                    end: newEnd,
                };

                // Formatear fechas
                const formattedStartTime = format(
                    updatedAppointment.start instanceof Date ? updatedAppointment.start : new Date(updatedAppointment.start),
                    'yyyy-MM-dd HH:mm:ss',
                );

                const formattedEndTime = format(
                    updatedAppointment.end instanceof Date ? updatedAppointment.end : new Date(updatedAppointment.end),
                    'yyyy-MM-dd HH:mm:ss',
                );

                // Actualizar la cita en la interfaz
                setAppointments(appointments.map((apt) => (apt.id === updatedAppointment.id ? updatedAppointment : apt)));

                // Enviar actualización al servidor
                router.patch(
                    `appointments/calendar/${updatedAppointment.id}`,
                    {
                        client_id: updatedAppointment.clientId,
                        appointment_id: updatedAppointment.id,
                        service_id: updatedAppointment.service_id,
                        title: updatedAppointment.title,
                        start_time: formattedStartTime,
                        end_time: formattedEndTime,
                        status: updatedAppointment.status,
                        payment_type: updatedAppointment.payment_type,
                    },
                    {
                        onSuccess: () => {
                            toast.success('Cita actualizada', {
                                description: `La cita "${updatedAppointment.title}" ha sido movida correctamente.`,
                                duration: 3000,
                            });
                        },
                        onError: (error) => {
                            toast.error('Error al mover la cita', {
                                description: error.message,
                                duration: 5000,
                            });
                        },
                    },
                );
            }
            setDraggedEventInfo(null);
        }
    };

    const handleDragCancel = () => {
        setDraggedEventInfo(null);
        setShowDragConfirmation(false);
        setShowFinalDragConfirmation(false);
    };

    return {
        getServiceDuration,
        appointmentToCita,
        handleUpdateAppointment,
        handleDeleteAppointment,
        handleDateClick,
        handleEventClick,
        handleEditAppointment,
        handleEventDrop,
        handleDragConfirm,
        handleFinalDragConfirm,
        handleDragCancel,
    };
}
