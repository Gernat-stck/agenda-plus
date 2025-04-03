import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, AlertCircle, AlertTriangle, Info, Eye, CheckCircle, XCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Datos de ejemplo
const errorLogs = [
    {
        id: "ERR-1001",
        message: "Error de conexión a la base de datos",
        timestamp: "2023-10-15T14:23:45Z",
        level: "error",
        source: "api/database.js",
        userId: "user-123",
        resolved: false,
        stack:
            "Error: Database connection failed\n  at connectDB (/api/database.js:45:12)\n  at processRequest (/api/handler.js:23:5)",
    },
    {
        id: "ERR-1002",
        message: "Timeout en solicitud de pago",
        timestamp: "2023-10-15T12:10:22Z",
        level: "warning",
        source: "api/payments.js",
        userId: "user-456",
        resolved: true,
        stack:
            "Error: Payment request timeout\n  at processPayment (/api/payments.js:78:10)\n  at handleCheckout (/api/checkout.js:34:8)",
    },
    {
        id: "ERR-1003",
        message: "Validación de formulario fallida",
        timestamp: "2023-10-14T09:45:12Z",
        level: "info",
        source: "components/Form.jsx",
        userId: "user-789",
        resolved: false,
        stack:
            "Error: Form validation failed\n  at validateForm (/components/Form.jsx:112:8)\n  at submitForm (/components/Form.jsx:145:12)",
    },
    {
        id: "ERR-1004",
        message: "Error de autenticación",
        timestamp: "2023-10-14T08:30:55Z",
        level: "error",
        source: "api/auth.js",
        userId: "user-321",
        resolved: false,
        stack:
            "Error: Authentication failed\n  at verifyToken (/api/auth.js:67:14)\n  at authenticateUser (/api/auth.js:89:10)",
    },
    {
        id: "ERR-1005",
        message: "Límite de API excedido",
        timestamp: "2023-10-13T16:42:30Z",
        level: "warning",
        source: "api/external.js",
        userId: "user-654",
        resolved: true,
        stack:
            "Error: API rate limit exceeded\n  at callExternalAPI (/api/external.js:23:9)\n  at fetchData (/api/external.js:45:12)",
    },
]

export function ErrorLogsTable() {
    const [selectedError, setSelectedError] = useState<any>(null)

    const getLevelIcon = (level: string) => {
        switch (level) {
            case "error":
                return <AlertCircle className="h-4 w-4 text-destructive" />
            case "warning":
                return <AlertTriangle className="h-4 w-4 text-amber-500" />
            case "info":
                return <Info className="h-4 w-4 text-blue-500" />
            default:
                return <Info className="h-4 w-4" />
        }
    }

    const getLevelBadge = (level: string) => {
        switch (level) {
            case "error":
                return <Badge variant="destructive">Error</Badge>
            case "warning":
                return (
                    <Badge variant="outline" className="border-amber-500 text-amber-500">
                        Advertencia
                    </Badge>
                )
            case "info":
                return (
                    <Badge variant="outline" className="border-blue-500 text-blue-500">
                        Info
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

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Nivel</TableHead>
                        <TableHead>Mensaje</TableHead>
                        <TableHead>Origen</TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {errorLogs.map((log) => (
                        <TableRow key={log.id}>
                            <TableCell className="font-medium">{log.id}</TableCell>
                            <TableCell>{getLevelBadge(log.level)}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{log.message}</TableCell>
                            <TableCell className="max-w-[150px] truncate">{log.source}</TableCell>
                            <TableCell>{log.userId}</TableCell>
                            <TableCell>{formatDate(log.timestamp)}</TableCell>
                            <TableCell>
                                {log.resolved ? (
                                    <Badge variant="outline" className="bg-emerald-50 border-emerald-500 text-emerald-700">
                                        Resuelto
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-rose-50 border-rose-500 text-rose-700">
                                        Pendiente
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <Dialog>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Abrir menú</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DialogTrigger asChild>
                                                <DropdownMenuItem onClick={() => setSelectedError(log)}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Ver detalles
                                                </DropdownMenuItem>
                                            </DialogTrigger>
                                            <DropdownMenuItem>
                                                {log.resolved ? (
                                                    <>
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                        Marcar como pendiente
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                        Marcar como resuelto
                                                    </>
                                                )}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <DialogContent className="sm:max-w-[625px]">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2">
                                                {selectedError && getLevelIcon(selectedError.level)}
                                                {selectedError?.id}: {selectedError?.message}
                                            </DialogTitle>
                                        </DialogHeader>
                                        {selectedError && (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Nivel</h4>
                                                        <div>{getLevelBadge(selectedError.level)}</div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Estado</h4>
                                                        <div>
                                                            {selectedError.resolved ? (
                                                                <Badge variant="outline" className="bg-emerald-50 border-emerald-500 text-emerald-700">
                                                                    Resuelto
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="bg-rose-50 border-rose-500 text-rose-700">
                                                                    Pendiente
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Fecha</h4>
                                                        <div>{formatDate(selectedError.timestamp)}</div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Usuario</h4>
                                                        <div>{selectedError.userId}</div>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Origen</h4>
                                                        <div>{selectedError.source}</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Stack Trace</h4>
                                                    <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-[200px]">
                                                        {selectedError.stack}
                                                    </pre>
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline">Exportar</Button>
                                                    {selectedError.resolved ? (
                                                        <Button variant="destructive">Marcar como pendiente</Button>
                                                    ) : (
                                                        <Button variant="default">Marcar como resuelto</Button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

