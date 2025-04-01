import { useBackgroundEvents } from '@/hooks/use-background-events';
import { useCalendarEvents } from '@/hooks/use-calendar-events';
import { useCalendarState } from '@/hooks/use-calendar-state';
import { CalendarConfig, SpecialDate } from '@/types/calendar';
import { Cita } from '@/types/clients';
import { category } from '@/types/services';
import type { EventInput } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { format } from 'date-fns';
import { AppointmentDetailsDialog } from '../appointments/appointment-details-dialog';
import { AppointmentDialog } from '../appointments/appointment-dialog';
import ConfirmActionDialog from '../shared/confirm-dialog';

export default function CalendarComponent({
    appointmentsData,
    categories,
    config,
    specialDates,
}: {
    appointmentsData: Cita[];
    categories: category[];
    config: CalendarConfig;
    specialDates: SpecialDate[];
}) {
    // Estados y configuración del calendario
    const calendarState = useCalendarState(appointmentsData, config);
    const { safeConfig, appointments, selectedAppointment, ...restState } = calendarState;

    // Eventos de fondo (fechas especiales)
    const backgroundEvents = useBackgroundEvents(specialDates);

    // Manejadores de eventos del calendario
    const calendarEvents = useCalendarEvents({
        ...calendarState,
        categories,
        config,
        specialDates,
    });

    // Todos los eventos combinados (citas y fechas especiales)
    const allEvents: EventInput[] = [...appointments, ...backgroundEvents];

    return (
        <>
            <div className="text-foreground custom-scrollbar rounded-2xl p-2 text-[0.99rem]">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                    }}
                    locale={esLocale}
                    events={allEvents}
                    eventClick={calendarEvents.handleEventClick}
                    dateClick={calendarEvents.handleDateClick}
                    selectable={false}
                    selectMirror={false}
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
                    editable={true}
                    eventDrop={calendarEvents.handleEventDrop}
                    droppable={true}
                    viewClassNames={['dark:bg-gray-700']}
                    nowIndicator={true}
                    eventResizableFromStart={false}
                    now={new Date()}
                    eventConstraint={{
                        daysOfWeek: safeConfig.business_days,
                        startTime: safeConfig.start_time,
                        endTime: safeConfig.end_time,
                    }}
                    dayCellClassNames={(arg) => {
                        const dateStr = format(arg.date, 'yyyy-MM-dd');
                        const dayOfWeek = arg.date.getDay();
                        const specialDate = specialDates?.find((date) => {
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

            {/* Diálogo para crear/editar citas */}
            <AppointmentDialog
                isOpen={restState.isAppointmentDialogOpen}
                onClose={() => restState.setIsAppointmentDialogOpen(false)}
                onSave={calendarEvents.handleUpdateAppointment}
                appointment={calendarEvents.appointmentToCita(selectedAppointment)}
                selectedDate={restState.selectedDate}
                clientId={selectedAppointment?.clientId || ''}
                clientName={selectedAppointment?.clientName || ''}
                clientPhone={selectedAppointment?.clientPhone || ''}
                clientEmail={selectedAppointment?.clientEmail || ''}
                category={categories}
                config={config}
                specialDates={specialDates}
            />

            {/* Diálogo para ver detalles de citas */}
            {selectedAppointment && (
                <AppointmentDetailsDialog
                    isOpen={restState.isDetailsDialogOpen}
                    onClose={() => restState.setIsDetailsDialogOpen(false)}
                    appointment={selectedAppointment}
                    onEdit={calendarEvents.handleEditAppointment}
                    onDelete={() => calendarEvents.handleDeleteAppointment(selectedAppointment.id)}
                    duration={calendarEvents.getServiceDuration(selectedAppointment.service_id)}
                />
            )}

            {/* Diálogos de confirmación */}
            <ConfirmActionDialog
                open={restState.showDragConfirmation}
                onOpenChange={restState.setShowDragConfirmation}
                onConfirm={calendarEvents.handleDragConfirm}
                onCancel={calendarEvents.handleDragCancel}
                title="Mover cita"
                displayMessage="mover esta cita"
                confirmText="Continuar"
                finalConfirmation={false}
                isDestructive={false}
            />

            <ConfirmActionDialog
                open={restState.showFinalDragConfirmation}
                onOpenChange={restState.setShowFinalDragConfirmation}
                onConfirm={calendarEvents.handleFinalDragConfirm}
                onCancel={calendarEvents.handleDragCancel}
                title="Confirmar cambio"
                displayMessage="mover esta cita a una nueva fecha y hora"
                confirmText="Mover cita"
                finalConfirmation={true}
                isDestructive={false}
            />
        </>
    );
}
