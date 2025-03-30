import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import StatsChart from "./stats-chart";
import { parseISO, isAfter, subDays, subMonths, startOfDay, endOfDay, format } from "date-fns";
import { es } from "date-fns/locale";

interface ChartData {
    monthly: { date: string; value: number }[];
    weekly: { date: string; value: number }[];
    daily: { date: string; value: number }[];
}

interface ChartOverviewProps {
    chartData: ChartData;
}

export default function ChartOverview({ chartData }: ChartOverviewProps) {
    const timeFilters = ["Semana Anterior", "Mes Anterior", "Últimos 6 Meses", "Anual"];
    const [selectedFilter, setSelectedFilter] = useState("Anual");

    // Obtener los datos según el filtro seleccionado
    const getFilteredData = () => {
        // Si no hay datos, devolver array vacío
        if (!chartData) {
            return [];
        }

        switch (selectedFilter) {
            case "Semana Anterior":
                return chartData.daily || [];

            case "Mes Anterior":
                return chartData.weekly || [];

            case "Últimos 6 Meses":
                // Usar solo los últimos 6 meses
                const sixMonthsData = [...chartData.monthly || []];
                return sixMonthsData.slice(-6);

            case "Anual":
            default:
                return chartData.monthly || [];
        }
    };

    return (
        <Card className="h-full w-full">
            <div className="mb-4 flex items-center justify-between mx-10">
                <h2 className="text-lg font-semibold">Estadísticas Generales de Citas</h2>
                <div className="flex gap-2">
                    {timeFilters.map((filter) => (
                        <Button
                            key={filter}
                            size="sm"
                            variant={selectedFilter === filter ? "default" : "ghost"}
                            onClick={() => setSelectedFilter(filter)}
                        >
                            {filter}
                        </Button>
                    ))}
                </div>
            </div>
            <StatsChart data={getFilteredData()} />
        </Card>
    );
}
