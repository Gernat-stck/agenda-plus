import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppointmentForm } from '@/hooks/use-appointment-form';
import type { Cita } from '@/types/clients';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { AppointmentDialogProps } from '../../types/appointment-dialog';
import { FormField } from '../ui/form-field';
import { CategoryServiceSelect } from './category-service-select';
// Importar las nuevas utilidades
import { useAvailableSlots } from '@/hooks/use-available-slots';
import { isDateAvailable } from '@/utils/appointment-validations';
import { formatForAPI } from '@/utils/date-utils';
import { getServiceDuration } from '@/utils/service-utils';

// Importar el nuevo componente
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { PaymentMethodSelector } from '../shared/payment-method-selector';
import { Label } from '@/components/ui/label';

export function AppointmentDialog({
    isOpen,
    onClose,
    onSave,
    appointment,
    selectedDate,
    clientId,
    clientName,
    category,
    config,
    specialDates,
}: AppointmentDialogProps) {
    // Usar el nuevo hook para slots disponibles
    const { loadAvailableSlots } = useAvailableSlots(config?.user_id);

    const { formData, validateAppointment, handleDateChange, handleTimeChange, handleServiceChange, handlePaymentChange } = useAppointmentForm({
        appointment,
        selectedDate,
        clientId,
        clientName,
        category,
        config,
        specialDates,
    });

    // Cargar slots disponibles cuando cambia la fecha
    useEffect(() => {
        if (!formData.start_time) return;
        loadAvailableSlots(formData.start_time);
    }, [formData.start_time]);

    // Manejador para la selección de un slot
    const handleSlotSelect = (startTime: string, endTime: string) => {
        const [startHour, startMinute] = startTime.split(':').map((n) => parseInt(n));
        const newDate = new Date(formData.start_time);
        newDate.setHours(startHour, startMinute, 0, 0);

        // Usar handleTimeChange en lugar de manipular directamente el estado
        handleTimeChange(newDate);
    };

    // Manejador para el cambio de fecha desde el DatePicker
    const onDatePickerChange = (date: Date | undefined) => {
        handleDateChange(date);
        if (!date) return toast.error('Seleccione una fecha válida');
        loadAvailableSlots(date);
    };

    const handleSubmit = () => {
        if (!validateAppointment()) return;

        const startTimeStr = formatForAPI(formData.start_time);
        const endTimeStr = formatForAPI(formData.end_time);

        const citaData: Cita = {
            ...formData,
            start_time: new Date(startTimeStr),
            end_time: new Date(endTimeStr),
        };

        onSave(citaData);
    };

    // Usar la utilidad de validación de fechas
    const disableDates = (date: Date) => {
        const result = isDateAvailable(date, config, specialDates);
        return !result.isAvailable;
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-auto min-w-2xl">
                <DialogHeader>
                    <DialogTitle>{appointment ? 'Editar cita' : 'Nueva cita'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Campo de título */}
                    <FormField label="Título" htmlFor="title">
                        <Input id="title" value={formData.title} className="w-full" disabled />
                    </FormField>

                    {/* Selector de servicio con categorías */}
                    <FormField label="Servicio" htmlFor="service">
                        <CategoryServiceSelect categories={category} value={formData.service_id} onChange={handleServiceChange} />
                    </FormField>

                    {/* Selector de fecha y hora */}
                    <div className="space-y-0">
                        <FormField label="Fecha y hora" htmlFor="date-time">
                            <DateTimePicker
                                date={formData.start_time}
                                onDateChange={(newDate) => {
                                    handleDateChange(newDate);
                                    loadAvailableSlots(newDate);
                                }}
                                onTimeChange={(newTime) => {
                                    handleTimeChange(newTime);
                                }}
                                userId={config?.user_id}
                                config={config}
                                specialDates={specialDates}
                                disabledDates={disableDates}
                                label=""
                            />
                        </FormField>
                    </div>
                    {/* Información de duración */}
                    <FormField label="Duración">
                        <div className="text-muted-foreground text-sm">
                            {formData.service_id ? (
                                <>{getServiceDuration(formData.service_id, category)} minutos</>
                            ) : (
                                'Seleccione un servicio para calcular la duración'
                            )}
                        </div>
                    </FormField>

                    {/* Forma de pago */}
                    <FormField label="Forma de pago" htmlFor="payment-type">
                        <PaymentMethodSelector
                            label=''
                            serviceId={formData.service_id}
                            value={formData.payment_type}
                            onChange={(paymentType) => handlePaymentChange(paymentType)}
                        />
                    </FormField>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>
                        Guardar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
