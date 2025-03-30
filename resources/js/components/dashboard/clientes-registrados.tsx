import { Users2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ClientesOverviewProps {
    new_clients: number;
    clients_last_week: number;
    total_clients: number;
}
export default function ClientesOverview(clients: ClientesOverviewProps) {
    const clientsLastWeek = clients.new_clients - clients.clients_last_week;
    const clientsString =
        clientsLastWeek > 0
            ? `+ ${clientsLastWeek} nuevos clientes que la semana pasada`
            : `${clientsLastWeek} que la semana pasada` || 'No hay nuevos clientes esta semana pasada';
    return (
        <Card className="flex h-full w-full flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 md:p-5">
                <CardTitle className="text-lg font-extrabold sm:text-xl md:text-2xl">Clientes Registrados</CardTitle>
                <Users2 className="text-muted-foreground mx-2 h-6 w-6 sm:mx-4 sm:h-8 sm:w-8 md:mx-6 md:h-10 md:w-10" />
            </CardHeader>
            <CardContent className="pb-3 sm:pb-4 md:pb-5">
                <div className="text-2xl font-bold sm:text-2xl md:text-3xl">{clients.new_clients}</div>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg">{clientsString}</p>
            </CardContent>
        </Card>
    );
}
