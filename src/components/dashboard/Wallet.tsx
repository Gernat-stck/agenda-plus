import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select } from "../ui/select";
import { DollarSign } from "lucide-react";
import { Button } from "../ui/button";

export default function Wallet() {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Cartera</CardTitle>
                </CardHeader>
                <CardContent>
                    <Select defaultValue="weekly">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar período" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Diario</SelectItem>
                            <SelectItem value="weekly">Semanal</SelectItem>
                            <SelectItem value="monthly">Mensual</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="mt-4 flex items-center justify-between">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <div className="text-right">
                            <div className="text-2xl font-bold">$0</div>
                            <p className="text-xs text-muted-foreground">Ingresos: Semanales</p>
                        </div>
                    </div>
                    <Button variant="outline" className="mt-4 w-full">
                        Ver Citas Agendadas
                    </Button>
                </CardContent>
            </Card></>
    )
}
