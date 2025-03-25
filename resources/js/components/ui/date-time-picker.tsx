import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

import { AvailableTimeSlots } from '@/components/appointments/AvailableTimeSlots';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAvailableSlots } from '@/hooks/use-available-slots';
import { cn } from '@/lib/utils';
import { formatForDisplay } from '@/utils/date-utils';

import type { CalendarConfig, SpecialDate } from '@/types/calendar';
import { isDateAvailable } from '@/utils/appointment-validations';

interface DateTimePickerProps {
    date: Date;
    onDateChange: (date: Date) => void;
    onTimeChange: (date: Date) => void;
    disabledDates?: (date: Date) => boolean;
    className?: string;
    userId: string;
    config: CalendarConfig;
    specialDates: SpecialDate[];
    slotUrl?: string;
    label?: string;
}

export function DateTimePicker({
    date,
    onDateChange,
    onTimeChange,
    disabledDates,
    className,
    userId,
    config,
    specialDates,
    label = 'Fecha y hora',
}: DateTimePickerProps) {
    const [activeTab, setActiveTab] = useState<'date' | 'time'>('date');
    const { availableSlots, loading, loadAvailableSlots } = useAvailableSlots(userId);

    // Manejar la carga de slots disponibles cuando cambia la fecha
    useEffect(() => {
        if (date) {
            loadAvailableSlots(date);
        }
    }, [date]);

    // Validar fecha con config y fechas especiales
    const customDisabledDates = (date: Date): boolean => {
        if (disabledDates && disabledDates(date)) {
            return true;
        }

        const result = isDateAvailable(date, config, specialDates);
        return !result.isAvailable;
    };

    // Manejar la selección de un slot de tiempo
    const handleSlotSelect = (startTime: string, endTime: string) => {
        const [startHour, startMinute] = startTime.split(':').map((n) => parseInt(n));
        const newDate = new Date(date);
        newDate.setHours(startHour, startMinute, 0, 0);

        onTimeChange(newDate);
        setActiveTab('date');
    };

    // Formatear para mostrar fecha y hora
    const getFormattedDateTime = () => {
        if (!date) return 'Seleccionar fecha y hora';

        return `${formatForDisplay(date)} - ${format(date, 'HH:mm')}`;
    };

    return (
        <div className={cn('grid w-full items-center gap-1.5 overflow-auto', className)}>
            {label && <Label htmlFor="date-time">{label}</Label>}
            <span className="text-muted-foreground text-xs">Selecciona una fecha y una hora dando clic en la fecha</span>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date-time"
                        variant="outline"
                        className={cn('w-full justify-start text-left text-xs font-normal', !date && 'text-muted-foreground')}
                    >
                        <CalendarIcon className="mr-2 h-2 w-2" />
                        {getFormattedDateTime()}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="my-0 w-full p-0" // Limitar el ancho máximo
                    align="start"
                    side="bottom"
                    sideOffset={4}
                    alignOffset={0}
                    avoidCollisions={false}
                    collisionPadding={5}
                    sticky="always"
                >
                    <Tabs defaultValue="date" value={activeTab} onValueChange={(v) => setActiveTab(v as 'date' | 'time')}>
                        <div className="mt-0 h-full gap-0">
                            <div className="flex items-center p-3 pb-0">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="date" className="flex items-center gap-2">
                                        <CalendarIcon className="h-3 w-3" />
                                        <span>Fecha</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="time" className="flex items-center gap-2">
                                        <Clock className="h-3 w-3" />
                                        <span>Hora</span>
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="date" className="p-0">
                                <Card className="border-0">
                                    <CardContent className="my-[-2.5rem] p-2">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={(newDate) => {
                                                if (newDate) {
                                                    const updatedDate = new Date(newDate);
                                                    // Mantener la hora actual al cambiar la fecha
                                                    if (date) {
                                                        updatedDate.setHours(date.getHours(), date.getMinutes(), 0, 0);
                                                    }
                                                    onDateChange(updatedDate);
                                                    setActiveTab('time');
                                                }
                                            }}
                                            disabled={customDisabledDates}
                                            locale={es}
                                            weekStartsOn={0}
                                            className="scale-95"
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="time" className="p-0">
                                <Card className="border-0">
                                    <CardContent className="p-3 pt-0">
                                        {loading ? (
                                            <div className="flex justify-center py-8">
                                                <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2"></div>
                                            </div>
                                        ) : (
                                            <AvailableTimeSlots
                                                date={date}
                                                onSelectSlot={handleSlotSelect}
                                                availableSlots={availableSlots}
                                                className="mt-1"
                                            />
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div>
                    </Tabs>
                    <div className="text-muted-foreground border-t p-2 text-xs">
                        Horario de atención: {config.start_time} - {config.end_time}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
