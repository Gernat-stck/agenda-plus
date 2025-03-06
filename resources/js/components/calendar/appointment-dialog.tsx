import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { toast } from "sonner"

interface AppointmentDialogProps {
    isOpen: boolean
    onClose: () => void
    onSave: (appointment: any) => void
    appointment: any | null
    selectedDate: Date | null
    clientId: string
    clientName: string
    clientPhone: string
    clientEmail: string
}

export function AppointmentDialog({ isOpen, onClose, onSave, appointment, selectedDate, clientId, clientName, clientPhone, clientEmail }: AppointmentDialogProps) {
    const [formData, setFormData] = useState({
        id: "",
        title: "",
        start: new Date(),
        end: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hora después
        description: "",
        clientId: clientId,
        clientName: clientName,
        clientPhone: clientPhone,
        clientEmail: clientEmail,
    })

    const [date, setDate] = useState<Date | undefined>(new Date())
    const [startTime, setStartTime] = useState("09:00")
    const [endTime, setEndTime] = useState("10:00")

    useEffect(() => {
        if (appointment) {
            const startDate = new Date(appointment.start)
            const endDate = new Date(appointment.end)

            setFormData({
                id: appointment.id,
                title: appointment.title,
                start: startDate,
                end: endDate,
                description: appointment.description || "",
                clientId: appointment.clientId,
                clientName: appointment.clientName,
                clientPhone: appointment.clientPhone,
                clientEmail: appointment.clientEmail,
            })

            setDate(startDate)
            setStartTime(format(startDate, "HH:mm"))
            setEndTime(format(endDate, "HH:mm"))
        } else if (selectedDate) {
            setDate(selectedDate)
            setFormData({
                ...formData,
                start: selectedDate,
                end: new Date(new Date(selectedDate).getTime() + 60 * 60 * 1000),
            })
        } else {
            setFormData({
                id: "",
                title: "",
                start: new Date(),
                end: new Date(new Date().getTime() + 60 * 60 * 1000),
                description: "",
                clientId: clientId,
                clientName: clientName,
                clientPhone: clientPhone,
                clientEmail: clientEmail,
            })
            setDate(new Date())
            setStartTime("09:00")
            setEndTime("10:00")
        }
    }, [appointment, selectedDate, isOpen])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleDateChange = (newDate: Date | undefined) => {
        if (newDate) {
            setDate(newDate)

            const [startHour, startMinute] = startTime.split(":").map(Number)
            const [endHour, endMinute] = endTime.split(":").map(Number)

            const newStartDate = new Date(newDate)
            newStartDate.setHours(startHour, startMinute, 0)

            const newEndDate = new Date(newDate)
            newEndDate.setHours(endHour, endMinute, 0)

            setFormData({
                ...formData,
                start: newStartDate,
                end: newEndDate,
            })
        }
    }

    const handleTimeChange = (type: "start" | "end", value: string) => {
        if (type === "start") {
            setStartTime(value)

            const [hours, minutes] = value.split(":").map(Number)
            const newStartDate = new Date(formData.start)
            newStartDate.setHours(hours, minutes, 0)

            const newEndDate = new Date(formData.end)
            if (newEndDate < newStartDate) {
                newEndDate.setTime(newStartDate.getTime() + 60 * 60 * 1000)
                setEndTime(format(newEndDate, "HH:mm"))
            }

            setFormData({
                ...formData,
                start: newStartDate,
                end: newEndDate,
            })
        } else {
            setEndTime(value)

            const [hours, minutes] = value.split(":").map(Number)
            const newEndDate = new Date(formData.end)
            newEndDate.setHours(hours, minutes, 0)

            const newStartDate = new Date(formData.start)
            if (newEndDate < newStartDate) {
                newStartDate.setTime(newEndDate.getTime() - 60 * 60 * 1000)
                setStartTime(format(newStartDate, "HH:mm"))
            }

            setFormData({
                ...formData,
                start: newStartDate,
                end: newEndDate,
            })
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
        toast.success("Cita guardada", {
            description: `La cita "${formData.title}" ha sido guardada correctamente.`,
            duration: 3000,
        })
    }

    const generateTimeOptions = () => {
        const options = []
        for (let hour = 8; hour < 20; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const formattedHour = hour.toString().padStart(2, "0")
                const formattedMinute = minute.toString().padStart(2, "0")
                options.push(`${formattedHour}:${formattedMinute}`)
            }
        }
        return options
    }

    const timeOptions = generateTimeOptions()

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{appointment ? "Editar Cita" : "Nueva Cita"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Título de la Cita</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Ej: Consulta con Dr. García"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Fecha</Label>
                                <Input
                                    type="date"
                                    value={format(date || new Date(), "yyyy-MM-dd")}
                                    onChange={(e) => handleDateChange(new Date(e.target.value))}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Hora de inicio</Label>
                                <Input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => handleTimeChange("start", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Hora de fin</Label>
                                <Input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => handleTimeChange("end", e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="clientName">Nombre del Cliente</Label>
                                <Input
                                    id="clientName"
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleInputChange}
                                    placeholder="Nombre completo"
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="clientPhone">Teléfono</Label>
                                <Input
                                    id="clientPhone"
                                    name="clientPhone"
                                    value={formData.clientPhone}
                                    onChange={handleInputChange}
                                    placeholder="Número de teléfono"
                                    disabled
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="clientEmail">Email</Label>
                                <Input
                                    id="clientEmail"
                                    name="clientEmail"
                                    type="email"
                                    value={formData.clientEmail}
                                    onChange={handleInputChange}
                                    placeholder="Correo electrónico"
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Detalles adicionales de la cita"
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit">{appointment ? "Actualizar" : "Crear"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}