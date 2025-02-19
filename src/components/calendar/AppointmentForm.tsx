"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { Cita } from "@/contexts/CitasContext";
import { format } from "date-fns";

type AppointmentFormProps = {
    appointment: Cita | null;
    onSave: (appointment: Cita) => void;
    onDelete: (id: string) => void;
};

export default function AppointmentForm({
    appointment,
    onSave,
    onDelete,
}: AppointmentFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<Cita>({
        defaultValues: {
            id: appointment?.id || "",
            title: appointment?.title || "",
            start: appointment?.start || new Date(),
            end: appointment?.end || new Date(),
            estado: appointment?.estado || "Pendiente",
        },
    });

    useEffect(() => {
        if (appointment) {
            setValue("title", appointment.title);
            setValue("start", new Date(format(new Date(appointment.start), "yyyy-MM-dd'T'HH:mm")));
            setValue("end", new Date(format(new Date(appointment.end), "yyyy-MM-dd'T'HH:mm")));
            setValue("estado", appointment.estado);
        }
    }, [appointment, setValue]);

    const onSubmit = (data: Cita) => {
        const appointmentData: Cita = {
            ...data,
            id: appointment?.id || Date.now().toString(),
            start: new Date(data.start),
            end: new Date(data.end),
        };
        onSave(appointmentData);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="title">Título</Label>
                <Input
                    id="title"
                    {...register("title", { required: "El título es obligatorio" })}
                />
                {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
            </div>
            <div>
                <Label htmlFor="start">Fecha y Hora de Inicio</Label>
                <Input
                    id="start"
                    type="datetime-local"
                    {...register("start", { required: "La fecha y hora de inicio son obligatorias" })}
                />
                {errors.start && (
                    <p className="text-red-500 text-sm">{errors.start.message}</p>
                )}
            </div>
            <div>
                <Label htmlFor="end">Fecha y Hora de Fin</Label>
                <Input
                    id="end"
                    type="datetime-local"
                    {...register("end", { required: "La fecha y hora de fin son obligatorias" })}
                />
                {errors.end && (
                    <p className="text-red-500 text-sm">{errors.end.message}</p>
                )}
            </div>
            <div>
                <Label htmlFor="estado">Estado de la Cita</Label>
                <select
                    id="estado"
                    {...register("estado", { required: "El estado es obligatorio" })}
                    className="input"
                >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="En Curso">En Curso</option>
                    <option value="Cancelada">Cancelada</option>
                </select>
                {errors.estado && (
                    <p className="text-red-500 text-sm">{errors.estado.message}</p>
                )}
            </div>
            <div className="flex justify-between">
                <Button type="submit">Guardar</Button>
                {appointment?.id && (
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => onDelete(appointment.id)}
                    >
                        Eliminar
                    </Button>
                )}
            </div>
        </form>
    );
}
