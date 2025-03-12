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
import { Cita } from "@/types/clients"
import { router } from "@inertiajs/react"
import { category } from "@/types/services"
//TODO: Agregar la implementacion de confirmDialog para la eliminacion de citas
//TODO: Agregar confirmacion al editar una cita cuando se arrastra y suelta
//TODO: Crear la tabla y el controlador para las configuraciones personalizadas de cada cliente (horarios, dias laborales, etc)
// Tipo para nuestras citas
interface Appointment extends EventInput {
    id: string
    title: string
    start: Date | string  // Aceptar ambos tipos
    end: Date | string    // Aceptar ambos tipos
    description?: string
    clientName?: string
    clientPhone?: string
    clientEmail?: string
    backgroundColor?: string
    service_id?: string
    status?: 'pendiente' | 'en curso' | 'finalizado' | 'cancelado'
    payment_type?: 'tarjeta' | 'efectivo' | ''
}

// Función para mapear los datos del backend a nuestro formato de citas
const mapCitaToAppointment = (cita: any): Appointment => {
    return {
        id: cita.appointment_id,
        title: cita.title,
        start: new Date(cita.start_time),
        end: new Date(cita.end_time),
        description: `Cliente: ${cita.client_name || 'Sin asignar'} | Estado: ${cita.status}${cita.payment_type ? ` | Pago: ${cita.payment_type}` : ''}`,
        backgroundColor: getRandomColor(),
        service_id: cita.service_id,
        status: cita.status,
        payment_type: cita.payment_type,
        clientName: cita.client_name || '',
        clientId: cita.client_id || ''
    }
}

// Función que transforma un array de citas del backend a nuestro formato
const mapCitasToAppointments = (citas: Cita[]): Appointment[] => {
    return citas.map(mapCitaToAppointment);
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
export default function CalendarComponent({ appointmentsData, categories }: { appointmentsData: Cita[], categories: category[] }) {
    const [appointments, setAppointments] = useState<Appointment[]>(mapCitasToAppointments(appointmentsData))
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
    const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false)
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    // Función para actualizar una cita existente
    const handleUpdateAppointment = (citaData: Cita, showToast = false) => {
        // Convertir de formato Cita a Appointment manteniendo el id original
        const updatedAppointment: Appointment = {
            id: selectedAppointment?.id || "",
            title: citaData.title,
            start: citaData.start_time,
            end: citaData.end_time,
            backgroundColor: selectedAppointment?.backgroundColor,
            // Mantener otros datos específicos que pudiera tener el appointment
            clientName: selectedAppointment?.clientName,
            clientPhone: selectedAppointment?.clientPhone,
            clientEmail: selectedAppointment?.clientEmail,
            description: selectedAppointment?.description,
            // Actualizar con los nuevos datos específicos de Cita
            service_id: citaData.service_id,
            status: citaData.status,
            payment_type: citaData.payment_type,
        }

        setAppointments(appointments.map((apt) => (apt.id === updatedAppointment.id ? updatedAppointment : apt)))
        setIsAppointmentDialogOpen(false)
        setSelectedAppointment(null)

        if (showToast) {
            console.log(citaData)
            /*  router.patch(`appointments/${updatedAppointment.id}`, updatedAppointment, {
                  onSuccess: () => {
                      toast.success("Cita actualizada", {
                          description: `La cita "${updatedAppointment.title}" ha sido modificada.`,
                          duration: 3000,
                      })
                  },
                  onError: (error) => {
                      toast.error("Error al actualizar la cita", {
                          description: error.message,
                          duration: 5000,
                      })
                  }
              })
              */
        }
    }

    // Función adaptadora para convertir de Appointment a Cita
    const appointmentToCita = (appointment: Appointment | null): Cita | null => {
        if (!appointment) return null;

        return {
            appointment_id: appointment.id,
            service_id: appointment.service_id || "",
            title: appointment.title,
            start_time: appointment.start instanceof Date ?
                appointment.start : new Date(appointment.start),
            end_time: appointment.end instanceof Date ?
                appointment.end : new Date(appointment.end),
            status: appointment.status || "pendiente",
            payment_type: appointment.payment_type || "",
        };
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

    // Función para crear una nueva cita
    const handleCreateAppointment = (citaData: Cita) => {
        // Convertir de formato Cita a Appointment
        const newAppointment: Appointment = {
            id: Date.now().toString(), // ID temporal
            title: citaData.title,
            start: citaData.start_time,
            end: citaData.end_time,
            backgroundColor: getRandomColor(),
            clientName: citaData.client_name,
            clientId: citaData.client_id,
            service_id: citaData.service_id,
            status: citaData.status,
            payment_type: citaData.payment_type,
        }

        setAppointments([...appointments, newAppointment])
        setIsAppointmentDialogOpen(false)

        toast.success("Cita creada", {
            description: `Se ha creado la cita "${newAppointment.title}" correctamente.`,
            duration: 3000,
        })
    }

    // Manejador para hacer clic en una fecha
    const handleDateClick = (info: any) => {
        setSelectedDate(info.date)
        setSelectedAppointment(null)
        toast.info("Debes seleccionar una cita para editarla", {
            description: "Haz clic en una cita para ver más detalles o editarla.",
            duration: 3000,
        })
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
        const originalAppointment = appointments.find((apt) => apt.id === event.id)

        if (originalAppointment) {
            // Crear un objeto Appointment actualizado
            const updatedAppointment: Appointment = {
                ...originalAppointment,
                start: event.start,
                end: event.end || new Date(new Date(event.start).getTime() + 60 * 60 * 1000),
            }

            // Convertir a tipo Cita antes de llamar a handleUpdateAppointment
            const updatedCita = appointmentToCita(updatedAppointment);

            if (updatedCita) {
                handleUpdateAppointment(updatedCita, true);
            }
        }
    }

    // Función para obtener la duración del servicio
    const getServiceDuration = (serviceId: string | undefined): number => {
        if (!serviceId) return 60; // Duración predeterminada si no hay servicio seleccionado

        for (const cat of categories) {
            const service = cat.services.find(s => s.service_id === serviceId);
            if (service) {
                return service.duration;
            }
        }
        return 60; // Duración predeterminada si no se encuentra el servicio
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
                    droppable={true}
                    viewClassNames={["dark:bg-gray-700"]}
                    nowIndicator={true}
                    now={new Date()}
                />
            </div>

            {/* Diálogo para crear/editar citas con la conversión de tipos */}
            <AppointmentDialog
                isOpen={isAppointmentDialogOpen}
                onClose={() => setIsAppointmentDialogOpen(false)}
                onSave={selectedAppointment ? handleUpdateAppointment : handleCreateAppointment}
                appointment={appointmentToCita(selectedAppointment)}
                selectedDate={selectedDate}
                clientId={selectedAppointment?.clientId || ""}
                clientName={selectedAppointment?.clientName || ""}
                clientPhone={selectedAppointment?.clientPhone || ""}
                clientEmail={selectedAppointment?.clientEmail || ""}
                category={categories}
            />

            {/* Diálogo para ver detalles de citas */}
            {selectedAppointment && (
                <AppointmentDetailsDialog
                    isOpen={isDetailsDialogOpen}
                    onClose={() => setIsDetailsDialogOpen(false)}
                    appointment={selectedAppointment}
                    onEdit={handleEditAppointment}
                    onDelete={() => handleDeleteAppointment(selectedAppointment.id)}
                    duration={getServiceDuration(selectedAppointment.service_id)}
                />
            )}
        </>
    )
}