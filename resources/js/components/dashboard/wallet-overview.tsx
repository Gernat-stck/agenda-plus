import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"
import { DollarSign } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { useState } from "react"

export default function WalletOverview() {
    const [selectedPeriod, setSelectedPeriod] = useState('Semanal');
    return (
        <Card className="h-full w-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-5">
                <CardTitle className="text-2xl font-extrabold">Cartera</CardTitle>
                <div className="text-muted-foreground mx-6">
                    <Select defaultValue="Semanal" onValueChange={(value) => setSelectedPeriod(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar período" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Diario">Diario</SelectItem>
                            <SelectItem value="Semanal">Semanal</SelectItem>
                            <SelectItem value="Mensual">Mensual</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mt-4 flex items-center justify-between">
                    <DollarSign className="h-5 w-5 -mt-4 text-muted-foreground" />
                    <div className="text-right">
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Ingresos: {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}