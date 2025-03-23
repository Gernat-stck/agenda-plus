import type React from "react"
import { Edit, Trash } from "lucide-react"
import type { Servicio } from "@/types/services"
import { Button } from "../ui/button"
import { DataTable, Column } from "../shared/data-table"

interface TablaServiciosProps {
    servicios: Servicio[]
    onEdit: (servicio: Servicio) => void
    onDelete: (id: string) => void
}

export const TablaServicios: React.FC<TablaServiciosProps> = ({ 
    servicios, 
    onEdit, 
    onDelete 
}) => {
    
    // Definir las columnas para la tabla de servicios
    const columns: Column<Servicio>[] = [
        {
            key: "service_id",
            header: "ID",
            cell: (servicio) => servicio.service_id
        },
        {
            key: "name",
            header: "Título",
            cell: (servicio) => servicio.name
        },
        {
            key: "description",
            header: "Descripción",
            cell: (servicio) => servicio.description
        },
        {
            key: "price",
            header: "Precio",
            cell: (servicio) => `$${servicio.price}`
        },
        {
            key: "duration",
            header: "Duración",
            cell: (servicio) => `${servicio.duration} min`
        },
        {
            key: "category",
            header: "Categoría",
            cell: (servicio) => servicio.category
        },
        {
            key: "actions",
            header: "Acciones",
            cell: (servicio) => (
                <div className="flex gap-2">
                    <Button
                        onClick={() => onEdit(servicio)}
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80 hover:bg-primary/10 justify-start"
                    >
                        <Edit size={18} /> Editar
                    </Button>
                    <Button
                        onClick={() => onDelete(servicio.service_id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600/80 hover:bg-red-700/10 justify-start"
                    >
                        <Trash size={18} /> Eliminar
                    </Button>
                </div>
            )
        }
    ];

    return (
        <DataTable
            data={servicios}
            columns={columns}
            keyExtractor={(servicio) => servicio.service_id}
            currentPage={1} // Si no hay paginación en servicios, usar valores fijos
            itemsPerPage={servicios.length} // Mostrar todos los servicios
            onPageChange={() => {}} // Función vacía si no hay paginación
        />
    );
};

