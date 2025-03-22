import { Button } from "@/components/ui/button"
import { Info, Edit, Trash2, PlusCircle } from "lucide-react"
import type { Cliente } from "@/types/clients"

interface AccionesClienteProps {
    cliente: Cliente
    onViewDetails: (cliente: Cliente) => void
    onEdit: (cliente: Cliente) => void
    onDelete: (cliente: Cliente) => void
    onCreateAppointment: (cliente: Cliente) => void
}

export function AccionesCliente({
    cliente,
    onViewDetails,
    onEdit,
    onDelete,
    onCreateAppointment
}: AccionesClienteProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-2">
            <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80 hover:bg-primary/10 justify-start"
                onClick={() => onViewDetails(cliente)}
            >
                <Info size={16} className="mr-1" /> Detalles
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80 hover:bg-primary/10 justify-start"
                onClick={() => onEdit(cliente)}
            >
                <Edit size={16} className="mr-1" /> Editar
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive/80 hover:bg-destructive/20 justify-start"
                onClick={() => onDelete(cliente)}
            >
                <Trash2 size={16} className="mr-1" /> Eliminar
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="text-green-600 hover:text-green-600/80 hover:bg-green-700/10 justify-start"
                onClick={() => onCreateAppointment(cliente)}
            >
                <PlusCircle size={16} className="mr-1" /> Cita
            </Button>
        </div>
    )
}