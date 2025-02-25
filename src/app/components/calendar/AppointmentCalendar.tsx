"use client"

import { useEffect, useState } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog"
import AppointmentForm from "./AppointmentForm"
import { Appointment, EventInteractionArgs } from "@/types/AppointmentType"
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Button } from "../ui/button"
import { CircleHelp } from "lucide-react"
import { startTour } from "@/utils/tourUtils"

const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop(Calendar)

export default function AppointmentCalendar() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedAppointment({ id: "", title: "", start, end })
    setIsDialogOpen(true)
  }

  const handleSelectEvent = (event: any) => {
    setSelectedAppointment(event)
    setIsDialogOpen(true)
  }

  const handleSaveAppointment = (appointment: Appointment) => {
    if (appointment.id) {
      setAppointments(appointments.map((apt) => (apt.id === appointment.id ? appointment : apt)))
    } else {
      const newAppointment = { ...appointment, id: Date.now().toString() }
      setAppointments([...appointments, newAppointment])
    }
    setIsDialogOpen(false)
  }

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== id))
    setIsDialogOpen(false)
  }

  const moveAppointment = ({ event, start, end }: any) => {
    const updatedAppointments = appointments.map((apt) => (apt.id === event.id ? { ...apt, start, end } : apt))
    setAppointments(updatedAppointments)
  }

  const resizeAppointment = ({ event, start, end }: any) => {
    const updatedAppointments = appointments.map((apt) => (apt.id === event.id ? { ...apt, start, end } : apt))
    setAppointments(updatedAppointments)
  }
  useEffect(() => {
    const tourShown = localStorage.getItem("tourShown")
    if (!tourShown) {
      startTour()
    }
  }, [])
  return (
    <div className="h-[85svh]  relative">
      <DragAndDropCalendar
        localizer={localizer}
        events={appointments}
        onEventDrop={moveAppointment}
        onEventResize={resizeAppointment}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable
        resizable
        className="h-full"
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAppointment?.id ? "Edit Appointment" : "Create Appointment"}</DialogTitle>
          </DialogHeader>
          <AppointmentForm
            appointment={selectedAppointment}
            onSave={handleSaveAppointment}
            onDelete={handleDeleteAppointment}
          />
        </DialogContent>
      </Dialog>
      <Button
        id="tour-button"
        onClick={startTour}
        className="flex z-99  bg-purple-500 hover:bg-purple-600 text-white rounded-full  shadow-xl absolute bottom-4 -right-16"
      >
        <CircleHelp className="h-full w-full" />
      </Button>
    </div>
  )
}
