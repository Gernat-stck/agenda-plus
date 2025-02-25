"use client"

import { useState } from "react"
import { Search, Info, Edit, Plus } from "lucide-react"
import DetallesCliente from "./DetallesClientes"
import EmptyState from "../EmptyState"

export interface Cita {
    id: string
    fecha: string
    estado: "Programado" | "Completado" | "Pendiente" | "Cancelado"
    metodoPago: "tarjeta" | "efectivo"
}

export interface Cliente {
    id: string
    nombre: string
    contacto: number
    correo: string
    citas: Cita[]
}

const clientesIniciales: Cliente[] = [
    {
        id: "CLI001",
        nombre: "Juan Pérez",
        contacto: 1234567890,
        correo: "juan@example.com",
        citas: [
            { id: "CIT001", fecha: "2023-06-15", estado: "Completado", metodoPago: "tarjeta" },
            { id: "CIT004", fecha: "2023-07-01", estado: "Programado", metodoPago: "efectivo" },
        ],
    },
    {
        id: "CLI002",
        nombre: "María García",
        contacto: 9876543210,
        correo: "maria@example.com",
        citas: [
            { id: "CIT002", fecha: "2023-06-16", estado: "Completado", metodoPago: "efectivo" },
            { id: "CIT005", fecha: "2023-07-02", estado: "Pendiente", metodoPago: "tarjeta" },
        ],
    },
    {
        id: "CLI003",
        nombre: "Carlos Rodríguez",
        contacto: 5555555555,
        correo: "carlos@example.com",
        citas: [
            { id: "CIT003", fecha: "2023-06-17", estado: "Cancelado", metodoPago: "tarjeta" },
            { id: "CIT006", fecha: "2023-07-03", estado: "Programado", metodoPago: "efectivo" },
        ],
    },
]

export default function ListaClientes() {
    const [clientes, setClientes] = useState<Cliente[]>(clientesIniciales)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isCreating, setIsCreating] = useState(false)

    const filteredClientes = clientes.filter(
        (cliente) =>
            cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const openModal = (cliente: Cliente) => {
        setSelectedCliente(cliente)
        setIsEditing(false)
    }

    const closeModal = () => {
        setSelectedCliente(null)
        setIsEditing(false)
    }

    const handleEdit = (cliente: Cliente) => {
        setSelectedCliente(cliente)
        setIsEditing(true)
    }

    const handleSave = (updatedCliente: Cliente) => {
        setClientes(clientes.map((c) => (c.id === updatedCliente.id ? updatedCliente : c)))
        setIsEditing(false)
    }

    const handleCreate = () => {
        setIsCreating(true)
        setSelectedCliente({
            id: `CLI${(clientes.length + 1).toString().padStart(3, "0")}`,
            nombre: "",
            contacto: 0,
            correo: "",
            citas: [],
        })
    }

    const handleCreateSave = (newCliente: Cliente) => {
        setClientes([...clientes, newCliente])
        setIsCreating(false)
        setSelectedCliente(null)
    }

    const handleCancel = () => {
        setIsCreating(false)
        setSelectedCliente(null)
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Lista de Clientes</h1>
            <div className="mb-4 flex items-center">
                <div className="relative flex-grow mr-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o ID..."
                        className="w-full p-2 pl-10 border rounded-md"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                    <Plus size={20} className="inline-block mr-2" />
                    Nuevo Cliente
                </button>
            </div>
            {clientes.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border-b p-4 font-medium">ID</th>
                                <th className="border-b p-4 font-medium">Nombre</th>
                                <th className="border-b p-4 font-medium">Contacto</th>
                                <th className="border-b p-4 font-medium">Correo</th>
                                <th className="border-b p-4 font-medium text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClientes.map((cliente) => (
                                <tr key={cliente.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium">{cliente.id}</td>
                                    <td className="p-4">{cliente.nombre}</td>
                                    <td className="p-4">{cliente.contacto}</td>
                                    <td className="p-4">{cliente.correo}</td>
                                    <td className="p-4 flex mr-0">
                                        <button
                                            className="text-blue-600 hover:text-blue-800 transition-colors mr-4 flex items-center"
                                            onClick={() => openModal(cliente)}
                                        >
                                            <Info size={18} className="mr-1" /> Detalles
                                        </button>
                                        <button
                                            className="text-green-600 hover:text-green-800 transition-colors flex items-center"
                                            onClick={() => handleEdit(cliente)}
                                        >
                                            <Edit size={18} className="mr-1" /> Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {selectedCliente && (
                <DetallesCliente
                    cliente={selectedCliente}
                    onClose={closeModal}
                    isEditing={isEditing}
                    onSave={handleSave}
                    isCreating={isCreating}
                    onCreateSave={handleCreateSave}
                    onCancel={handleCancel}
                />
            )}
        </div>
    )
}

