export interface AppointmentDialogProps {
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
