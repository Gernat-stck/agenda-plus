"use client"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Appointment = {
    id: string
    title: string
    start: Date
    end: Date
}

type AppointmentFormProps = {
    appointment: Appointment | null
    onSave: (appointment: Appointment) => void
    onDelete: (id: string) => void
}

export default function AppointmentForm({ appointment, onSave, onDelete }: AppointmentFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Appointment>({
        defaultValues: appointment || { id: "", title: "", start: new Date(), end: new Date() },
    })

    const onSubmit = (data: Appointment) => {
        onSave(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title", { required: "Title is required" })} />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
            <div>
                <Label htmlFor="start">Start Time</Label>
                <Input id="start" type="datetime-local" {...register("start", { required: "Start time is required" })} />
                {errors.start && <p className="text-red-500 text-sm">{errors.start.message}</p>}
            </div>
            <div>
                <Label htmlFor="end">End Time</Label>
                <Input id="end" type="datetime-local" {...register("end", { required: "End time is required" })} />
                {errors.end && <p className="text-red-500 text-sm">{errors.end.message}</p>}
            </div>
            <div className="flex justify-between">
                <Button type="submit">Save</Button>
                {appointment?.id && (
                    <Button type="button" variant="destructive" onClick={() => onDelete(appointment.id)}>
                        Delete
                    </Button>
                )}
            </div>
        </form>
    )
}

