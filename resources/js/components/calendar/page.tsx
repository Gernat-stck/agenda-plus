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
import { CalendarConfig, SpecialDate } from "@/types/calendar"
import ConfirmActionDialog from "../confirm-dialog"
import { format } from "date-fns";

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
export default function CalendarComponent(
    {
        appointmentsData,
        categories,
        config,
        specialDates
    }: {
        appointmentsData: Cita[],
        categories: category[],
        config: CalendarConfig,
        specialDates: SpecialDate[]
    }) {
    // Crear una configuración segura con valores predeterminados
    const safeConfig = config || {
        show_weekend: true,
        business_days: [1, 2, 3, 4, 5],
        start_time: "08:00",
        end_time: "18:00",
        max_appointments: 1,
        slot_min_time: "07:00",
        slot_max_time: "20:00",
        user_id: ""
    }
    const [appointments, setAppointments] = useState<Appointment[]>(mapCitasToAppointments(appointmentsData))
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
    const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false)
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [showDragConfirmation, setShowDragConfirmation] = useState(false)
    const [showFinalDragConfirmation, setShowFinalDragConfirmation] = useState(false)
    const [draggedEventInfo, setDraggedEventInfo] = useState<any>(null)
    const backgroundEvents: EventInput[] = specialDates?.map(date => {
        // Extraer solo la parte de la fecha (YYYY-MM-DD) de manera consistente con dayCellClassNames
        const specialDateStr = date.date.substring(0, 10);

        return {
            id: `special-${date.id}`,
            title: date.title,
            start: specialDateStr, // Usar directamente el string extraído
            allDay: true,
            display: 'background',
            backgroundColor: date.color || '#ff9f89',
            extendedProps: {
                description: date.description,
                isAvailable: date.is_available,
                type: 'special-date'
            }
        };
    }) || [];
    // Función para actualizar una cita existente
    const handleUpdateAppointment = (citaData: Cita) => {
        // Formatear fechas para preservar la zona horaria local
        const formattedStartTime = format(citaData.start_time, "yyyy-MM-dd HH:mm:ss");
        const formattedEndTime = format(citaData.end_time, "yyyy-MM-dd HH:mm:ss");

        // Crear el objeto de datos a enviar al servidor
        const updateData = {
            client_id: config.client_id,
            service_id: citaData.service_id || "",
            title: citaData.title,
            start_time: formattedStartTime,
            end_time: formattedEndTime,
            status: citaData.status || "pendiente",
            payment_type: citaData.payment_type || ""
        };

        router.patch(`appointments/calendar/${citaData.appointment_id}`, updateData, {
            onSuccess: () => {
                toast.success("Cita actualizada", {
                    description: `La cita "${citaData.title}" ha sido modificada.`,
                    duration: 3000,
                });

                // Convertir citaData a un objeto Appointment para actualizar el estado local
                const updatedAppointment: Appointment = {
                    id: citaData.appointment_id,
                    title: citaData.title,
                    start: citaData.start_time,
                    end: citaData.end_time,
                    backgroundColor: selectedAppointment?.backgroundColor || getRandomColor(),
                    clientName: citaData.client_name,
                    clientId: config.client_id,
                    service_id: citaData.service_id,
                    status: citaData.status,
                    payment_type: citaData.payment_type
                };

                setAppointments(appointments.map((apt) =>
                    apt.id === citaData.appointment_id ? updatedAppointment : apt
                ));

                setIsAppointmentDialogOpen(false);
                setSelectedAppointment(null);
            },
            onError: (error) => {
                console.error("Error updating appointment:", error);
                toast.error("Error al actualizar la cita", {
                    description: error.message || "Verifica los datos e intenta nuevamente",
                    duration: 5000,
                });
            }
        });
    };

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
        router.delete((`appointments/calendar/${id}`), {
            onSuccess: () => {
                toast.success("Cita eliminada", {
                    description: appointmentToDelete
                        ? `La cita "${appointmentToDelete.title}" ha sido eliminada.`
                        : "La cita ha sido eliminada.",
                    duration: 3000,
                })
            },
            onError: (error) => {
                toast.error("Error al eliminar la cita", {
                    description: error.message,
                    duration: 5000,
                })
                return
            }
        })
        const appointmentToDelete = appointments.find((apt) => apt.id === id)
        setAppointments(appointments.filter((apt) => apt.id !== id))
        setIsDetailsDialogOpen(false)
        setSelectedAppointment(null)
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
        // Extraer información del evento
        const { event } = info;
        const newDate = event.start;
        const dayOfWeek = newDate.getDay();
        const newTimeString = format(newDate, "HH:mm");

        // Verificar si es un día permitido
        if (!config.business_days.includes(dayOfWeek)) {
            info.revert();
            toast.error("Día no disponible", {
                description: "No puedes programar citas en días no laborables.",
                duration: 3000,
            });
            return;
        }

        // Verificar si es un horario permitido
        if (newTimeString < config.start_time || newTimeString > config.end_time) {
            info.revert();
            toast.error("Horario no disponible", {
                description: `El horario laboral es de ${config.start_time} a ${config.end_time}.`,
                duration: 3000,
            });
            return;
        }

        // Verificar si es una fecha especial no disponible
        const dateString = format(newDate, "yyyy-MM-dd");
        const isSpecialDateDisabled = specialDates?.some(
            specialDate =>
                specialDate.date === dateString &&
                !specialDate.is_available
        );

        if (isSpecialDateDisabled) {
            info.revert();
            toast.error("Fecha no disponible", {
                description: "Esta fecha está marcada como no disponible en el calendario.",
                duration: 3000,
            });
            return;
        }
        setDraggedEventInfo(info);
        setShowDragConfirmation(true);
        info.revert();
    }

    // Manejadores para la confirmación
    const handleDragConfirm = () => {
        setShowDragConfirmation(false);
        setShowFinalDragConfirmation(true);
    }


    const handleFinalDragConfirm = () => {
        setShowFinalDragConfirmation(false);

        if (draggedEventInfo) {
            const { event } = draggedEventInfo;
            const originalAppointment = appointments.find((apt) => apt.id === event.id);


            if (originalAppointment) {
                const serviceDuration = getServiceDuration(originalAppointment.service_id);
                const newStart = event.start;
                const newEnd = new Date(newStart.getTime() + serviceDuration * 60000);

                if (format(newEnd, "HH:mm") > config.end_time) {
                    toast.warning("La cita excede el horario laboral", {
                        description: "La hora de finalización queda fuera del horario configurado.",
                        duration: 3000,
                    });
                }

                const updatedAppointment: Appointment = {
                    ...originalAppointment,
                    start: newStart,
                    end: newEnd,
                };

                // Formatear las fechas como strings para preservar la hora local
                const formattedStartTime = format(updatedAppointment.start instanceof Date ?
                    updatedAppointment.start : new Date(updatedAppointment.start),
                    "yyyy-MM-dd HH:mm:ss");

                const formattedEndTime = format(updatedAppointment.end instanceof Date ?
                    updatedAppointment.end : new Date(updatedAppointment.end),
                    "yyyy-MM-dd HH:mm:ss");

                // Actualizar la cita en la interfaz
                setAppointments(appointments.map((apt) =>
                    apt.id === updatedAppointment.id ? updatedAppointment : apt
                ));

                // Enviar la solicitud al servidor con fechas formateadas
                router.patch(`appointments/calendar/${updatedAppointment.id}`, {
                    client_id: updatedAppointment.clientId,
                    appointment_id: updatedAppointment.id,
                    service_id: updatedAppointment.service_id,
                    title: updatedAppointment.title,
                    start_time: formattedStartTime,
                    end_time: formattedEndTime,
                    status: updatedAppointment.status,
                    payment_type: updatedAppointment.payment_type
                }, {
                    onSuccess: () => {
                        toast.success("Cita actualizada", {
                            description: `La cita "${updatedAppointment.title}" ha sido movida correctamente.`,
                            duration: 3000,
                        });
                    },
                    onError: (error) => {
                        toast.error("Error al mover la cita", {
                            description: error.message,
                            duration: 5000,
                        });
                    }
                });
            }
            setDraggedEventInfo(null);
        }
    }
    const handleDragCancel = () => {
        setDraggedEventInfo(null);
        setShowDragConfirmation(false);
        setShowFinalDragConfirmation(false);
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
    const allEvents: EventInput[] = [...appointments, ...backgroundEvents];
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
                    events={allEvents}
                    eventClick={handleEventClick}
                    dateClick={handleDateClick}
                    selectable={true}
                    selectMirror={true}
                    allDaySlot={false}
                    dayMaxEvents={true}
                    weekends={safeConfig.show_weekend}
                    height="85vh"
                    businessHours={{
                        daysOfWeek: safeConfig.business_days,
                        startTime: safeConfig.start_time,
                        endTime: safeConfig.end_time,
                    }}
                    slotMinTime={safeConfig.slot_min_time}
                    slotMaxTime={safeConfig.slot_max_time}
                    slotEventOverlap={false}
                    eventMaxStack={safeConfig.max_appointments || 1}
                    editable={true}
                    eventDrop={handleEventDrop}
                    droppable={true}
                    viewClassNames={["dark:bg-gray-700"]}
                    nowIndicator={true}
                    eventResizableFromStart={false}
                    now={new Date()}
                    eventConstraint={{
                        daysOfWeek: safeConfig.business_days,
                        startTime: safeConfig.start_time,
                        endTime: safeConfig.end_time,
                    }}
                    dayCellClassNames={(arg) => {
                        const dateStr = format(arg.date, "yyyy-MM-dd");
                        const dayOfWeek = arg.date.getDay();
                        const specialDate = specialDates?.find(date => {
                            const specialDateStr = date.date.substring(0, 10);
                            return specialDateStr === dateStr && !date.is_available;
                        });
                        const isNonBusinessDay = !safeConfig.business_days.includes(dayOfWeek);
                        if (specialDate) {
                            return `bg-[${specialDate.color}] dark:bg-opacity-20 text-white dark:text-black`;
                        } else if (isNonBusinessDay) {
                            return 'bg-gray-100 dark:bg-gray-800/30';
                        }
                        return '';
                    }}
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
                config={config}
                specialDates={specialDates}
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

            {/* Diálogo de confirmación para arrastrar citas */}
            <ConfirmActionDialog
                open={showDragConfirmation}
                onOpenChange={setShowDragConfirmation}
                onConfirm={handleDragConfirm}
                onCancel={handleDragCancel}
                title="Mover cita"
                displayMessage="mover esta cita"
                confirmText="Continuar"
                finalConfirmation={false}
                isDestructive={false}
            />

            {/* Confirmación final para arrastrar citas */}
            <ConfirmActionDialog
                open={showFinalDragConfirmation}
                onOpenChange={setShowFinalDragConfirmation}
                onConfirm={handleFinalDragConfirm}
                onCancel={handleDragCancel}
                title="Confirmar cambio"
                displayMessage="mover esta cita a una nueva fecha y hora"
                confirmText="Mover cita"
                finalConfirmation={true}
                isDestructive={false}
            />
        </>
    )
}