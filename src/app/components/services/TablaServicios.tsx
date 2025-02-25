import type React from "react"
import { Edit, Trash } from "lucide-react"
import type { Servicio } from "@/types/ServicesType"

interface TablaServiciosProps {
    servicios: Servicio[]
    onEdit: (servicio: Servicio) => void
    onDelete: (id: string) => void
}

export const TablaServicios: React.FC<TablaServiciosProps> = ({ servicios, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full min-w-max table-auto text-left">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border-b p-4 font-medium">ID</th>
                        <th className="border-b p-4 font-medium">Título</th>
                        <th className="border-b p-4 font-medium">Descripción</th>
                        <th className="border-b p-4 font-medium">Precio</th>
                        <th className="border-b p-4 font-medium">Duración</th>
                        <th className="border-b p-4 font-medium">Categoría</th>
                        <th className="border-b p-4 font-medium">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {servicios.map((servicio) => (
                        <tr key={servicio.id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="p-4">{servicio.id}</td>
                            <td className="p-4">{servicio.titulo}</td>
                            <td className="p-4">{servicio.descripcion}</td>
                            <td className="p-4">${servicio.precio.toFixed(2)}</td>
                            <td className="p-4">{servicio.duracion} min</td>
                            <td className="p-4">{servicio.categoria}</td>
                            <td className="p-4">
                                <button
                                    onClick={() => onEdit(servicio)}
                                    className="text-blue-600 hover:text-blue-800 transition-colors mr-2"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => onDelete(servicio.id)}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                    <Trash size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

