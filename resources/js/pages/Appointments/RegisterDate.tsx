"use client"

import { useState } from "react"
import { Head } from "@inertiajs/react"
import { router, usePage } from "@inertiajs/react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast, Toaster } from "sonner"
import { ArrowLeft, CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import type { Cita } from "@/types/clients"
import type { category } from "@/types/services"
import type { CalendarConfig, SpecialDate } from "@/types/calendar"

// Importamos el componente de formulario mejorado
import { AppointmentForm } from "@/components/appointment-form"
import AppearanceToggleDropdown from "@/components/appearance-dropdown"

interface RegisterDateProps {
    userId: string
    categories: category[]
    config: CalendarConfig | null
    specialDates: SpecialDate[]
}

export default function RegisterDate({ userId, categories, config, specialDates }: RegisterDateProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

    // Valores por defecto para el cliente (puedes adaptarlos según tu lógica)
    const clientId = ""
    const clientName = ""
    const clientPhone = ""
    const clientEmail = ""

    // Configuración por defecto en caso de que no exista
    const defaultConfig: CalendarConfig = {
        user_id: userId,
        show_weekend: true,
        start_time: "09:00",
        end_time: "18:00",
        max_appointments: 10,
        business_days: [1, 2, 3, 4, 5], // Lunes a viernes por defecto
        slot_min_time: "09:00",
        slot_max_time: "18:00",
    }

    const calendarConfig = config || defaultConfig
    const { route } = usePage().props

    const handleSaveAppointment = (appointment: Cita) => {
        // Formatear los datos para enviar al servidor
        const formattedAppointment = {
            ...appointment,
            start_time: format(appointment.start_time, "yyyy-MM-dd'T'HH:mm:ss"),
            end_time: format(appointment.end_time, "yyyy-MM-dd'T'HH:mm:ss"),
            user_id: userId,
        }

        // Enviar los datos al servidor usando Inertia
        router.post(("appointments.store"), formattedAppointment, {
            onSuccess: () => {
                toast.success("Cita agendada correctamente", {
                    description: `${appointment.title} para el ${format(appointment.start_time, "PPP", { locale: es })} a las ${format(appointment.start_time, "HH:mm")}`,
                })
                // Redirigir a la página de citas o donde sea necesario
                router.visit(("appointments.index"))
            },
            onError: (errors) => {
                // Mostrar errores
                Object.keys(errors).forEach((key) => {
                    toast.error(errors[key])
                })
            },
        })
    }

    const handleCancel = () => {
        // Redirigir a la página anterior o a la lista de citas
        router.visit(("appointments.index"))
    }

    return (
        <>
            <Head title="Agendar Cita" />
            <Toaster position="top-right" richColors />

            <div className="flex flex-col min-h-screen justify-center items-center bg-accent p-4">
                <div className="container max-w-5xl w-full bg-accent rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-6 justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mr-2"
                            disabled
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-2xl font-bold">Agendar Nueva Cita</h1>
                        <AppearanceToggleDropdown />

                    </div>

                    <div className="grid md:grid-cols-[1fr_350px] gap-6">
                        <div>
                            <AppointmentForm
                                onSave={handleSaveAppointment}
                                onCancel={handleCancel}
                                appointment={null}
                                selectedDate={selectedDate}
                                clientId={clientId}
                                clientName={clientName}
                                clientPhone={clientPhone}
                                clientEmail={clientEmail}
                                category={categories}
                                config={calendarConfig}
                                specialDates={specialDates}
                            />
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <CalendarIcon className="mr-2 h-5 w-5" />
                                        Información
                                    </CardTitle>
                                    <CardDescription>Detalles sobre el proceso de citas</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="font-medium mb-1">Horario de atención</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Lunes a Viernes: {calendarConfig.start_time} - {calendarConfig.end_time}
                                        </p>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h3 className="font-medium mb-1">Políticas de cancelación</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Las citas pueden cancelarse hasta 24 horas antes de la hora programada.
                                        </p>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h3 className="font-medium mb-1">Métodos de pago</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Aceptamos pagos con tarjeta de crédito/débito y efectivo.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {specialDates.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Fechas especiales</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {specialDates.slice(0, 5).map((date) => (
                                                <div
                                                    key={date.specialdate_id}
                                                    className={`p-2 rounded-md text-sm ${date.is_available ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                                                >
                                                    <div className="font-medium">{date.title}</div>
                                                    <div className="text-xs">{new Date(date.date).toLocaleDateString("es-ES")}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

