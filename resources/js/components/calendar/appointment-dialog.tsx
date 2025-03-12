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
        if (appointment) {
            // Si hay una cita existente, la cargamos en el formulario
            setFormData(appointment)
        } else if (selectedDate) {
            // Si no hay cita pero hay una fecha seleccionada, la usamos como inicio para una nueva cita
            const startTime = new Date(selectedDate)
            const endTime = new Date(startTime)
            endTime.setHours(startTime.getHours() + 1) // Por defecto 1 hora de duración

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
        }
    }, [appointment, selectedDate, clientName])

    const handleSubmit = () => {
        const hasErrors = !formData.title || !formData.service_id || !formData.payment_type;
        !formData.title && toast.error("El título es obligatorio");
        !formData.service_id && toast.error("Debe seleccionar un servicio");
        !formData.payment_type && toast.error("Debe seleccionar una forma de pago");
        if (hasErrors) return;

        // Si no hay errores, guardar
        onSave(formData);
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

        // Mantiene la hora actual pero actualiza la fecha
        const newDate = new Date(formData.start_time);
        newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());

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
        const [hours, minutes] = value.split(":").map(Number);
        const newStartDate = new Date(formData.start_time);
        newStartDate.setHours(hours, minutes, 0, 0);

        // Obtener la duración del servicio seleccionado
        const serviceDuration = getServiceDuration(formData.service_id);

        // Calcular nueva hora de finalización
        const newEndDate = addMinutes(newStartDate, serviceDuration);

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

                console.log(`Servicio encontrado: ${serviceName}, Duración: ${serviceDuration} minutos`);
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
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Selector de hora */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="start-time" className="text-right">
                            Hora
                        </Label>
                        <Input
                            id="start-time"
                            type="time"
                            value={format(formData.start_time, "HH:mm")}
                            onChange={(e) => handleTimeChange(e.target.value)}
                            className="col-span-3"
                        />
                    </div>

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

