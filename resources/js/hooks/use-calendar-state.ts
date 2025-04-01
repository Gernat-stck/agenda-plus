import { CalendarConfig } from '@/types/calendar';
import { Cita } from '@/types/clients';
import { Appointment } from '@/types/events';
import { useEffect, useState } from 'react';
import { useAppointmentActions } from './use-appointment-actions';

export function useCalendarState(appointmentsData: Cita[], config: CalendarConfig) {
    // Estado inicial seguro
    const safeConfig: CalendarConfig = config || {
        show_weekend: true,
        business_days: [1, 2, 3, 4, 5],
        start_time: '08:00',
        end_time: '18:00',
        max_appointments: 1,
        slot_min_time: '07:00',
        slot_max_time: '20:00',
        user_id: '',
    };

    // Estados del componente
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showDragConfirmation, setShowDragConfirmation] = useState(false);
    const [showFinalDragConfirmation, setShowFinalDragConfirmation] = useState(false);
    const [draggedEventInfo, setDraggedEventInfo] = useState<any>(null);

    // Usar el hook de acciones con callbacks
    const { mapCitasToAppointments, updateAppointment, deleteAppointment, getRandomColor } = useAppointmentActions({
        safeConfig,
        selectedAppointment,
        onSuccess: (updatedAppointment) => {
            setAppointments((prevAppointments) => prevAppointments.map((apt) => (apt.id === updatedAppointment.id ? updatedAppointment : apt)));
            setIsAppointmentDialogOpen(false);
            setSelectedAppointment(null);
        },
        onDelete: (appointmentId) => {
            setAppointments((prevAppointments) => prevAppointments.filter((apt) => apt.id !== appointmentId));
            setSelectedAppointment(null);
        },
        onError: (error) => {
            console.error('Error en la operación de cita:', error);
        },
    });

    // Inicializar las citas al montar el componente
    useEffect(() => {
        setAppointments(mapCitasToAppointments(appointmentsData));
    }, [appointmentsData]);

    return {
        safeConfig,
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
        updateAppointment,
        deleteAppointment,
    };
}
