import { CalendarConfig, SpecialDate } from '@/types/calendar';
import type { Cita } from '@/types/clients';
import type { category } from '@/types/services';
import { addMinutes, format } from 'date-fns';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface UseAppointmentFormProps {
    appointment: Cita | null;
    selectedDate: Date | null;
    clientId: string;
    clientName: string;
    category: category[];
    config: CalendarConfig;
    specialDates: SpecialDate[];
}

export function useAppointmentForm({ appointment, selectedDate, clientId, clientName, category, config, specialDates }: UseAppointmentFormProps) {
    const [formData, setFormData] = useState<Cita>({
        appointment_id: '',
        service_id: '',
        title: '',
        start_time: new Date(),
        end_time: new Date(new Date().getTime() + 60 * 60 * 1000),
        status: 'pendiente',
        payment_type: '',
    });

    // Inicializa el formulario según los datos recibidos
    useEffect(() => {
        const currentTime = new Date();

        if (appointment) {
            if (!appointment.start_time) appointment.start_time = currentTime;
            if (!appointment.end_time) appointment.end_time = new Date(currentTime.getTime() + 60 * 60 * 1000);
            setFormData(appointment);
        } else if (selectedDate) {
            const startTime = new Date(selectedDate);
            const endTime = new Date(startTime);
            endTime.setHours(startTime.getHours() + 1);
            setFormData({
                appointment_id: '',
                service_id: '',
                title: clientName ? `Cita de ${clientName}` : 'Nueva cita',
                start_time: startTime,
                end_time: endTime,
                status: 'pendiente',
                payment_type: '',
                client_name: clientName || '',
                client_id: clientId || '',
            });
        } else {
            const startTime = new Date();
            const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

            setFormData({
                appointment_id: '',
                service_id: '',
                title: '',
                start_time: startTime,
                end_time: endTime,
                status: 'pendiente',
                payment_type: '',
            });
        }
    }, [appointment, selectedDate, clientName, clientId]);

    // Funciones de utilidad
    const getServiceDuration = (serviceId: string): number => {
        if (!serviceId) return 60; // Duración por defecto
        for (const cat of category) {
            const service = cat.services.find((s) => s.service_id === serviceId);
            if (service) {
                return typeof service.duration === 'number' ? service.duration : parseInt(String(service.duration), 10);
            }
        }
        return 60; // Si no encuentra el servicio, usa duración por defecto
    };

    // Validaciones
    const validateAppointment = (): boolean => {
        // Validar campos obligatorios
        if (!formData.title || !formData.service_id || !formData.payment_type) {
            !formData.title && toast.error('El título es obligatorio');
            !formData.service_id && toast.error('Debe seleccionar un servicio');
            !formData.payment_type && toast.error('Debe seleccionar una forma de pago');
            return false;
        }

        // Verificar día laboral
        const dayOfWeek = formData.start_time.getDay();
        if (!config.business_days.includes(dayOfWeek)) {
            toast.error('Día no disponible', {
                description: 'No se pueden programar citas en días no laborables.',
                duration: 3000,
            });
            return false;
        }

        // Verificar fecha especial
        const dateString = format(formData.start_time, 'yyyy-MM-dd');
        const isSpecialDateDisabled =
            specialDates &&
            specialDates.some((specialDate) => {
                const specialDateString = specialDate.date?.substring(0, 10);
                return specialDateString === dateString && !specialDate.is_available;
            });

        if (isSpecialDateDisabled) {
            toast.error('Fecha no disponible', {
                description: 'Esta fecha está marcada como no disponible en el calendario.',
                duration: 3000,
            });
            return false;
        }

        // Verificar horario laboral
        const timeString = format(formData.start_time, 'HH:mm');
        const endTimeString = format(formData.end_time, 'HH:mm');

        if (timeString < config.start_time || timeString > config.end_time) {
            toast.error('Horario no disponible', {
                description: `El horario laboral es de ${config.start_time} a ${config.end_time}.`,
                duration: 3000,
            });
            return false;
        }

        // Advertir si la cita termina después del horario laboral
        if (endTimeString > config.end_time) {
            toast.warning('La cita excede el horario laboral', {
                description: 'La hora de finalización queda fuera del horario configurado.',
                duration: 3000,
            });
            // Continuamos a pesar de la advertencia
        }

        return true;
    };

    // Manejadores de eventos
    const handleDateChange = (date: Date | undefined) => {
        if (!date) return;

        const currentHours = formData.start_time.getHours();
        const currentMinutes = formData.start_time.getMinutes();

        const newDate = new Date(date);
        newDate.setHours(currentHours, currentMinutes, 0, 0);

        const serviceDuration = getServiceDuration(formData.service_id);
        const newEndDate = addMinutes(newDate, serviceDuration);

        setFormData({
            ...formData,
            start_time: newDate,
            end_time: newEndDate,
        });
    };

    const handleTimeChange = (newDate: Date) => {
        // Calcular la duración del servicio y la hora de fin
        const serviceDuration = getServiceDuration(formData.service_id);
        const newEndDate = addMinutes(newDate, serviceDuration);

        // Verificar horario laboral
        const timeString = format(newDate, 'HH:mm');
        if (timeString < config.start_time || timeString > config.end_time) {
            toast.error('Hora fuera de horario laboral', {
                description: `Por favor selecciona una hora entre ${config.start_time} y ${config.end_time}`,
                duration: 3000,
            });
            return;
        }

        // Si la hora de fin excede el horario laboral, mostrar advertencia
        if (format(newEndDate, 'HH:mm') > config.end_time) {
            toast.warning('La cita excede el horario laboral', {
                description: 'La hora de fin queda fuera del horario configurado',
                duration: 3000,
            });
        }

        // Actualizar el estado del formulario
        setFormData({
            ...formData,
            start_time: newDate,
            end_time: newEndDate,
        });
    };

    const handleServiceChange = (value: string) => {
        // Variables para almacenar información del servicio
        let serviceName = '';
        let serviceDuration = 60;

        // Buscar el servicio seleccionado
        for (const cat of category) {
            const foundService = cat.services.find((service) => service.service_id === value);

            if (foundService) {
                serviceName = foundService.name;
                serviceDuration = typeof foundService.duration === 'number' ? foundService.duration : parseInt(String(foundService.duration), 10);
                break;
            }
        }

        // Calcular la hora de fin con la duración exacta del servicio
        const newEndDate = addMinutes(formData.start_time, serviceDuration);

        setFormData({
            ...formData,
            service_id: value,
            title: `${serviceName} de ${clientName || 'Cliente'}`,
            end_time: newEndDate,
        });
    };

    const handlePaymentChange = (value: string) => {
        if (value === 'tarjeta' || value === 'efectivo') {
            setFormData({
                ...formData,
                payment_type: value,
            });
        }
    };

    return {
        formData,
        setFormData,
        getServiceDuration,
        validateAppointment,
        handleDateChange,
        handleTimeChange,
        handleServiceChange,
        handlePaymentChange,
    };
}
