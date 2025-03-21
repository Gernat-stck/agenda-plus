"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { TimeSlot } from "@/types/calendar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { format } from "date-fns"

interface AvailableTimeSlotsProps {
    date: Date
    onSelectSlot: (startTime: string, endTime: string) => void
    availableSlots: TimeSlot[]
    className?: string
}

export function AvailableTimeSlots({ date, onSelectSlot, availableSlots, className }: AvailableTimeSlotsProps) {
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

    // Sincronizar el selectedSlot con la hora seleccionada en el componente padre
    useEffect(() => {
        if (date) {
            // Extraer la hora y minutos del objeto Date
            const formattedHour = format(date, "HH:mm")
            // Si esa hora está entre los slots disponibles, seleccionarla
            const matchingSlot = availableSlots.find(slot => slot.startTime === formattedHour)
            if (matchingSlot) {
                setSelectedSlot(matchingSlot.startTime)
            } else {
                // Si no hay un slot exacto, intentar encontrar el más cercano
                setSelectedSlot(null)
            }
        }
    }, [date, availableSlots])

    // Agrupar slots por hora para una mejor visualización
    const slotsByHour = availableSlots.reduce(
        (acc, slot) => {
            const hour = slot.startTime.split(":")[0]
            if (!acc[hour]) acc[hour] = []
            acc[hour].push(slot)
            return acc
        },
        {} as Record<string, TimeSlot[]>,
    )

    // Ordenar las horas correctamente
    const sortedHours = Object.keys(slotsByHour).sort((a, b) => {
        return Number.parseInt(a) - Number.parseInt(b)
    })

    // Función para obtener el período del día (mañana, tarde, noche)
    const getDayPeriod = (hour: number): string => {
        if (hour >= 6 && hour < 12) return "Mañana"
        if (hour >= 12 && hour < 18) return "Tarde"
        return "Noche"
    }

    // Agrupar horas por período del día
    const hoursByPeriod: Record<string, string[]> = sortedHours.reduce(
        (acc, hour) => {
            const period = getDayPeriod(Number.parseInt(hour))
            if (!acc[period]) acc[period] = []
            acc[period].push(hour)
            return acc
        },
        {} as Record<string, string[]>,
    )

    // Períodos ordenados
    const orderedPeriods = ["Mañana", "Tarde", "Noche"].filter((period) => hoursByPeriod[period]?.length > 0)

    // Encontrar el período que contiene la hora seleccionada (si hay)
    const getSelectedPeriod = () => {
        if (!selectedSlot) return null
        const hour = Number.parseInt(selectedSlot.split(":")[0])
        return getDayPeriod(hour)
    }

    // Valor por defecto para el acordeón (abrir el período con la hora seleccionada)
    const defaultValue = getSelectedPeriod() || (orderedPeriods.length > 0 ? orderedPeriods[0] : "")

    return (
        <div className={`space-y-1 ${className}`}>
            {sortedHours.length > 0 ? (
                <Accordion type="single" collapsible defaultValue={defaultValue} className="w-full">
                    {orderedPeriods.map((period) => {
                        // Contar el total de plazas disponibles en este período
                        const totalPlazas = hoursByPeriod[period].reduce((total, hour) => {
                            return total + slotsByHour[hour].reduce((sum, slot) => sum + slot.available, 0)
                        }, 0)

                        // Verificar si hay una hora seleccionada en este período
                        const hasSelectedSlot = selectedSlot && getDayPeriod(Number.parseInt(selectedSlot.split(":")[0])) === period

                        return (
                            <AccordionItem key={period} value={period} className="border-b">
                                <AccordionTrigger className="py-1.5 hover:no-underline">
                                    <div className="flex justify-between items-center w-full pr-2">
                                        <span className="text-sm font-medium">{period}</span>
                                        <div className="flex items-center gap-2">
                                            {hasSelectedSlot && (
                                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                    Seleccionado
                                                </span>
                                            )}
                                            <span className="text-xs text-muted-foreground">
                                                {totalPlazas} {totalPlazas === 1 ? "plaza" : "plazas"}
                                            </span>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-2 pt-1">
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                                        {hoursByPeriod[period].map((hour) =>
                                            slotsByHour[hour].map((slot) => (
                                                <Button
                                                    key={slot.startTime}
                                                    type="button"
                                                    variant={selectedSlot === slot.startTime ? "default" : "outline"}
                                                    size="sm"
                                                    className={`h-auto py-1 px-1.5 flex flex-col items-center justify-center gap-0.5 transition-all ${selectedSlot === slot.startTime ? "ring-1 ring-primary" : ""
                                                        }`}
                                                    onClick={() => {
                                                        setSelectedSlot(slot.startTime)
                                                        onSelectSlot(slot.startTime, slot.endTime)
                                                    }}
                                                >
                                                    <span className="text-sm font-medium">{slot.startTime}</span>
                                                    <span
                                                        className={`text-xs ${selectedSlot === slot.startTime ? "text-primary-foreground" : "text-muted-foreground"
                                                            }`}
                                                    >
                                                        {slot.available}{" "}
                                                        <span className="lowercase">{slot.available === 1 ? "plaza" : "plazas"}</span>
                                                    </span>
                                                </Button>
                                            )),
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
            ) : (
                <div className="text-center py-3 bg-muted/30 rounded-lg border border-dashed">
                    <p className="text-muted-foreground text-sm">No hay horarios disponibles para esta fecha.</p>
                </div>
            )}
        </div>
    )
}

