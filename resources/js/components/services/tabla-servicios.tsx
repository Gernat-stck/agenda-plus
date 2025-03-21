import type React from "react"
import { Edit, Trash } from "lucide-react"
import type { Servicio } from "@/types/services"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"

interface TablaServiciosProps {
    servicios: Servicio[]
    onEdit: (servicio: Servicio) => void
    onDelete: (id: string) => void
}

export const TablaServicios: React.FC<TablaServiciosProps> = ({ servicios, onEdit, onDelete }) => {
    return (
        <>
            <div className="rounded-md border">
                <Table>

                    <TableHeader>
                        <TableRow>
                            <TableHead className="border-b p-4 font-medium">ID</TableHead>
                            <TableHead className="border-b p-4 font-medium">Título</TableHead>
                            <TableHead className="border-b p-4 font-medium">Descripción</TableHead>
                            <TableHead className="border-b p-4 font-medium">Precio</TableHead>
                            <TableHead className="border-b p-4 font-medium">Duración</TableHead>
                            <TableHead className="border-b p-4 font-medium">Categoría</TableHead>
                            <TableHead className="border-b p-4 font-medium">Acciones</TableHead>
                        </TableRow >
                    </TableHeader>
                    <TableBody>
                        {servicios.map((servicio) => (
                            <TableRow key={servicio.id} className="hover:bg-gray-400/20 dark:hover:bg-gray-400/20">
                                <TableCell className="p-4">{servicio.service_id}</TableCell>
                                <TableCell className="p-4">{servicio.name}</TableCell>
                                <TableCell className="p-4">{servicio.description}</TableCell>
                                <TableCell className="p-4">${servicio.price}</TableCell>
                                <TableCell className="p-4">{servicio.duration} min</TableCell>
                                <TableCell className="p-4">{servicio.category}</TableCell>
                                <TableCell className="p-4">
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
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

