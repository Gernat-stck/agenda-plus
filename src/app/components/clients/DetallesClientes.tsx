"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Cliente } from "./ListaClientes"

interface DetallesClienteProps {
    cliente: Cliente
    onClose: () => void
    isEditing: boolean
    onSave: (cliente: Cliente) => void
    isCreating: boolean
    onCreateSave: (cliente: Cliente) => void
}

export default function DetallesCliente({
    cliente,
    onClose,
    isEditing,
    onSave,
    isCreating,
    onCreateSave,
    onCancel,
}: DetallesClienteProps & { onCancel: () => void }) {
    const [editedCliente, setEditedCliente] = useState(cliente)

    useEffect(() => {
        setEditedCliente(cliente)
    }, [cliente])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setEditedCliente((prev) => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        if (isCreating) {
            onCreateSave(editedCliente)
        } else {
            onSave(editedCliente)
        }
    }

    const handleCancel = () => {
        onCancel()
    }

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleCancel()
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={handleOutsideClick}>
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{isCreating ? "Crear Nuevo Cliente" : "Detalles del Cliente"}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="font-semibold">ID:</p>
                        <p>{editedCliente.id}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Nombre:</p>
                        {isEditing || isCreating ? (
                            <input
                                type="text"
                                name="nombre"
                                value={editedCliente.nombre}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        ) : (
                            <p>{editedCliente.nombre}</p>
                        )}
                    </div>
                    <div>
                        <p className="font-semibold">Contacto:</p>
                        {isEditing || isCreating ? (
                            <input
                                type="number"
                                name="contacto"
                                value={editedCliente.contacto}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        ) : (
                            <p>{editedCliente.contacto}</p>
                        )}
                    </div>
                    <div>
                        <p className="font-semibold">Correo:</p>
                        {isEditing || isCreating ? (
                            <input
                                type="email"
                                name="correo"
                                value={editedCliente.correo}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        ) : (
                            <p>{editedCliente.correo}</p>
                        )}
                    </div>
                </div>
                {!isCreating && (
                    <>
                        <h3 className="text-xl font-semibold mb-2">Historial de Citas</h3>
                        <table className="w-full mb-6">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 text-left">ID</th>
                                    <th className="p-2 text-left">Fecha</th>
                                    <th className="p-2 text-left">Estado</th>
                                    <th className="p-2 text-left">Método de Pago</th>
                                </tr>
                            </thead>
                            <tbody>
                                {editedCliente.citas.map((cita) => (
                                    <tr key={cita.id} className="border-b">
                                        <td className="p-2">{cita.id}</td>
                                        <td className="p-2">{cita.fecha}</td>
                                        <td className="p-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${cita.estado === "Programado"
                                                    ? "bg-yellow-200 text-yellow-800"
                                                    : cita.estado === "Completado"
                                                        ? "bg-green-200 text-green-800"
                                                        : cita.estado === "Pendiente"
                                                            ? "bg-blue-200 text-blue-800"
                                                            : "bg-red-200 text-red-800"
                                                    }`}
                                            >
                                                {cita.estado}
                                            </span>
                                        </td>
                                        <td className="p-2 capitalize">{cita.metodoPago}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
                {(isEditing || isCreating) && (
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={handleCancel}
                            className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            {isCreating ? "Crear" : "Guardar"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

