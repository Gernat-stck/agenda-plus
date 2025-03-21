import { CalendarIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { CalendarConfig, SpecialDate } from "@/types/calendar"

interface AppointmentInfoSidebarProps {
    config: CalendarConfig
    specialDates: SpecialDate[]
}

export function AppointmentInfoSidebar({ config, specialDates }: AppointmentInfoSidebarProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <CalendarIcon className="mr-2 h-5 w-5" />
                        Información
                    </CardTitle>
                    <CardDescription>Detalles sobre el proceso de citas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-medium mb-1">Horario de atención</h3>
                        <p className="text-sm text-muted-foreground">
                            Lunes a Viernes: {config.start_time} - {config.end_time}
                        </p>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="font-medium mb-1">Políticas de cancelación</h3>
                        <p className="text-sm text-muted-foreground">
                            Las citas pueden cancelarse hasta 24 horas antes de la hora programada.
                        </p>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="font-medium mb-1">Métodos de pago</h3>
                        <p className="text-sm text-muted-foreground">
                            Aceptamos pagos con tarjeta de crédito/débito y efectivo.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {specialDates.length > 0 && <SpecialDatesList specialDates={specialDates} />}
        </div>
    )
}

// Componente para mostrar fechas especiales
function SpecialDatesList({ specialDates }: { specialDates: SpecialDate[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Fechas especiales</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {specialDates.slice(0, 5).map((date) => (
                        <div
                            key={date.specialdate_id}
                            className={`p-2 rounded-md text-sm ${date.is_available ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"}`}
                        >
                            <div className="font-medium">{date.title}</div>
                            <div className="text-xs">{new Date(date.date).toLocaleDateString("es-ES")}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}