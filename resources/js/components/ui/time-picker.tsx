import { useState, useEffect, useCallback, useRef } from "react"
import { format, parse } from "date-fns"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimePickerProps {
    value: Date
    onChange: (date: Date) => void
    minTime?: string // format: "HH:mm"
    maxTime?: string // format: "HH:mm"
    label?: string
    className?: string
    use12Hours?: boolean // Nueva prop para habilitar formato 12h
}

export function TimePicker({
    value,
    onChange,
    minTime = "07:00",
    maxTime = "20:00",
    label = "Hora",
    className,
    use12Hours = true, // Por defecto usamos formato 12h
}: TimePickerProps) {
    const [hours, setHours] = useState<string[]>([])
    const [minutes, setMinutes] = useState<string[]>([])

    // Variables para formato 12h
    const hour12 = Number(format(value, "h"))
    const ampm = format(value, "a") // "am" o "pm"

    // Estado para controlar la selección de hora y minutos
    const [selectedHour, setSelectedHour] = useState<string>(
        use12Hours ? hour12.toString().padStart(2, "0") : format(value, "HH")
    )
    const [selectedMinute, setSelectedMinute] = useState<string>(format(value, "mm"))
    const [selectedAmPm, setSelectedAmPm] = useState<string>(ampm)

    const prevHourRef = useRef(selectedHour)
    const prevMinuteRef = useRef(selectedMinute)
    const prevAmPmRef = useRef(selectedAmPm)

    // Parse min and max times
    const minTimeParts = minTime.split(":")
    const maxTimeParts = maxTime.split(":")
    const minHour = Number.parseInt(minTimeParts[0], 10)
    const minMinute = Number.parseInt(minTimeParts[1], 10)
    const maxHour = Number.parseInt(maxTimeParts[0], 10)
    const maxMinute = Number.parseInt(maxTimeParts[1], 10)

    // Inicializar correctamente AM/PM
    useEffect(() => {
        // Asegurarnos que el estado de AM/PM refleje correctamente la hora actual
        setSelectedAmPm(format(value, "a"));
    }, [value]);

    // Generate available hours based on constraints
    const generateHours = useCallback(() => {
        const hoursArray: string[] = []

        if (use12Hours) {
            // Formato 12h: 1-12
            const minHour12 = minHour === 0 ? 12 : minHour > 12 ? minHour - 12 : minHour;
            const maxHour12 = maxHour === 0 ? 12 : maxHour > 12 ? maxHour - 12 : maxHour;

            for (let i = 1; i <= 12; i++) {
                hoursArray.push(i.toString().padStart(2, "0"))
            }
        } else {
            // Formato 24h: 0-23
            for (let i = minHour; i <= maxHour; i++) {
                hoursArray.push(i.toString().padStart(2, "0"))
            }
        }
        return hoursArray
    }, [minHour, maxHour, use12Hours])

    // Generate available minutes based on constraints
    const generateMinutes = useCallback(
        (hour: string) => {
            const minutesArray: string[] = []
            let currentHour = Number.parseInt(hour, 10)

            // Convertir hora de 12h a 24h para comparar con restricciones
            if (use12Hours) {
                if (selectedAmPm === "pm" && currentHour < 12) {
                    currentHour += 12
                } else if (selectedAmPm === "am" && currentHour === 12) {
                    currentHour = 0
                }
            }

            let startMinute = 0
            let endMinute = 59

            if (currentHour === minHour) {
                startMinute = minMinute
            }

            if (currentHour === maxHour) {
                endMinute = maxMinute
            }

            for (let i = startMinute; i <= endMinute; i++) {
                minutesArray.push(i.toString().padStart(2, "0"))
            }
            return minutesArray
        },
        [minHour, maxHour, minMinute, maxMinute, selectedAmPm, use12Hours]
    )

    // Initialize hours and minutes
    useEffect(() => {
        setHours(generateHours())
        setMinutes(generateMinutes(selectedHour))
    }, [generateHours, generateMinutes, selectedHour])

    // Verificar si la hora está dentro del rango permitido
    const isTimeInRange = useCallback((hour: number, minute: number) => {
        if (hour < minHour || hour > maxHour) {
            return false;
        }

        if (hour === minHour && minute < minMinute) {
            return false;
        }

        if (hour === maxHour && minute > maxMinute) {
            return false;
        }

        return true;
    }, [minHour, maxHour, minMinute, maxMinute]);

    // Update time when hour, minute or AM/PM changes
    useEffect(() => {
        if (
            selectedHour !== prevHourRef.current ||
            selectedMinute !== prevMinuteRef.current ||
            (use12Hours && selectedAmPm !== prevAmPmRef.current)
        ) {
            const newDate = new Date(value)
            let hourValue = Number.parseInt(selectedHour, 10)

            // Convertir hora de 12h a 24h para JavaScript Date
            if (use12Hours) {
                if (selectedAmPm === "pm" && hourValue < 12) {
                    hourValue += 12
                } else if (selectedAmPm === "am" && hourValue === 12) {
                    hourValue = 0
                }
            }

            const minuteValue = Number.parseInt(selectedMinute, 10);

            // Verificar si está dentro del rango permitido
            if (!isTimeInRange(hourValue, minuteValue)) {
                toast.error(`La hora seleccionada está fuera del rango permitido (${minTime} - ${maxTime})`);

                // Restaurar valores previos
                setSelectedHour(prevHourRef.current);
                setSelectedMinute(prevMinuteRef.current);
                setSelectedAmPm(prevAmPmRef.current);
                return;
            }

            newDate.setHours(hourValue)
            newDate.setMinutes(minuteValue)
            newDate.setSeconds(0)

            // Siempre devolveremos una fecha con la hora en formato 24h
            onChange(newDate)

            prevHourRef.current = selectedHour
            prevMinuteRef.current = selectedMinute
            prevAmPmRef.current = selectedAmPm
        }
    }, [selectedHour, selectedMinute, selectedAmPm, onChange, value, use12Hours, isTimeInRange, minTime, maxTime])

    const handleHourChange = (newHour: string) => {
        setSelectedHour(newHour)
        const newMinutes = generateMinutes(newHour)
        setMinutes(newMinutes)

        // Asegurarse que el minuto seleccionado esté disponible
        if (!newMinutes.includes(selectedMinute)) {
            setSelectedMinute(newMinutes[0])
        }
    }

    const handleAmPmChange = (newAmPm: string) => {
        setSelectedAmPm(newAmPm);

        // Verificar si el cambio de AM/PM afecta el rango permitido
        let hourValue = Number.parseInt(selectedHour, 10);
        if (newAmPm === "pm" && hourValue < 12) {
            hourValue += 12;
        } else if (newAmPm === "am" && hourValue === 12) {
            hourValue = 0;
        }

        const minuteValue = Number.parseInt(selectedMinute, 10);

        if (!isTimeInRange(hourValue, minuteValue)) {
            toast.warning(`Al cambiar a ${newAmPm.toUpperCase()}, la hora queda fuera del rango permitido (${minTime} - ${maxTime})`);
        }
    }

    const getFormatted24HourTime = () => {
        let hourValue = Number.parseInt(selectedHour, 10);

        if (use12Hours) {
            if (selectedAmPm === "pm" && hourValue < 12) {
                hourValue += 12;
            } else if (selectedAmPm === "am" && hourValue === 12) {
                hourValue = 0;
            }
        }

        return `${hourValue.toString().padStart(2, "0")}:${selectedMinute}`;
    }

    return (
        <div className={cn("grid grid-cols-4 items-center gap-4", className)}>
            <Label htmlFor="time-select" className="text-right">
                {label}
            </Label>
            <div className="col-span-3 flex items-center">
                <div className="flex items-center">
                    <Select value={selectedHour} onValueChange={handleHourChange}>
                        <SelectTrigger className="w-16">
                            <SelectValue placeholder={selectedHour} />
                        </SelectTrigger>
                        <SelectContent className="max-h-52 overflow-y-auto">
                            {hours.map((hour) => (
                                <SelectItem key={hour} value={hour}>
                                    {hour}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="px-1 h-10 flex items-center bg-background-transparent">:</div>

                    <Select value={selectedMinute} onValueChange={setSelectedMinute}>
                        <SelectTrigger className="w-16">
                            <SelectValue placeholder={selectedMinute} />
                        </SelectTrigger>
                        <SelectContent className="max-h-52 overflow-y-auto">
                            {minutes.map((minute) => (
                                <SelectItem key={minute} value={minute}>
                                    {minute}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Selector AM/PM para formato 12h */}
                    {use12Hours && (
                        <Select value={selectedAmPm} onValueChange={handleAmPmChange}>
                            <SelectTrigger className="w-20 ml-2">
                                <SelectValue placeholder={selectedAmPm.toUpperCase()} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="am">AM</SelectItem>
                                <SelectItem value="pm">PM</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                </div>

                <div className="ml-3 text-xs text-muted-foreground">
                    Entre {minTime} - {maxTime}
                    <span className="ml-2 text-xs text-muted-foreground hidden">
                        (24h: {getFormatted24HourTime()})
                    </span>
                </div>
            </div>
        </div>
    )
}