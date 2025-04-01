import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, Edit, Copy, Trash } from "lucide-react"
import { Link } from "@inertiajs/react"
// Datos de ejemplo basados en la interfaz proporcionada
const plans = [
    {
        id: 1,
        badge: { text: "Popular", variant: "primary" as const },
        highlight: true,
        buttonText: "Comenzar ahora",
        buttonVariant: "default" as const,
        title: "Pro",
        description: "Perfecto para negocios en crecimiento",
        price: "19.99",
        period: "mes",
        features: [
            { included: true, text: "Hasta 10 usuarios", icon: "users" },
            { included: true, text: "Soporte prioritario", icon: "headphones" },
            { included: true, text: "Análisis avanzados", icon: "bar-chart" },
            { included: true, text: "Exportación de datos", icon: "download" },
            { included: false, text: "API personalizada", icon: "code" },
        ],
    },
    {
        id: 2,
        highlight: false,
        buttonText: "Contactar ventas",
        buttonVariant: "outline" as const,
        title: "Enterprise",
        description: "Para grandes organizaciones",
        price: "199.99",
        period: "mes",
        features: [
            { included: true, text: "Usuarios ilimitados", icon: "users" },
            { included: true, text: "Soporte 24/7", icon: "headphones" },
            { included: true, text: "Análisis avanzados", icon: "bar-chart" },
            { included: true, text: "Exportación de datos", icon: "download" },
            { included: true, text: "API personalizada", icon: "code" },
            { included: true, text: "Implementación dedicada", icon: "server" },
        ],
    },
    {
        id: 3,
        highlight: false,
        buttonText: "Comenzar gratis",
        buttonVariant: "outline" as const,
        title: "Basic",
        description: "Para individuos y pequeños equipos",
        price: "9.99",
        period: "mes",
        features: [
            { included: true, text: "Hasta 3 usuarios", icon: "users" },
            { included: true, text: "Soporte por email", icon: "mail" },
            { included: true, text: "Análisis básicos", icon: "bar-chart" },
            { included: false, text: "Exportación de datos", icon: "download" },
            { included: false, text: "API personalizada", icon: "code" },
        ],
    },
]

export function PlansTable() {
    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR",
        }).format(Number.parseFloat(amount))
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Destacado</TableHead>
                    <TableHead>Características</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {plans.map((plan) => (
                    <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.id}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                {plan.title}
                                {plan.badge && <Badge variant={plan.badge.variant}>{plan.badge.text}</Badge>}
                            </div>
                        </TableCell>
                        <TableCell>{plan.description}</TableCell>
                        <TableCell>
                            {plan.highlight ? (
                                <Badge variant="outline" className="bg-emerald-50 border-emerald-500 text-emerald-700">
                                    Sí
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="bg-slate-100 border-slate-500 text-slate-700">
                                    No
                                </Badge>
                            )}
                        </TableCell>
                        <TableCell>{plan.features.length} características</TableCell>
                        <TableCell className="text-right font-medium">
                            {formatCurrency(plan.price)}/{plan.period}
                        </TableCell>
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
                                    <Link href={`/admin/plans/${plan.id}/edit`}>
                                        <DropdownMenuItem>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Editar plan
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuItem>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Duplicar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                        <Trash className="h-4 w-4 mr-2" />
                                        Eliminar
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

