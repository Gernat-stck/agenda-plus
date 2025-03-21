import { useState, useEffect } from "react"
import { format, addMinutes } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, CreditCard, Banknote, CheckCircle2, Info } from "lucide-react"
import axios from "axios"

// Importar AvailableTimeSlots
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

import type { Cita } from "@/types/clients"
import type { category } from "@/types/services"
import type { CalendarConfig, SpecialDate, TimeSlot } from "@/types/calendar"
import { AvailableTimeSlots } from "../appointments/AvailableTimeSlots"
import { Button } from "../ui/button"

// Modificar la interfaz para incluir isSubmitting
interface AppointmentFormProps {
    onSave: (appointment: Cita) => void
    onCancel: () => void
    appointment: Cita | null
    selectedDate: Date | null
    clientId: string
    clientName: string
    clientPhone: string
    clientEmail: string
    category: category[]
    config: CalendarConfig
    specialDates: SpecialDate[]
    isSubmitting?: boolean
}

export function AppointmentForm({
    onSave,
    onCancel,
    appointment,
    selectedDate,
    clientId,
    clientName,
    category,
    config,
    specialDates,
    isSubmitting,
}: AppointmentFormProps) {
    const [formData, setFormData] = useState<Cita>({
        appointment_id: "",
        service_id: "",
        title: "",
        start_time: new Date(),
        end_time: new Date(new Date().getTime() + 60 * 60 * 1000),
        status: "pendiente",
        payment_type: "",
    })

    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [step, setStep] = useState<number>(1)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // Añadir estos nuevos estados para los slots disponibles
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
    const [loadingSlots, setLoadingSlots] = useState(false)

    useEffect(() => {
        const currentTime = new Date()

        if (appointment) {
            // Asegurar que appointment tiene start_time y end_time válidos
            if (!appointment.start_time) appointment.start_time = currentTime
            if (!appointment.end_time) appointment.end_time = new Date(currentTime.getTime() + 60 * 60 * 1000)
            setFormData(appointment)

            // Encontrar la categoría del servicio seleccionado
            for (const cat of category) {
                if (cat.services.some((service) => service.service_id === appointment.service_id)) {
                    setSelectedCategory(cat.name)
                    break
                }
            }

            // Si es una edición, mostrar todos los pasos
            setStep(3)
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
                status: "pendiente",
                payment_type: "",
                client_name: clientName || "",
                client_id: clientId || "",
            })
        } else {
            const startTime = new Date()
            const endTime = new Date(startTime.getTime() + 60 * 60 * 1000)

            setFormData({
                appointment_id: "",
                service_id: "",
                title: "",
                start_time: startTime,
                end_time: endTime,
                status: "pendiente",
                payment_type: "",
            })
        }
    }, [appointment, selectedDate, clientName, clientId, category])

    // Función de utilidad para obtener la duración del servicio
    const getServiceDuration = (serviceId: string): number => {
        if (!serviceId) return 60 // Duración por defecto
        for (const cat of category) {
            const service = cat.services.find((s) => s.service_id === serviceId)
            if (service) {
                return typeof service.duration === "number" ? service.duration : Number.parseInt(String(service.duration), 10)
            }
        }
        return 60 // Si no encuentra el servicio, usa duración por defecto
    }

    // Función para cargar los slots disponibles
    const loadAvailableSlots = async (date: Date) => {
        setLoadingSlots(true)
        try {
            const dateStr = format(date, "yyyy-MM-dd")
            const response = await axios.get(`/available/slots/${dateStr}`)

            // Manejar diferentes formatos de respuesta
            if (Array.isArray(response.data)) {
                setAvailableSlots(response.data)
            } else if (response.data && response.data.slots) {
                setAvailableSlots(response.data.slots)
            } else if (response.data && response.data.availableSlots) {
                setAvailableSlots(response.data.availableSlots)
            } else {
                console.error('Formato de respuesta inesperado:', response.data)
                setAvailableSlots([])
            }
        } catch (error) {
            console.error("Error al cargar los horarios disponibles:", error)
            setAvailableSlots([])
        } finally {
            setLoadingSlots(false)
        }
    }

    // Cargar slots disponibles cuando cambia la fecha
    useEffect(() => {
        if (formData.start_time) {
            loadAvailableSlots(formData.start_time)
        }
    }, [formData.start_time])

    const handleDateChange = (date: Date | undefined) => {
        if (!date) return

        // Crear nueva fecha preservando la hora actual
        const currentHours = formData.start_time.getHours()
        const currentMinutes = formData.start_time.getMinutes()

        const newDate = new Date(date)
        // Mantener la hora actual
        newDate.setHours(currentHours, currentMinutes, 0, 0)

        // Obtener la duración del servicio seleccionado
        const serviceDuration = getServiceDuration(formData.service_id)

        // Calcular nueva hora de finalización
        const newEndDate = addMinutes(newDate, serviceDuration)

        setFormData({
            ...formData,
            start_time: newDate,
            end_time: newEndDate,
        })

        // Cargar slots disponibles para la nueva fecha
        loadAvailableSlots(newDate)
    }

    const handleTimeChange = (newDate: Date) => {
        // Calcular la duración del servicio y la hora de fin
        const serviceDuration = getServiceDuration(formData.service_id)
        const newEndDate = addMinutes(newDate, serviceDuration)

        // Si la hora de fin excede el horario laboral, mostrar advertencia
        if (format(newEndDate, "HH:mm") > config.end_time) {
            toast.warning("La cita excede el horario laboral", {
                description: "La hora de fin queda fuera del horario configurado",
                duration: 3000,
            })
        }

        setFormData({
            ...formData,
            start_time: newDate,
            end_time: newEndDate,
        })
    }

    const handleSelectChange = (type: "service" | "payment" | "category", value: string) => {
        if (type === "category") {
            setSelectedCategory(value)
            return
        }

        if (type === "payment") {
            if (value === "tarjeta" || value === "efectivo") {
                setFormData({
                    ...formData,
                    payment_type: value,
                })
            }
            return
        }

        // Variables para almacenar información del servicio
        let serviceName = ""
        let categoryName = ""
        let serviceDuration = 60

        // Buscar el servicio seleccionado
        for (const cat of category) {
            const foundService = cat.services.find((service) => service.service_id === value)

            if (foundService) {
                serviceName = foundService.name
                categoryName = cat.name

                // Asegurarse de que la duración es un número
                serviceDuration =
                    typeof foundService.duration === "number"
                        ? foundService.duration
                        : Number.parseInt(String(foundService.duration), 10)
                break
            }
        }

        // Calcular la hora de fin con la duración exacta del servicio
        const newEndDate = addMinutes(formData.start_time, serviceDuration)

        setFormData({
            ...formData,
            service_id: value,
            title: `${serviceName} de ${clientName || "Cliente"}`,
            end_time: newEndDate,
        })

        // Actualizar la categoría seleccionada
        setSelectedCategory(categoryName)
    }

    const handleSlotSelect = (startTime: string, endTime: string) => {
        const [startHour, startMinute] = startTime.split(':').map(n => parseInt(n))
        const newDate = new Date(formData.start_time)
        newDate.setHours(startHour, startMinute, 0, 0)

        // Usar handleTimeChange existente
        handleTimeChange(newDate)
    }

    const handleSubmit = () => {
        setIsLoading(true)

        // Verificación más robusta al inicio de la función
        if (!formData || !formData.start_time || !formData.end_time) {
            toast.error("Error en los datos de la cita", {
                description: "La información de la cita está incompleta",
                duration: 3000,
            })
            setIsLoading(false)
            return
        }

        // 1. Validar campos obligatorios
        const hasErrors = !formData.title || !formData.service_id || !formData.payment_type
        !formData.title && toast.error("El título es obligatorio")
        !formData.service_id && toast.error("Debe seleccionar un servicio")
        !formData.payment_type && toast.error("Debe seleccionar una forma de pago")

        if (hasErrors) {
            setIsLoading(false)
            return
        }

        // 2. Verificar si la fecha seleccionada es un día no laboral
        const dayOfWeek = formData.start_time.getDay()
        if (!config.business_days.includes(dayOfWeek)) {
            toast.error("Día no disponible", {
                description: "No se pueden programar citas en días no laborables.",
                duration: 3000,
            })
            setIsLoading(false)
            return
        }

        // 3. Verificar si es una fecha especial no disponible
        const dateString = format(formData.start_time, "yyyy-MM-dd")
        const isSpecialDateDisabled =
            specialDates &&
            specialDates.some((specialDate) => {
                const specialDateString = specialDate.date?.substring(0, 10)
                return specialDateString === dateString && !specialDate.is_available
            })

        if (isSpecialDateDisabled) {
            toast.error("Fecha no disponible", {
                description: "Esta fecha está marcada como no disponible en el calendario.",
                duration: 3000,
            })
            setIsLoading(false)
            return
        }

        // 4. Verificar horario laboral
        const timeString = format(formData.start_time, "HH:mm")
        const endTimeString = format(formData.end_time, "HH:mm")

        if (timeString < config.start_time || timeString > config.end_time) {
            toast.error("Horario no disponible", {
                description: `El horario laboral es de ${config.start_time} a ${config.end_time}.`,
                duration: 3000,
            })
            setIsLoading(false)
            return
        }

        // Advertir si la cita termina después del horario laboral
        if (endTimeString > config.end_time) {
            toast.warning("La cita excede el horario laboral", {
                description: "La hora de finalización queda fuera del horario configurado.",
                duration: 3000,
            })
        }

        // Continuar con la lógica existente si pasa todas las validaciones
        setTimeout(() => {
            onSave(formData)
            setIsLoading(false)
        }, 500)
    }

    const getServicePrice = (): string => {
        if (!formData.service_id) return ""

        for (const cat of category) {
            const service = cat.services.find((s) => s.service_id === formData.service_id)
            if (service) {
                return service.price.toString()
            }
        }

        return ""
    }

    const getServiceName = (): string => {
        if (!formData.service_id) return ""

        for (const cat of category) {
            const service = cat.services.find((s) => s.service_id === formData.service_id)
            if (service) {
                return service.name
            }
        }

        return ""
    }

    const nextStep = () => {
        if (step === 1 && !formData.service_id) {
            toast.error("Debe seleccionar un servicio para continuar")
            return
        }

        if (step === 2) {
            const timeString = format(formData.start_time, "HH:mm")
            if (timeString < config.start_time || timeString > config.end_time) {
                toast.error("Horario no disponible", {
                    description: `El horario laboral es de ${config.start_time} a ${config.end_time}.`,
                    duration: 3000,
                })
                return
            }
        }

        setStep((prev) => Math.min(prev + 1, 3))
    }

    const prevStep = () => {
        setStep((prev) => Math.max(prev - 1, 1))
    }

    return (
        <Card className="w-full shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-primary/90 to-primary text-primary-foreground border-0">
                <CardTitle className="text-xl font-bold">{appointment ? "Editar cita" : "Nueva cita"}</CardTitle>
                {clientName && <p className="text-sm opacity-90">Cliente: {clientName}</p>}
            </CardHeader>

            <CardContent className="p-6">
                {/* Indicador de pasos */}
                <div className="flex justify-between mb-6">
                    <div className={`flex flex-col items-center ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                        >
                            1
                        </div>
                        <span className="text-xs">Servicio</span>
                    </div>
                    <div className="grow mx-2 flex items-center">
                        <div className={`h-0.5 w-full ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
                    </div>
                    <div className={`flex flex-col items-center ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                        >
                            2
                        </div>
                        <span className="text-xs">Fecha/Hora</span>
                    </div>
                    <div className="grow mx-2 flex items-center">
                        <div className={`h-0.5 w-full ${step >= 3 ? "bg-primary" : "bg-muted"}`}></div>
                    </div>
                    <div className={`flex flex-col items-center ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                        >
                            3
                        </div>
                        <span className="text-xs">Confirmar</span>
                    </div>
                </div>

                {/* Paso 1: Selección de servicio */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-sm font-medium">
                                Categoría de servicio
                            </Label>
                            <Select value={selectedCategory} onValueChange={(value) => handleSelectChange("category", value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecciona una categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {category.map((cat) => (
                                        <SelectItem key={cat.name} value={cat.name}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="service" className="text-sm font-medium">
                                Servicio
                            </Label>
                            <Select value={formData.service_id} onValueChange={(value) => handleSelectChange("service", value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecciona un servicio" />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedCategory
                                        ? category
                                            .find((cat) => cat.name === selectedCategory)
                                            ?.services.map((service) => (
                                                <SelectItem key={service.service_id} value={service.service_id}>
                                                    <div className="flex justify-between w-full">
                                                        <span>{service.name}</span>
                                                        <span className="text-muted-foreground">
                                                            ${service.price} - {service.duration}min
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))
                                        : category.map((cat) => (
                                            <div key={cat.name} className="pb-1">
                                                <div className="font-semibold text-sm px-2 py-1.5 bg-muted/50">{cat.name}</div>
                                                {cat.services.map((service) => (
                                                    <SelectItem key={service.service_id} value={service.service_id}>
                                                        <div className="flex justify-between w-full">
                                                            <span>{service.name}</span>
                                                            <span className="text-muted-foreground">
                                                                ${service.price} - {service.duration}min
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </div>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.service_id && (
                            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                                <div className="text-sm font-medium">Servicio seleccionado:</div>
                                <div className="flex justify-between mt-1">
                                    <span>{getServiceName()}</span>
                                    <span className="font-medium">${getServicePrice()}</span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Duración: {getServiceDuration(formData.service_id)} minutos
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Paso 2: Selección de fecha y hora */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-sm font-medium">
                                Fecha de la cita
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !formData.start_time && "text-muted-foreground",
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
                                            const dateString = format(date, "yyyy-MM-dd")
                                            const dayOfWeek = date.getDay()
                                            const isDayDisabled = !config.business_days.includes(dayOfWeek)
                                            const isSpecialDateDisabled = specialDates?.some((specialDate) => {
                                                const specialDateString = specialDate.date.substring(0, 10)
                                                return specialDateString === dateString && !specialDate.is_available
                                            })
                                            return isDayDisabled || isSpecialDateDisabled
                                        }}
                                        locale={es}
                                        weekStartsOn={0}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Reemplazar TimePicker con AvailableTimeSlots */}
                        <div className="space-y-2">
                            <Label htmlFor="time" className="text-sm font-medium">
                                Hora de la cita
                            </Label>

                            {loadingSlots ? (
                                <div className="flex justify-center py-4 border rounded-md">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                </div>
                            ) : (
                                <AvailableTimeSlots
                                    date={formData.start_time}
                                    onSelectSlot={handleSlotSelect}
                                    availableSlots={availableSlots}
                                    className="mt-2 border rounded-md p-2"
                                />
                            )}

                            <p className="text-xs text-muted-foreground mt-1">
                                Horario disponible: {config.start_time} - {config.end_time}
                            </p>
                        </div>

                        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                            <div className="text-sm font-medium">Resumen de la cita:</div>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div className="text-xs">
                                    <span className="text-muted-foreground">Servicio:</span>
                                    <div className="font-medium">{getServiceName()}</div>
                                </div>
                                <div className="text-xs">
                                    <span className="text-muted-foreground">Duración:</span>
                                    <div className="font-medium">{getServiceDuration(formData.service_id)} minutos</div>
                                </div>
                                <div className="text-xs">
                                    <span className="text-muted-foreground">Fecha:</span>
                                    <div className="font-medium">{format(formData.start_time, "PPP", { locale: es })}</div>
                                </div>
                                <div className="text-xs">
                                    <span className="text-muted-foreground">Hora:</span>
                                    <div className="font-medium">
                                        {format(formData.start_time, "HH:mm")} - {format(formData.end_time, "HH:mm")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Paso 3: Confirmación y pago */}
                {step === 3 && (
                    <div className="space-y-4">
                        <div className="p-4 bg-muted/30 rounded-lg">
                            <h3 className="font-medium text-lg mb-3">Resumen de la cita</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Servicio:</span>
                                    <span className="font-medium">{getServiceName()}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Fecha:</span>
                                    <span className="font-medium">{format(formData.start_time, "PPP", { locale: es })}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Hora:</span>
                                    <span className="font-medium">
                                        {format(formData.start_time, "HH:mm")} - {format(formData.end_time, "HH:mm")}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Duración:</span>
                                    <span className="font-medium">{getServiceDuration(formData.service_id)} minutos</span>
                                </div>

                                <Separator />

                                <div className="flex justify-between text-lg">
                                    <span className="font-medium">Total:</span>
                                    <span className="font-bold">${getServicePrice()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="payment-type" className="text-sm font-medium">
                                Forma de pago
                            </Label>
                            <div className="grid grid-cols-2 gap-3 mt-1">
                                <div
                                    className={`border rounded-lg p-3 flex items-center gap-2 cursor-pointer transition-colors ${formData.payment_type === "tarjeta" ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}
                                    onClick={() => handleSelectChange("payment", "tarjeta")}
                                >
                                    <CreditCard className="h-5 w-5 text-primary" />
                                    <span>Tarjeta</span>
                                    {formData.payment_type === "tarjeta" && <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />}
                                </div>

                                <div
                                    className={`border rounded-lg p-3 flex items-center gap-2 cursor-pointer transition-colors ${formData.payment_type === "efectivo" ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}
                                    onClick={() => handleSelectChange("payment", "efectivo")}
                                >
                                    <Banknote className="h-5 w-5 text-primary" />
                                    <span>Efectivo</span>
                                    {formData.payment_type === "efectivo" && <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />}
                                </div>
                            </div>
                        </div>

                        {clientName && (
                            <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg">
                                <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Información del cliente</p>
                                    <p className="text-xs">{clientName}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between p-6 pt-0">
                {step > 1 ? (
                    <Button variant="outline" onClick={prevStep}>
                        Atrás
                    </Button>
                ) : (
                    <Button variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>
                )}

                {step < 3 ? (
                    <Button onClick={nextStep}>Continuar</Button>
                ) : (
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="animate-spin mr-2">⏳</span>
                                Guardando...
                            </>
                        ) : "Guardar Cita"}
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

