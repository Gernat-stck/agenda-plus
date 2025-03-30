import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
interface CitaOverviewProps {
    appointments: number;
    tomorrowAppointments: number;
}
export default function CitaOverview(AppointmentsStats: CitaOverviewProps) {
    const tomorrowAppointments = AppointmentsStats.appointments - AppointmentsStats.tomorrowAppointments;
    const tomorrowString = tomorrowAppointments > 0 ? `+ ${tomorrowAppointments}  programadas para mañana` : 'No hay citas programadas para mañana';
    return (
        <Card className="flex h-full w-full flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 md:p-5">
                <CardTitle className="text-lg font-extrabold sm:text-xl md:text-2xl">Citas para Hoy</CardTitle>
                <Clock className="text-muted-foreground mx-2 h-6 w-6 sm:mx-4 sm:h-8 sm:w-8 md:mx-6 md:h-10 md:w-10" />
            </CardHeader>
            <CardContent className="pb-3 sm:pb-4 md:pb-5">
                <div className="text-2xl font-bold sm:text-2xl md:text-3xl">{AppointmentsStats.appointments}</div>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg">{tomorrowString}</p>
            </CardContent>
        </Card>
    );
}
