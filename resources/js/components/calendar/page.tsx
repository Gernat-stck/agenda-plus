import { useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import listPlugin from "@fullcalendar/list"
import esLocale from "@fullcalendar/core/locales/es"
import type { EventInput } from "@fullcalendar/core"
import { AppointmentDialog } from "./appointment-dialog"
import { AppointmentDetailsDialog } from "./appointment-details-dialog"
import { toast } from "sonner"
//TODO: Agregar la implementacion de confirmDialog para la eliminacion de citas
// Tipo para nuestras citas
interface Appointment extends EventInput {
    id: string
    title: string
    start: Date | string
    end: Date | string
    description?: string
    clientName?: string
    clientPhone?: string
    clientEmail?: string
    backgroundColor?: string
}

// Función para generar un color aleatorio
const getRandomColor = () => {
    const letters = "0123456789ABCDEF"
    let color = "#"
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 10)]
    }
    return color
}

// Datos de ejemplo
const initialAppointments: Appointment[] = [
    {
        id: "1",
        title: "Consulta con Juan Pérez",
        start: new Date(new Date().setHours(10, 0, 0, 0)),
        end: new Date(new Date().setHours(11, 0, 0, 0)),
        description: "Primera consulta",
        clientName: "Juan Pérez",
        clientPhone: "123-456-7890",
        clientEmail: "juan@example.com",
        backgroundColor: getRandomColor(),
    },
    {
        id: "2",
        title: "Revisión con María López",
        start: new Date(new Date().setHours(14, 0, 0, 0)),
        end: new Date(new Date().setHours(15, 0, 0, 0)),
        description: "Revisión mensual",
        clientName: "María López",
        clientPhone: "098-765-4321",
        clientEmail: "maria@example.com",
        backgroundColor: getRandomColor(),
    },
]

export default function CalendarComponent() {
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
    const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false)
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    // Función para crear una nueva cita
    const handleCreateAppointment = (appointment: Appointment) => {
        const newAppointment = {
            ...appointment,
            id: Date.now().toString(),
            backgroundColor: getRandomColor(),
        }
        setAppointments([...appointments, newAppointment])
        setIsAppointmentDialogOpen(false)

        toast.success("Cita creada", {
            description: `Se ha creado la cita "${appointment.title}" correctamente.`,
            duration: 3000,
        })
    }

    // Función para actualizar una cita existente
    const handleUpdateAppointment = (updatedAppointment: Appointment, showToast = false) => {
        setAppointments(appointments.map((apt) => (apt.id === updatedAppointment.id ? updatedAppointment : apt)))
        setIsAppointmentDialogOpen(false)
        setSelectedAppointment(null)

        if (showToast) {
            toast.success("Cita actualizada", {
                description: `La cita "${updatedAppointment.title}" ha sido modificada.`,
                duration: 3000,
            })
        }
    }

    // Función para eliminar una cita
    const handleDeleteAppointment = (id: string) => {
        const appointmentToDelete = appointments.find((apt) => apt.id === id)
        setAppointments(appointments.filter((apt) => apt.id !== id))
        setIsDetailsDialogOpen(false)
        setSelectedAppointment(null)

        toast.success("Cita eliminada", {
            description: appointmentToDelete
                ? `La cita "${appointmentToDelete.title}" ha sido eliminada.`
                : "La cita ha sido eliminada.",
            duration: 3000,
        })
    }

    // Manejador para hacer clic en una fecha
    const handleDateClick = (info: any) => {
        setSelectedDate(info.date)
        setSelectedAppointment(null)
        setIsAppointmentDialogOpen(true)
    }

    // Manejador para hacer clic en un evento
    const handleEventClick = (info: any) => {
        const appointment = appointments.find((apt) => apt.id === info.event.id)
        if (appointment) {
            setSelectedAppointment(appointment)
            setIsDetailsDialogOpen(true)
        }
    }

    // Manejador para editar una cita
    const handleEditAppointment = () => {
        setIsDetailsDialogOpen(false)
        setIsAppointmentDialogOpen(true)
    }

    // Manejador para cuando se arrastra y suelta un evento
    const handleEventDrop = (info: any) => {
        const { event } = info
        const updatedAppointment = appointments.find((apt) => apt.id === event.id)

        if (updatedAppointment) {
            const newAppointment = {
                ...updatedAppointment,
                start: event.start,
                end: event.end || new Date(new Date(event.start).getTime() + 60 * 60 * 1000),
            }

            handleUpdateAppointment(newAppointment, true)
        }
    }

    // Manejador para cuando se redimensiona un evento
    const handleEventResize = (info: any) => {
        const { event } = info
        const updatedAppointment = appointments.find((apt) => apt.id === event.id)

        if (updatedAppointment) {
            const newAppointment = {
                ...updatedAppointment,
                start: event.start,
                end: event.end,
            }

            handleUpdateAppointment(newAppointment, true)

            // Calcular la duración en minutos
            const durationMinutes = Math.round((event.end.getTime() - event.start.getTime()) / (1000 * 60))

            toast.info("Duración actualizada", {
                description: `La cita ahora tiene una duración de ${durationMinutes} minutos.`,
                duration: 3000,
            })
        }
    }

    return (
        <>
            <div className="text-foreground p-2 rounded-2xl text-[0.99rem]">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                    }}
                    locale={esLocale}
                    events={appointments}
                    eventClick={handleEventClick}
                    dateClick={handleDateClick}
                    selectable={true}
                    selectMirror={true}
                    allDaySlot={false}
                    dayMaxEvents={true}
                    weekends={false} //TODO: Esto se sustituira por configuracion del usuario
                    height="85vh"
                    businessHours={{
                        daysOfWeek: [1, 2, 3, 4, 5], // Lunes a viernes TODO: Esto se sustituira por configuracion del usuario
                        startTime: "09:00",//TODO: Esto se sustituira por configuracion del usuario
                        endTime: "18:00",//TODO: Esto se sustituira por configuracion del usuario
                    }}
                    slotMinTime="08:00"//TODO: Esto se sustituira por configuracion del usuario
                    slotMaxTime="19:00" //TODO: Esto se sustituira por configuracion del usuario
                    editable={true}
                    eventDrop={handleEventDrop}
                    eventResize={handleEventResize}
                    droppable={true}
                    viewClassNames={["dark:bg-gray-700"]}
                    nowIndicator={true}
                    now={new Date()}
                />
            </div>

            {/* Diálogo para crear/editar citas */}
            <AppointmentDialog
                isOpen={isAppointmentDialogOpen}
                onClose={() => setIsAppointmentDialogOpen(false)}
                onSave={selectedAppointment ? handleUpdateAppointment : handleCreateAppointment}
                appointment={selectedAppointment}
                selectedDate={selectedDate}
                clientId={selectedAppointment?.clientId || ""}
                clientName={selectedAppointment?.clientName || ""}
                clientPhone={selectedAppointment?.clientPhone || ""}
                clientEmail={selectedAppointment?.clientEmail || ""}
            />

            {/* Diálogo para ver detalles de citas */}
            {selectedAppointment && (
                <AppointmentDetailsDialog
                    isOpen={isDetailsDialogOpen}
                    onClose={() => setIsDetailsDialogOpen(false)}
                    appointment={selectedAppointment}
                    onEdit={handleEditAppointment}
                    onDelete={() => handleDeleteAppointment(selectedAppointment.id)}
                />
            )}
        </>
    )
}