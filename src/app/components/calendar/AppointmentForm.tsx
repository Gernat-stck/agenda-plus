// app/components/AppointmentForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useEffect } from "react";
import { Cita } from "@/app/contexts/CitaContext";

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
            start: appointment?.start || new Date().toISOString().slice(0, 16),
            end: appointment?.end || new Date().toISOString().slice(0, 16),
            estado: appointment?.estado || "Pendiente",
        },
    });

    useEffect(() => {
        if (appointment) {
            setValue("title", appointment.title);
            setValue("start", appointment.start);
            setValue("end", appointment.end);
            setValue("estado", appointment.estado);
        }
    }, [appointment, setValue]);

    const onSubmit = (data: Cita) => {
        const appointmentData: Cita = {
            ...data,
            id: appointment?.id || Date.now().toString(),
        };
        onSave(appointmentData);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Campos del formulario */}
            {/* Título */}
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
            {/* Fecha de inicio */}
            <div>
                <Label htmlFor="start">Fecha y Hora de Inicio</Label>
                <Input
                    id="start"
                    type="datetime-local"
                    {...register("start", {
                        required: "La fecha y hora de inicio son obligatorias",
                    })}
                />
                {errors.start && (
                    <p className="text-red-500 text-sm">{errors.start.message}</p>
                )}
            </div>
            {/* Fecha de fin */}
            <div>
                <Label htmlFor="end">Fecha y Hora de Fin</Label>
                <Input
                    id="end"
                    type="datetime-local"
                    {...register("end", {
                        required: "La fecha y hora de fin son obligatorias",
                    })}
                />
                {errors.end && (
                    <p className="text-red-500 text-sm">{errors.end.message}</p>
                )}
            </div>
            {/* Estado */}
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
            {/* Botones */}
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
