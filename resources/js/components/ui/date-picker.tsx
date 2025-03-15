"use client"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
    date: string // formato "yyyy-MM-dd"
    onDateChange: (date: string) => void
    className?: string
}

export function DatePicker({ date, onDateChange, className }: DatePickerProps) {
    // Función para crear una fecha local a partir de una cadena YYYY-MM-DD
    const createDateFromString = (dateStr: string): Date => {
        if (!dateStr) return new Date()

        // Asegurarse de que solo usamos la parte de la fecha (YYYY-MM-DD)
        const cleanDateStr = dateStr.substring(0, 10)

        // Crear la fecha usando componentes individuales para evitar problemas de zona horaria
        const [year, month, day] = cleanDateStr.split("-").map(Number)

        // Crear la fecha al mediodía para evitar problemas de cambio de día
        // El mes en JavaScript es 0-indexed (enero = 0)
        return new Date(year, month - 1, day, 12, 0, 0)
    }

    // Función para convertir una fecha a string en formato YYYY-MM-DD
    const formatDateToString = (date: Date | undefined): string => {
        if (!date) return ""

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")

        return `${year}-${month}-${day}`
    }

    // Crear la fecha seleccionada como objeto Date
    const selectedDate = createDateFromString(date)

    // Manejar la selección de fecha
    const handleSelect = (newDate: Date | undefined) => {
        if (newDate) {
            // Convertir la fecha seleccionada a string en formato YYYY-MM-DD
            const dateString = formatDateToString(newDate)
            onDateChange(dateString)
        }
    }

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(selectedDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={selectedDate} onSelect={handleSelect} initialFocus locale={es} />
                </PopoverContent>
            </Popover>
        </div>
    )
}

