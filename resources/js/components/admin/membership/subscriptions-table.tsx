import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreHorizontal, Eye, Edit, RefreshCw, Ban } from "lucide-react"

// Datos de ejemplo
const subscriptions = [
    {
        id: "SUB-001",
        user: {
            name: "Juan Pérez",
            email: "juan@example.com",
            avatar: "JP",
        },
        plan: "Pro",
        status: "active",
        startDate: "2023-05-15T14:23:45Z",
        renewDate: "2023-11-15T14:23:45Z",
        amount: 19.99,
        billingCycle: "monthly",
    },
    {
        id: "SUB-002",
        user: {
            name: "María García",
            email: "maria@example.com",
            avatar: "MG",
        },
        plan: "Basic",
        status: "active",
        startDate: "2023-07-10T12:10:22Z",
        renewDate: "2023-11-10T12:10:22Z",
        amount: 9.99,
        billingCycle: "monthly",
    },
    {
        id: "SUB-003",
        user: {
            name: "Carlos Rodríguez",
            email: "carlos@example.com",
            avatar: "CR",
        },
        plan: "Pro",
        status: "canceled",
        startDate: "2023-03-14T09:45:12Z",
        renewDate: "2023-10-14T09:45:12Z",
        amount: 19.99,
        billingCycle: "monthly",
    },
    {
        id: "SUB-004",
        user: {
            name: "Ana Martínez",
            email: "ana@example.com",
            avatar: "AM",
        },
        plan: "Enterprise",
        status: "active",
        startDate: "2023-01-20T08:30:55Z",
        renewDate: "2024-01-20T08:30:55Z",
        amount: 199.99,
        billingCycle: "yearly",
    },
    {
        id: "SUB-005",
        user: {
            name: "Roberto Sánchez",
            email: "roberto@example.com",
            avatar: "RS",
        },
        plan: "Basic",
        status: "past_due",
        startDate: "2023-08-05T16:42:30Z",
        renewDate: "2023-11-05T16:42:30Z",
        amount: 9.99,
        billingCycle: "monthly",
    },
]

export function SubscriptionsTable() {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return (
                    <Badge variant="outline" className="bg-emerald-50 border-emerald-500 text-emerald-700">
                        Activa
                    </Badge>
                )
            case "canceled":
                return (
                    <Badge variant="outline" className="bg-slate-100 border-slate-500 text-slate-700">
                        Cancelada
                    </Badge>
                )
            case "past_due":
                return (
                    <Badge variant="outline" className="bg-amber-50 border-amber-500 text-amber-700">
                        Pago pendiente
                    </Badge>
                )
            default:
                return <Badge variant="outline">Desconocido</Badge>
        }
    }

    const getPlanBadge = (plan: string) => {
        switch (plan) {
            case "Enterprise":
                return <Badge className="bg-purple-100 hover:bg-purple-100 text-purple-800 border-purple-300">Enterprise</Badge>
            case "Pro":
                return <Badge className="bg-blue-100 hover:bg-blue-100 text-blue-800 border-blue-300">Pro</Badge>
            case "Basic":
                return <Badge className="bg-gray-100 hover:bg-gray-100 text-gray-800 border-gray-300">Basic</Badge>
            default:
                return <Badge variant="outline">Free</Badge>
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(date)
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR",
        }).format(amount)
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[250px]">Usuario</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Inicio</TableHead>
                    <TableHead>Renovación</TableHead>
                    <TableHead>Ciclo</TableHead>
                    <TableHead className="text-right">Importe</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {subscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback>{subscription.user.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">{subscription.user.name}</div>
                                    <div className="text-xs text-muted-foreground">{subscription.user.email}</div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>{getPlanBadge(subscription.plan)}</TableCell>
                        <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                        <TableCell>{formatDate(subscription.startDate)}</TableCell>
                        <TableCell>{formatDate(subscription.renewDate)}</TableCell>
                        <TableCell>{subscription.billingCycle === "monthly" ? "Mensual" : "Anual"}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(subscription.amount)}</TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Abrir menú</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Eye className="h-4 w-4 mr-2" />
                                        Ver detalles
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Cambiar plan
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Renovar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Ban className="h-4 w-4 mr-2" />
                                        Cancelar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

