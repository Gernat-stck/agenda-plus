"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { DateRange } from "react-day-picker"

export function SalesTimeframeSelector() {
    const [date, setDate] = useState<DateRange | undefined>()

    return (
        <div className="flex flex-wrap items-center gap-2 m-2">
            <Button variant="outline" size="sm">
                Hoy
            </Button>
            <Button variant="outline" size="sm">
                Ayer
            </Button>
            <Button variant="outline" size="sm">
                Esta semana
            </Button>
            <Button variant="outline" size="sm">
                Este mes
            </Button>
            <Button variant="outline" size="sm">
                Último trimestre
            </Button>
            <Button variant="outline" size="sm">
                Este año
            </Button>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={date ? "default" : "outline"} size="sm" className="ml-auto">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "dd/MM/yy", { locale: es })} - {format(date.to, "dd/MM/yy", { locale: es })}
                                </>
                            ) : (
                                format(date.from, "dd/MM/yy", { locale: es })
                            )
                        ) : (
                            <span>Personalizado</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                        locale={es}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

