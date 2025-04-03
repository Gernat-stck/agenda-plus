import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, Download, Copy } from "lucide-react"

// Datos de ejemplo
const sales = [
    {
        id: "INV-001",
        customer: "Juan Pérez",
        email: "juan@example.com",
        amount: 125.99,
        status: "completed",
        date: "2023-10-15T14:23:45Z",
        items: 3,
    },
    {
        id: "INV-002",
        customer: "María García",
        email: "maria@example.com",
        amount: 59.99,
        status: "processing",
        date: "2023-10-15T12:10:22Z",
        items: 1,
    },
    {
        id: "INV-003",
        customer: "Carlos Rodríguez",
        email: "carlos@example.com",
        amount: 299.5,
        status: "completed",
        date: "2023-10-14T09:45:12Z",
        items: 4,
    },
    {
        id: "INV-004",
        customer: "Ana Martínez",
        email: "ana@example.com",
        amount: 149.99,
        status: "failed",
        date: "2023-10-14T08:30:55Z",
        items: 2,
    },
    {
        id: "INV-005",
        customer: "Roberto Sánchez",
        email: "roberto@example.com",
        amount: 79.99,
        status: "completed",
        date: "2023-10-13T16:42:30Z",
        items: 1,
    },
]

export function SalesTable() {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return (
                    <Badge variant="outline" className="bg-emerald-50 border-emerald-500 text-emerald-700">
                        Completado
                    </Badge>
                )
            case "processing":
                return (
                    <Badge variant="outline" className="bg-blue-50 border-blue-500 text-blue-700">
                        Procesando
                    </Badge>
                )
            case "failed":
                return (
                    <Badge variant="outline" className="bg-rose-50 border-rose-500 text-rose-700">
                        Fallido
                    </Badge>
                )
            default:
                return <Badge variant="outline">Desconocido</Badge>
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
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
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Importe</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sales.map((sale) => (
                    <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.id}</TableCell>
                        <TableCell>
                            <div>{sale.customer}</div>
                            <div className="text-xs text-muted-foreground">{sale.email}</div>
                        </TableCell>
                        <TableCell>{getStatusBadge(sale.status)}</TableCell>
                        <TableCell>{formatDate(sale.date)}</TableCell>
                        <TableCell>{sale.items}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(sale.amount)}</TableCell>
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
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copiar ID
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Download className="h-4 w-4 mr-2" />
                                        Descargar factura
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

