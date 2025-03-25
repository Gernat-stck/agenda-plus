import { useState, useEffect } from "react";
import { addMinutes, format } from "date-fns";
import { toast } from "sonner";
import type { Cita } from "@/types/clients";
import type { category } from "@/types/services";
import type { CalendarConfig, SpecialDate } from "@/types/calendar";

// Importar nuevas utilidades
import { isDateAvailable, isTimeWithinBusinessHours } from "@/utils/appointment-validations";
import { getServiceDuration, getServiceName } from "@/utils/service-utils";

interface UseAppointmentFormProps {
    appointment: Cita | null;
    selectedDate: Date | null;
    clientId?: string;
    clientName?: string;
    category: category[];
    config: CalendarConfig;
    specialDates: SpecialDate[];
}

export function useAppointmentForm({ 
    appointment, 
    selectedDate, 
    clientId, 
    clientName, 
    category, 
    config, 
    specialDates 
}: UseAppointmentFormProps) {
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
            // Asegurar que appointment tiene start_time y end_time válidos
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

    // Validaciones
    const validateAppointment = (): boolean => {
        // Validar campos obligatorios
        if (!formData.title || !formData.service_id || !formData.payment_type) {
            !formData.title && toast.error('El título es obligatorio');
            !formData.service_id && toast.error('Debe seleccionar un servicio');
            !formData.payment_type && toast.error('Debe seleccionar una forma de pago');
            return false;
        }

        // Verificar disponibilidad de la fecha
        const dateResult = isDateAvailable(formData.start_time, config, specialDates);
        if (!dateResult.isAvailable) {
            toast.error("Fecha no disponible", {
                description: dateResult.errorMessage,
                duration: 3000
            });
            return false;
        }
        
        // Verificar horario de la cita
        const timeResult = isTimeWithinBusinessHours(formData.start_time, config);
        if (!timeResult.isWithin) {
            toast.error("Horario no disponible", {
                description: timeResult.errorMessage,
                duration: 3000
            });
            return false;
        }

        return true;
    };

    const handleDateChange = (date: Date | undefined) => {
        if (!date) return;

        const currentHours = formData.start_time.getHours();
        const currentMinutes = formData.start_time.getMinutes();

        const newDate = new Date(date);
        newDate.setHours(currentHours, currentMinutes, 0, 0);

        const serviceDuration = getServiceDuration(formData.service_id, category);
        const newEndDate = addMinutes(newDate, serviceDuration);

        setFormData({
            ...formData,
            start_time: newDate,
            end_time: newEndDate,
        });
    };

    const handleTimeChange = (newDate: Date) => {
        // Calcular la duración del servicio y la hora de fin
        const serviceDuration = getServiceDuration(formData.service_id, category);
        const newEndDate = addMinutes(newDate, serviceDuration);

        // Advertir si está fuera del horario laboral
        const timeResult = isTimeWithinBusinessHours(newDate, config);
        if (!timeResult.isWithin) {
            toast.warning(timeResult.errorMessage);
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
        let serviceDuration = getServiceDuration(value, category);

        // Obtener el nombre del servicio
        serviceName = getServiceName(value, category);

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
        setFormData({
            ...formData,
            payment_type: value,
        });
    };

    return {
        formData,
        validateAppointment,
        handleDateChange,
        handleTimeChange,
        handleServiceChange,
        handlePaymentChange,
    };
}
