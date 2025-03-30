import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import type { Cita } from "@/types/clients"

interface HistorialCitasProps {
    citas: Cita[]
    clienteId: string
    onDeleteCita: (clienteId: string, citaId: string, event?: React.MouseEvent) => void
}

export function HistorialCitas({ citas, clienteId, onDeleteCita }: HistorialCitasProps) {
    // Función helper para obtener estilos según estado
    const getBadgeStyles = (estado: string) => {
        switch (estado) {
            case "pendiente":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900"
            case "finalizado":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900"
            case "en curso":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900"
            case "cancelado":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
        }
    }

    if (!citas || citas.length === 0) {
        return null
    }

    return (
        <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Historial de Citas</h3>
            <div className="rounded-md border max-h-[250px] overflow-auto custom-scrollbar">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Método de Pago</TableHead>
                            <TableHead className="w-[80px]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {citas.map((cita) => (
                            <TableRow key={cita.appointment_id}>
                                <TableCell>{cita.appointment_id}</TableCell>
                                <TableCell>{format(new Date(cita.start_time), "dd/MM/yyyy HH:mm")}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeStyles(cita.status)}`}>
                                        {cita.status}
                                    </span>
                                </TableCell>
                                <TableCell className="capitalize">{cita.payment_type}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                        onClick={(e) => onDeleteCita(clienteId, cita.appointment_id, e)}
                                    >
                                        <Trash2 size={16} />
                                        <span className="sr-only">Eliminar cita</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
