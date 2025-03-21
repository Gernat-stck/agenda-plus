import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "../ui/form-field";
import { CategoryServiceSelect } from "./category-service-select";
import { useAppointmentForm } from "@/hooks/use-appointment-form";
import { useState, useEffect } from "react";
import { AvailableTimeSlots } from "./AvailableTimeSlots";
import axios from "axios";
import type { Cita } from "@/types/clients";
import type { category } from "@/types/services";
import { CalendarConfig, SpecialDate, TimeSlot } from "@/types/calendar";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { es } from "date-fns/locale";
import { toast } from "sonner";

interface AppointmentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (appointment: Cita) => void;
    appointment: Cita | null;
    selectedDate: Date | null;
    clientId: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    category: category[];
    config: CalendarConfig;
    specialDates: SpecialDate[];
}

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
    specialDates
}: AppointmentDialogProps) {
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(false);

    const {
        formData,
        validateAppointment,
        handleDateChange,
        handleTimeChange,
        handleServiceChange,
        handlePaymentChange,
        getServiceDuration,
    } = useAppointmentForm({
        appointment,
        selectedDate,
        clientId,
        clientName,
        category,
        config,
        specialDates
    });

    // Cargar slots disponibles cuando cambia la fecha
    useEffect(() => {
        if (!formData.start_time) return;
        loadAvailableSlots(formData.start_time);
    }, [formData.start_time]);

    // Función para cargar los slots disponibles
    const loadAvailableSlots = async (date: Date) => {
        setLoading(true);
        try {
            const dateStr = format(date, "yyyy-MM-dd");
            const response = await axios.get(`/available/slots/${dateStr}`);

            // Añade estos logs para depurar

            // Verifica si response.data es un array o un objeto con diferentes propiedades
            if (Array.isArray(response.data)) {
                setAvailableSlots(response.data);
            } else if (response.data && response.data.slots) {
                setAvailableSlots(response.data.slots);
            } else if (response.data && response.data.availableSlots) {
                // Añade esta condición para manejar el formato {availableSlots: Array(12)}
                setAvailableSlots(response.data.availableSlots);
            } else {
                console.error('Formato de respuesta inesperado:', response.data);
                setAvailableSlots([]);
            }
        } catch (error) {
            console.error("Error al cargar los horarios disponibles:", error);
            setAvailableSlots([]);
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar la selección de un slot
    const handleSlotSelect = (startTime: string, endTime: string) => {
        const [startHour, startMinute] = startTime.split(':').map(n => parseInt(n));
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

        const startTimeStr = format(formData.start_time, "yyyy-MM-dd'T'HH:mm:ss");
        const endTimeStr = format(formData.end_time, "yyyy-MM-dd'T'HH:mm:ss");

        const citaData: Cita = {
            ...formData,
            start_time: new Date(startTimeStr),
            end_time: new Date(endTimeStr),
        };

        onSave(citaData);
    };

    const disableDates = (date: Date) => {
        const dateString = format(date, "yyyy-MM-dd");
        const dayOfWeek = date.getDay();

        // Verificar si el día es laborable según config
        const isDayDisabled = !config.business_days.includes(dayOfWeek);

        // Verificar si es una fecha especial no disponible
        const isSpecialDateDisabled = specialDates?.some(specialDate => {
            const specialDateString = specialDate.date.substring(0, 10);
            return specialDateString === dateString && !specialDate.is_available;
        });

        return isDayDisabled || isSpecialDateDisabled;
    };


    return (

        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{appointment ? "Editar cita" : "Nueva cita"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Campo de título */}
                    <FormField label="Título" htmlFor="title">
                        <Input id="title" value={formData.title} className="w-full" disabled />
                    </FormField>

                    {/* Selector de servicio con categorías */}
                    <FormField label="Servicio" htmlFor="service">
                        <CategoryServiceSelect
                            categories={category}
                            value={formData.service_id}
                            onChange={handleServiceChange}
                        />
                    </FormField>

                    {/* Selector de fecha */}
                    <FormField label="Fecha" htmlFor="date">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !formData.start_time && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.start_time ? (
                                        format(formData.start_time, "PPP", { locale: es })
                                    ) : (
                                        <span>Selecciona una fecha</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={formData.start_time}
                                    onSelect={onDatePickerChange}
                                    autoFocus
                                    disabled={disableDates}
                                    className="rounded-md border shadow p-3"
                                    role="dialog"
                                    aria-modal="true"
                                    locale={es}
                                    weekStartsOn={0}
                                />
                            </PopoverContent>
                        </Popover>
                    </FormField>
                    {/* Selector de hora (siempre mostrar slots disponibles) */}
                    <FormField label="Horario" htmlFor="time">
                        {loading ? (
                            <div className="flex justify-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <AvailableTimeSlots
                                date={formData.start_time}
                                onSelectSlot={handleSlotSelect}
                                availableSlots={availableSlots}
                                className="mt-2"
                            />
                        )}
                    </FormField>


                    {/* Información de duración */}
                    <FormField label="Duración">
                        <div className="text-sm text-muted-foreground">
                            {formData.service_id ? (
                                <>
                                    {getServiceDuration(formData.service_id)} minutos
                                </>
                            ) : (
                                "Seleccione un servicio para calcular la duración"
                            )}
                        </div>
                    </FormField>


                    {/* Forma de pago */}
                    <FormField label="Forma de pago" htmlFor="payment-type">
                        <Select value={formData.payment_type} onValueChange={handlePaymentChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona forma de pago" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tarjeta">Tarjeta</SelectItem>
                                <SelectItem value="efectivo">Efectivo</SelectItem>
                            </SelectContent>
                        </Select>
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

