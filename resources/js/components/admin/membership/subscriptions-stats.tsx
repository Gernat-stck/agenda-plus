import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownRight, ArrowUpRight, CreditCard, DollarSign, Users, RefreshCw } from "lucide-react"

export function SubscriptionStats() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ingresos Recurrentes</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$12,938.99</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <span className="text-emerald-500 flex items-center">
                            <ArrowUpRight className="h-3 w-3" />
                            +8.2%
                        </span>
                        desde el mes pasado
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Suscripciones Activas</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+2,350</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <span className="text-emerald-500 flex items-center">
                            <ArrowUpRight className="h-3 w-3" />
                            +12.2%
                        </span>
                        desde el mes pasado
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tasa de Renovación</CardTitle>
                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">92.4%</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <span className="text-emerald-500 flex items-center">
                            <ArrowUpRight className="h-3 w-3" />
                            +1.1%
                        </span>
                        desde el mes pasado
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Valor Promedio</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$24.99</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <span className="text-rose-500 flex items-center">
                            <ArrowDownRight className="h-3 w-3" />
                            -0.5%
                        </span>
                        desde el mes pasado
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

