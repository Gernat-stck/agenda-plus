import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { format, addMinutes } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"
import type { Cita } from "@/types/clients"
import type { category } from "@/types/services"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { CalendarConfig, SpecialDate } from "@/types/calendar"
import { TimePicker } from "../ui/time-picker"

interface AppointmentDialogProps {
    isOpen: boolean
    onClose: () => void
    onSave: (appointment: Cita) => void
    appointment: Cita | null
    selectedDate: Date | null
    clientId: string
    clientName: string
    clientPhone: string
    clientEmail: string
    category: category[]
    config: CalendarConfig
    specialDates: SpecialDate[]
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
    const [formData, setFormData] = useState<Cita>({
        appointment_id: "",
        service_id: "",
        title: "",
        start_time: new Date(),
        end_time: new Date(new Date().getTime() + 60 * 60 * 1000),
        status: 'pendiente',
        payment_type: "",
    })
    useEffect(() => {
        const currentTime = new Date();

        if (appointment) {
            // Asegurar que appointment tiene start_time y end_time válidos
            if (!appointment.start_time) appointment.start_time = currentTime;
            if (!appointment.end_time) appointment.end_time = new Date(currentTime.getTime() + 60 * 60 * 1000);
            setFormData(appointment);
        } else if (selectedDate) {
            const startTime = new Date(selectedDate)
            const endTime = new Date(startTime)
            endTime.setHours(startTime.getHours() + 1)
            setFormData({
                appointment_id: "",
                service_id: "",
                title: clientName ? `Cita de ${clientName}` : "Nueva cita",
                start_time: startTime,
                end_time: endTime,
                status: 'pendiente',
                payment_type: "",
                client_name: clientName || "",
                client_id: clientId || ""
            })
        } else {
            const startTime = new Date();
            const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

            setFormData({
                appointment_id: "",
                service_id: "",
                title: "",
                start_time: startTime,
                end_time: endTime,
                status: 'pendiente',
                payment_type: "",
            });
        }
    }, [appointment, selectedDate, clientName])

    const handleSubmit = () => {
        // Verificación más robusta al inicio de la función
        if (!formData || !formData.start_time || !formData.end_time) {
            toast.error("Error en los datos de la cita", {
                description: "La información de la cita está incompleta",
                duration: 3000,
            });
            return;
        }
        // 1. Validar campos obligatorios (código existente)
        const hasErrors = !formData.title || !formData.service_id || !formData.payment_type;
        !formData.title && toast.error("El título es obligatorio");
        !formData.service_id && toast.error("Debe seleccionar un servicio");
        !formData.payment_type && toast.error("Debe seleccionar una forma de pago");
        if (hasErrors) return;

        // 2. NUEVA VALIDACIÓN: Verificar si la fecha seleccionada es un día no laboral
        const dayOfWeek = formData.start_time.getDay();
        if (!config.business_days.includes(dayOfWeek)) {
            toast.error("Día no disponible", {
                description: "No se pueden programar citas en días no laborables.",
                duration: 3000,
            });
            return;
        }

        // 3. NUEVA VALIDACIÓN: Verificar si es una fecha especial no disponible
        const dateString = format(formData.start_time, "yyyy-MM-dd");
        // Verificar que specialDates existe antes de usarlo
        const isSpecialDateDisabled = specialDates && specialDates.some(specialDate => {
            const specialDateString = specialDate.date?.substring(0, 10);
            return specialDateString === dateString && !specialDate.is_available;
        });
        if (isSpecialDateDisabled) {
            toast.error("Fecha no disponible", {
                description: "Esta fecha está marcada como no disponible en el calendario.",
                duration: 3000,
            });
            return;
        }
        // 4. NUEVA VALIDACIÓN: Verificar horario laboral
        const timeString = format(formData.start_time, "HH:mm");
        const endTimeString = format(formData.end_time, "HH:mm");

        if (timeString < config.start_time || timeString > config.end_time) {
            toast.error("Horario no disponible", {
                description: `El horario laboral es de ${config.start_time} a ${config.end_time}.`,
                duration: 3000,
            });
            return;
        }

        // Advertir si la cita termina después del horario laboral
        if (endTimeString > config.end_time) {
            toast.warning("La cita excede el horario laboral", {
                description: "La hora de finalización queda fuera del horario configurado.",
                duration: 3000,
            });
            // Opcional: return; si quieres bloquear totalmente citas que exceden el horario
        }

        // Continuar con la lógica existente si pasa todas las validaciones
        const startTimeStr = format(formData.start_time, "yyyy-MM-dd'T'HH:mm:ss");
        const endTimeStr = format(formData.end_time, "yyyy-MM-dd'T'HH:mm:ss");

        const citaData: Cita = {
            ...formData,
            start_time: new Date(startTimeStr),
            end_time: new Date(endTimeStr),
        };

        onSave(citaData);
    }

    // Función de utilidad para obtener la duración del servicio
    const getServiceDuration = (serviceId: string): number => {
        if (!serviceId) return 60; // Duración por defecto
        for (const cat of category) {
            const service = cat.services.find(s => s.service_id === serviceId);
            if (service) {
                // Usa String() en lugar de toString() para evitar errores de tipo
                return typeof service.duration === 'number'
                    ? service.duration
                    : parseInt(String(service.duration), 10);
            }
        }
        return 60; // Si no encuentra el servicio, usa duración por defecto
    }

