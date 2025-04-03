import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownRight, ArrowUpRight, CreditCard, DollarSign, Users, ShoppingCart } from "lucide-react"

export function SalesOverview() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 m-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <span className="text-emerald-500 flex items-center">
                            <ArrowUpRight className="h-3 w-3" />
                            +20.1%
                        </span>
                        desde el mes pasado
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ventas</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+12,234</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <span className="text-emerald-500 flex items-center">
                            <ArrowUpRight className="h-3 w-3" />
                            +19%
                        </span>
                        desde el mes pasado
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+573</div>
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
                    <CardTitle className="text-sm font-medium">Valor Promedio</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$59.62</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <span className="text-rose-500 flex items-center">
                            <ArrowDownRight className="h-3 w-3" />
                            -4.5%
                        </span>
                        desde el mes pasado
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

