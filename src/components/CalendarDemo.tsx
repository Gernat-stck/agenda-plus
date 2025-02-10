"use client";

import { useState } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  type View,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/es";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

moment.locale("es");
const localizer = momentLocalizer(moment);

type Appointment = {
  id: number;
  title: string;
  start: Date;
  end: Date;
};

const eventStyleGetter = (event: Appointment) => {
  const backgroundColor =
    event.id % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--secondary))";
  const style = {
    backgroundColor,
    borderRadius: "5px",
    opacity: 0.8,
    color: "white",
    border: "0px",
    display: "block",
  };
  return {
    style,
  };
};

export default function CalendarDemo() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      title: "Cita con el dentista",
      start: new Date(2025, 1, 10, 10, 0),
      end: new Date(2025, 1, 10, 11, 0),
    },
    {
      id: 2,
      title: "Reunión de trabajo",
      start: new Date(2025, 1, 11, 14, 0),
      end: new Date(2025, 1, 11, 15, 30),
    },
  ]);

  const [view, setView] = useState<View>("month");

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const title = window.prompt("Ingrese el título de la cita:");
    if (title) {
      setAppointments([
        ...appointments,
        {
          id: appointments.length + 1,
          title,
          start,
          end,
        },
      ]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="h-[600px] bg-card rounded-lg shadow-lg overflow-hidden">
        <BigCalendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          view={view}
          onView={(newView: any) => setView(newView)}
          selectable
          onSelectSlot={handleSelectSlot}
          eventPropGetter={eventStyleGetter}
          messages={{
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
          }}
        />
      </div>
      <Button
        onClick={() =>
          window.alert(
            "Aquí puedes implementar la lógica para agregar una nueva cita"
          )
        }
      >
        Agregar Cita
      </Button>
    </div>
  );
}
