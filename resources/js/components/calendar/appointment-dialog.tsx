import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { toast } from "sonner"
import type { Cita } from "@/types/clients"
import type { category } from "@/types/services"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AppointmentDialogProps {
    isOpen: boolean
    onClose: () => void
    onSave: (appointment: Cita) => void
    appointment: Cita | null
    selectedDate: Date | null
    clientId: string
    clientName: string
    clientPhone: string
    clientEmail: string
    category: category[]
}

export function AppointmentDialog({
    isOpen,
    onClose,
    onSave,
    appointment,
    selectedDate,
    clientId,
    clientName,
    clientPhone,
    clientEmail,
    category,
}: AppointmentDialogProps) {
    const [formData, setFormData] = useState<Cita>({
        appointment_id: "",
        service_id: "",
        title: "",
        start_time: new Date(),
        end_time: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hora después
        status: 'pendiente',
        payment_type: "",
    })

    const [date, setDate] = useState<Date | undefined>(new Date())
    const [startTime, setStartTime] = useState("09:00")
    const [endTime, setEndTime] = useState("10:00")

    useEffect(() => {
        if (appointment) {
            const startDate = new Date(appointment.start_time)
            const endDate = new Date(appointment.end_time)

            setFormData({
                appointment_id: appointment.appointment_id,
                service_id: appointment.service_id,
                title: appointment.title,
                start_time: startDate,
                end_time: endDate,
                status: appointment.status,
                payment_type: appointment.payment_type,
            })

            setDate(startDate)
            setStartTime(format(startDate, "HH:mm"))
            setEndTime(format(endDate, "HH:mm"))
        } else if (selectedDate) {
            setDate(selectedDate)
            setFormData({
                ...formData,
                start_time: selectedDate,
                end_time: new Date(new Date(selectedDate).getTime() + 60 * 60 * 1000),
            })
        } else {
            setFormData({
                appointment_id: "",
                service_id: "",
                title: "",
                start_time: new Date(),
                end_time: new Date(new Date().getTime() + 60 * 60 * 1000),
                status: "pendiente",
                payment_type: "tarjeta",
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
                start_time: newStartDate,
                end_time: newEndDate,
            })
        }
    }

    const handleTimeChange = (type: "start" | "end", value: string) => {
        if (type === "start") {
            setStartTime(value)

            const [hours, minutes] = value.split(":").map(Number)
            const newStartDate = new Date(formData.start_time)
            newStartDate.setHours(hours, minutes, 0)

            const newEndDate = new Date(formData.end_time)
            if (newEndDate < newStartDate) {
                newEndDate.setTime(newStartDate.getTime() + 60 * 60 * 1000)
                setEndTime(format(newEndDate, "HH:mm"))
            }

            setFormData({
                ...formData,
                start_time: newStartDate,
                end_time: newEndDate,
            })
        } else {
            setEndTime(value)

            const [hours, minutes] = value.split(":").map(Number)
            const newEndDate = new Date(formData.end_time)
            newEndDate.setHours(hours, minutes, 0)

            const newStartDate = new Date(formData.start_time)
            if (newEndDate < newStartDate) {
                newStartDate.setTime(newEndDate.getTime() - 60 * 60 * 1000)
                setStartTime(format(newStartDate, "HH:mm"))
            }

            setFormData({
                ...formData,
                start_time: newStartDate,
                end_time: newEndDate,
            })
        }
    }

    const handleSelectChange = (type: "service" | "payment", value: string) => {
        if (type === "payment") {
            if (value === "tarjeta" || value === "efectivo") {
                setFormData({
                    ...formData,
                    payment_type: value,
                });
            }
            return;
        }
        // Buscar el nombre de la categoría seleccionada
        const selectedCategory = category.find((cat) => cat.service_id === value)
        // Actualizar el service_id y el título con el nombre de la categoría
        setFormData({
            ...formData,
            service_id: value,
            title: selectedCategory ? `${selectedCategory.category} de ${clientName}` : "",
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.service_id === "" || formData.payment_type === "") {
            toast.error("Error", {
                description: "Por favor seleccione un servicio y un tipo de pago.",
                duration: 3000,
            })
            return;
        }
        onSave(formData)
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
                                placeholder="Selecciona un servicio para autocompletar"
                                required
                                disabled
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
                                <Input type="time" value={startTime} onChange={(e) => handleTimeChange("start", e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Hora de fin</Label>
                                <Input type="time" value={endTime} onChange={(e) => handleTimeChange("end", e.target.value)} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="clientName">Nombre del Cliente</Label>
                                <Input
                                    id="clientName"
                                    name="clientName"
                                    value={clientName}
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
                                    value={clientPhone}
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
                                    value={clientEmail}
                                    onChange={handleInputChange}
                                    placeholder="Correo electrónico"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="service_id">Servicio</Label>
                                <Select name="service_id" value={formData.service_id} onValueChange={(value) => handleSelectChange("service", value)} required>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Seleccionar servicio" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {category.map((cat) => (
                                            <SelectItem key={cat.service_id} value={cat.service_id}>
                                                {cat.category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="service_id">Tipo de pago</Label>
                                <Select name="service_id" value={formData.payment_type} onValueChange={(value) => handleSelectChange("payment", value)} required>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Seleccionar Metodo de pago" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tarjeta">Tarjeta</SelectItem>
                                        <SelectItem value="efectivo">Efectivo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
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

