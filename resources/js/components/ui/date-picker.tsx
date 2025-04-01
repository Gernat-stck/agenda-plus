import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, ChevronLeftCircleIcon, ChevronRightCircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
    date: string // formato "yyyy-MM-dd"
    onDateChange: (date: string) => void
    className?: string
    disabled?: (date: Date) => boolean
}

export function DatePicker({ date, onDateChange, className, disabled }: DatePickerProps) {
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
                        {date ? format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: es }) : <span>Seleccionar fecha</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleSelect}
                        initialFocus
                        locale={es}
                        weekStartsOn={1} // Semana comienza en lunes
                        disabled={disabled}
                        className="rounded-md border bg-popover p-3"
                        classNames={{
                            month: "space-y-4",
                            caption: "flex justify-center pt-1 relative items-center",
                            caption_label: "text-sm font-medium",
                            nav: "flex absolute right-1 left-1 top-1 justify-between items-center",
                            nav_button: "h-7 w-7 bg-transparent p-0 hover:bg-accent hover:text-accent-foreground rounded-md",
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex",
                            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                            row: "flex w-full mt-2",
                            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                            day_selected:
                                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                            day_today: "bg-accent text-accent-foreground",
                            day_outside: "text-muted-foreground opacity-50",
                            day_disabled: "text-muted-foreground opacity-50",
                            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                            day_hidden: "invisible",
                        }}
                        components={{
                            PreviousMonthButton: () => <ChevronLeftCircleIcon className="h-4 w-4 text-foreground" />,
                            NextMonthButton: () => <ChevronRightCircleIcon className="h-4 w-4 text-foreground" />,
                        }} 
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
