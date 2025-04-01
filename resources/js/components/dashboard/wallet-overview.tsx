import { DollarSign } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface WalletOverviewProps {
    today_revenue: number;
    weekly_revenue: number;
    monthly_revenue: number;
}
export default function WalletOverview(wallet: WalletOverviewProps) {
    const [selectedPeriod, setSelectedPeriod] = useState('Semanal');

    // Función para obtener el valor según el período seleccionado
    const getRevenueByPeriod = () => {
        switch (selectedPeriod) {
            case 'Diario':
                return wallet.today_revenue;
            case 'Semanal':
                return wallet.weekly_revenue;
            case 'Mensual':
                return wallet.monthly_revenue;
            default:
                return wallet.weekly_revenue;
        }
    };

    // Formatear el valor como moneda
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(value);
    };

    return (
        <Card className="flex h-full w-full flex-col">
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
                    <DollarSign className="text-muted-foreground -mt-4 h-5 w-5" />
                    <div className="text-right">
                        <div className="text-2xl font-bold">{formatCurrency(getRevenueByPeriod())}</div>
                        <p className="text-muted-foreground text-xs">Ingresos: {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