    // Actualiza handleDateChange para usar la función de utilidad
    const handleDateChange = (date: Date | undefined) => {
        if (!date) return;

        // Crear nueva fecha preservando la hora actual
        const currentHours = formData.start_time.getHours();
        const currentMinutes = formData.start_time.getMinutes();

        const newDate = new Date(date);
        // Mantener la hora actual
        newDate.setHours(currentHours, currentMinutes, 0, 0);

        // Obtener la duración del servicio seleccionado
        const serviceDuration = getServiceDuration(formData.service_id);

        // Calcular nueva hora de finalización
        const newEndDate = addMinutes(newDate, serviceDuration);

        setFormData({
            ...formData,
            start_time: newDate,
            end_time: newEndDate
        });
    }

    // Actualiza handleTimeChange para usar la función de utilidad
    const handleTimeChange = (value: string) => {
        // Extraer horas y minutos del valor seleccionado
        const [hours, minutes] = value.split(":").map(Number);

        // Crear nueva fecha preservando año/mes/día
        const newStartDate = new Date(formData.start_time);

        // Establecer horas y minutos locales, no UTC
        newStartDate.setHours(hours, minutes, 0, 0);

        const timeString = format(newStartDate, "HH:mm");
        if (timeString < config.start_time || timeString > config.end_time) {
            toast.error("Hora fuera de horario laboral", {
                description: `Por favor selecciona una hora entre ${config.start_time} y ${config.end_time}`,
                duration: 3000,
            });
            return;
        }
        // Calcular la duración del servicio y la hora de fin
        const serviceDuration = getServiceDuration(formData.service_id);
        const newEndDate = addMinutes(newStartDate, serviceDuration);

        // Si la hora de fin excede el horario laboral, mostrar advertencia
        if (format(newEndDate, "HH:mm") > config.end_time) {
            toast.warning("La cita excede el horario laboral", {
                description: "La hora de fin queda fuera del horario configurado",
                duration: 3000,
            });
        }
        setFormData({
            ...formData,
            start_time: newStartDate,
            end_time: newEndDate,
        });
    }

    // Actualiza handleSelectChange para usar la función de utilidad y para establecer el título correctamente
    const handleSelectChange = (type: "service" | "payment", value: string) => {
        if (type === "payment") {
            if (value === "tarjeta" || value === "efectivo") {
                setFormData({
                    ...formData,
                    payment_type: value,
                });
            }
            return;
        }
        // Variables para almacenar información del servicio
        let serviceName = "";
        let categoryName = "";
        let serviceDuration = 60;

        // Buscar el servicio seleccionado
        for (const cat of category) {
            const foundService = cat.services.find(service => service.service_id === value);

            if (foundService) {
                serviceName = foundService.name;
                categoryName = cat.name;

                // Asegurarse de que la duración es un número
                serviceDuration = typeof foundService.duration === 'number'
                    ? foundService.duration
                    : parseInt(String(foundService.duration), 10);
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
    }
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{appointment ? "Editar cita" : "Nueva cita"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Campo de título (deshabilitado) */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Título
                        </Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="col-span-3"
                            disabled
                        />
                    </div>

                    {/* Selector de servicio con categorías */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="service" className="text-right">
                            Servicio
                        </Label>
                        <div className="col-span-3">
                            <Select
                                value={formData.service_id}
                                onValueChange={(value) => handleSelectChange("service", value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un servicio" />
                                </SelectTrigger>
                                <SelectContent>
                                    {category.map((cat) => (
                                        <div key={cat.name} className="pb-1">
                                            <div className="font-semibold text-sm px-2 py-1.5 bg-muted/50">
                                                {cat.name}
                                            </div>
                                            {cat.services.map((service) => (
                                                <SelectItem key={service.service_id} value={service.service_id}>
                                                    {service.name} (${service.price} - {service.duration}min)
                                                </SelectItem>
                                            ))}
                                        </div>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Selector de fecha */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                            Fecha
                        </Label>
                        <div className="col-span-3">
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
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={formData.start_time}
                                        onSelect={handleDateChange}
                                        autoFocus
                                        disabled={(date) => {
                                            const dateString = format(date, "yyyy-MM-dd");
                                            const dayOfWeek = date.getDay();
                                            const isDayDisabled = !config.business_days.includes(dayOfWeek);
                                            const isSpecialDateDisabled = specialDates?.some(specialDate => {
                                                const specialDateString = specialDate.date.substring(0, 10);
                                                return specialDateString === dateString && !specialDate.is_available;
                                            });
                                            return isDayDisabled || isSpecialDateDisabled;
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Selector de hora */}
                    <TimePicker
                        value={formData.start_time}
                        onChange={(newDate) => {
                            // Calcular la duración del servicio y la hora de fin
                            const serviceDuration = getServiceDuration(formData.service_id);
                            const newEndDate = addMinutes(newDate, serviceDuration);

                            // Actualizar el estado del formulario
                            setFormData({
                                ...formData,
                                start_time: newDate,
                                end_time: newEndDate,
                            });
                        }}
                        minTime={config.slot_min_time ? config.slot_min_time : "07:00"}
                        maxTime={config.slot_max_time ? config.slot_max_time : "20:00"}
                        label="Hora"
                    />

                    {/* Información de duración */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Duración</Label>
                        <div className="col-span-3 text-sm text-muted-foreground">
                            {formData.service_id ? (
                                <>
                                    {Math.round((formData.end_time.getTime() - formData.start_time.getTime()) / 60000)} minutos
                                    <span className="ml-2">
                                        (Finaliza a las {format(formData.end_time, "HH:mm")})
                                    </span>
                                </>
                            ) : (
                                "Seleccione un servicio para calcular la duración"
                            )}
                        </div>
                    </div>

                    {/* Resto del formulario (tipo de pago, etc.) */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="payment-type" className="text-right">
                            Forma de pago
                        </Label>
                        <div className="col-span-3">
                            <Select
                                value={formData.payment_type}
                                onValueChange={(value) => handleSelectChange("payment", value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona forma de pago" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                                    <SelectItem value="efectivo">Efectivo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
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

