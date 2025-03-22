import { useState } from "react"
import { Head } from "@inertiajs/react"
import { Toaster } from "sonner"

import { AppointmentForm } from "@/components/shared/appointment-form"
import { useAppointmentRegistration } from "@/hooks/use-appointment-registration"

import type { category } from "@/types/services"
import type { CalendarConfig, SpecialDate } from "@/types/calendar"
import { AppointmentInfoSidebar } from "@/components/appointments/appointment-info-sidebar"
import { PageHeader } from "@/components/shared/page-header"

interface RegisterDateProps {
    userId: string
    categories: category[]
    config: CalendarConfig | null
    specialDates: SpecialDate[]
}
interface PageProps {
    route: (name: string, params?: Record<string, any>) => string;
}

export default function RegisterDate({ userId, categories, config, specialDates }: RegisterDateProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

    // Valores por defecto para el cliente
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

    // Usar el hook personalizado para manejar la lógica de registro de citas
    const { isSubmitting, handleSaveAppointment, handleCancel } = useAppointmentRegistration({
        userId,
        redirectRoute: "/"
    })

    return (
        <>
            <Head title="Agendar Cita" />
            <Toaster position="top-right" richColors />

            <div className="flex flex-col min-h-screen justify-center items-center bg-accent p-4">
                <div className="container max-w-5xl w-full bg-accent rounded-lg shadow-md p-6">
                    <PageHeader
                        title="Agendar Nueva Cita"
                        showBackButton={false}
                    />

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
                                isSubmitting={isSubmitting}
                                slotUrl={'/book/appointments/slots'}
                            />
                        </div>

                        <AppointmentInfoSidebar
                            config={calendarConfig}
                            specialDates={specialDates}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
