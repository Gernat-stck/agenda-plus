"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { format } from "date-fns"

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
}

export function TimePicker({
    value,
    onChange,
    minTime = "00:00",
    maxTime = "23:59",
    label = "Hora",
    className,
}: TimePickerProps) {
    const [hours, setHours] = useState<string[]>([])
    const [minutes, setMinutes] = useState<string[]>([])
    const [selectedHour, setSelectedHour] = useState<string>(format(value, "HH"))
    const [selectedMinute, setSelectedMinute] = useState<string>(format(value, "mm"))

    const prevHourRef = useRef(selectedHour)
    const prevMinuteRef = useRef(selectedMinute)

    // Parse min and max times
    const minTimeParts = minTime.split(":")
    const maxTimeParts = maxTime.split(":")
    const minHour = Number.parseInt(minTimeParts[0], 10)
    const minMinute = Number.parseInt(minTimeParts[1], 10)
    const maxHour = Number.parseInt(maxTimeParts[0], 10)
    const maxMinute = Number.parseInt(maxTimeParts[1], 10)

    // Generate available hours based on constraints
    const generateHours = useCallback(() => {
        const hoursArray: string[] = []
        for (let i = minHour; i <= maxHour; i++) {
            hoursArray.push(i.toString().padStart(2, "0"))
        }
        return hoursArray
    }, [minHour, maxHour])

    // Generate available minutes based on constraints
    const generateMinutes = useCallback(
        (hour: string) => {
            const minutesArray: string[] = []
            const currentHour = Number.parseInt(hour, 10)

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
        [minHour, maxHour, minMinute, maxMinute],
    )

    // Initialize hours and minutes
    useEffect(() => {
        setHours(generateHours())
        setMinutes(generateMinutes(selectedHour))
    }, [generateHours, generateMinutes, selectedHour])

    // Update time when hour or minute changes
    useEffect(() => {
        if (selectedHour !== prevHourRef.current || selectedMinute !== prevMinuteRef.current) {
            const newDate = new Date(value)
            newDate.setHours(Number.parseInt(selectedHour, 10))
            newDate.setMinutes(Number.parseInt(selectedMinute, 10))
            newDate.setSeconds(0)
            onChange(newDate)

            prevHourRef.current = selectedHour
            prevMinuteRef.current = selectedMinute
        }
    }, [selectedHour, selectedMinute, onChange, value])

    const handleHourChange = (newHour: string) => {
        setSelectedHour(newHour)
        const newMinutes = generateMinutes(newHour)
        setMinutes(newMinutes)
        if (!newMinutes.includes(selectedMinute)) {
            setSelectedMinute(newMinutes[0])
        }
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
                </div>

                <div className="ml-3 text-xs text-muted-foreground">
                    Entre {minTime} - {maxTime}
                </div>
            </div>
        </div>
    )
}

