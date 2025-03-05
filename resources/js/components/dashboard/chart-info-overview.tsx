import { Button } from "../ui/button";
import { Card } from "../ui/card";
import StatsChart from "./stats-chart";

export default function ChartOverview() {
    const timeFilters = ["Hoy", "Semana Anterior", "Mes Anterior", "Últimos 6 Meses", "Anual"]

    return (
        <Card className="h-full w-full">
            <div className="mb-4 flex items-center justify-between mx-10">
                <h2 className="text-lg font-semibold">Estadisticas Generales de Citas</h2>
                <div className="flex gap-2">
                    {timeFilters.map((filter) => (
                        <Button key={filter} size="sm" variant="ghost">
                            {filter}
                        </Button>
                    ))}
                </div>
            </div>
            <StatsChart />
        </Card>
    )
}