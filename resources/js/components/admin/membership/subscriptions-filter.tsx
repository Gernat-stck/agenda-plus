import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download } from "lucide-react"

export function SubscriptionFilters() {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Buscar suscripciones..." className="pl-8 w-full md:w-[300px]" />
                </div>
                <Select defaultValue="all-status">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-status">Todos los estados</SelectItem>
                        <SelectItem value="active">Activas</SelectItem>
                        <SelectItem value="canceled">Canceladas</SelectItem>
                        <SelectItem value="past_due">Pago pendiente</SelectItem>
                    </SelectContent>
                </Select>
                <Select defaultValue="all-plans">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Plan" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-plans">Todos los planes</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-2">
                <Select defaultValue="monthly">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Ciclo de facturación" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los ciclos</SelectItem>
                        <SelectItem value="monthly">Mensual</SelectItem>
                        <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="h-9 w-9">
                    <Download className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

