"use client"

import { useState } from "react"
import { Search, Info, Edit, Plus, Trash2, PlusCircle } from "lucide-react"
import DetallesCliente from "./clientes-details"
import { NoData } from "../no-data"
import type { Cliente } from "@/types/clients"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ConfirmDeleteDialog from "../confirm-dialog"
import { toast } from "sonner"
import { Appointment } from "@/types/events"
import { AppointmentDialog } from "../calendar/appointment-dialog"

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
    const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [showFinalDeleteConfirmation, setShowFinalDeleteConfirmation] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
    const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false)
    const [isCreatingAppointment, setIsCreatingAppointment] = useState(false)
    const [isViewDetails, setIsViewDetails] = useState(false)
    const filteredClientes = clientes.filter(
        (cliente) =>
            cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const openModal = (cliente: Cliente) => {
        setSelectedCliente(cliente)
        setIsEditing(false)
        setIsViewDetails(true)
        setIsCreatingAppointment(false) // Asegúrate de que el diálogo de cita esté cerrado
    }

    const closeModal = () => {
        setSelectedCliente(null)
        setIsEditing(false)
        setIsViewDetails(false)
        setIsCreatingAppointment(false)
    }

    const handleEdit = (cliente: Cliente) => {
        setSelectedCliente(cliente)
        setIsEditing(true)
        setIsViewDetails(true)
        setIsCreatingAppointment(false) // Asegúrate de que el diálogo de cita esté cerrado
    }

    const handleSave = (updatedCliente: Cliente) => {
        setClientes(clientes.map((c) => (c.id === updatedCliente.id ? updatedCliente : c)))
        setIsEditing(false)
        setIsViewDetails(false)
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
        setIsViewDetails(false) // Asegúrate de que el diálogo de detalles esté cerrado
    }

    const handleCreateSave = (newCliente: Cliente) => {
        setClientes([...clientes, newCliente])
        setIsCreating(false)
        setSelectedCliente(null)
        toast.success("Cliente creado", {
            description: `El cliente "${newCliente.nombre}" ha sido creado correctamente.`,
            duration: 3000,
        })
    }

    const handleCancel = () => {
        setIsCreating(false)
        setSelectedCliente(null)
        setIsEditing(false)
        setIsViewDetails(false)
        setIsCreatingAppointment(false)
    }

    const handleDeleteClick = (cliente: Cliente) => {
        setClienteToDelete(cliente)
        setShowDeleteConfirmation(true)
    }

    const handleDeleteConfirm = () => {
        setShowDeleteConfirmation(false)
        setShowFinalDeleteConfirmation(true)
    }

    const handleFinalDeleteConfirm = () => {
        if (clienteToDelete) {
            setClientes(clientes.filter((c) => c.id !== clienteToDelete.id))
            setClienteToDelete(null)
        }
        setShowFinalDeleteConfirmation(false)
        toast.success("Cliente eliminado", {
            description: `El cliente ha sido eliminado correctamente.`,
            duration: 3000,
        })
    }

    const handleDeleteCancel = () => {
        setClienteToDelete(null)
        setShowDeleteConfirmation(false)
        setShowFinalDeleteConfirmation(false)
    }

    const handleDeleteCita = (clienteId: string, citaId: string) => {
        const updatedClientes = clientes.map((cliente) => {
            if (cliente.id === clienteId) {
                return {
                    ...cliente,
                    citas: cliente.citas.filter((cita) => cita.id !== citaId),
                }
            }
            return cliente
        })
        setClientes(updatedClientes)

        // Actualizar el cliente seleccionado si está abierto
        if (selectedCliente && selectedCliente.id === clienteId) {
            const updatedCliente = updatedClientes.find((c) => c.id === clienteId)
            if (updatedCliente) {
                setSelectedCliente(updatedCliente)
            }
        }
    }

    const handleSaveAppointment = (appointment: Appointment) => {
        // Lógica para guardar la cita
        console.log("Cita guardada:", appointment)
        setIsAppointmentDialogOpen(false)
        setIsCreatingAppointment(false)
        setIsViewDetails(false) // Asegúrate de que el diálogo de detalles no se abra después de cerrar el diálogo de citas
    }

    return (
        <Card className="container mx-auto p-3 border-0 shadow-none ">
            <CardHeader className="pb-0">
                <CardTitle className="text-3xl font-bold">Clientes</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative flex-grow w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            type="text"
                            placeholder="Buscar por nombre o ID..."
                            className="w-full pl-10"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleCreate} className="w-full sm:w-auto" variant="default">
                        <Plus size={18} className="mr-2" />
                        Nuevo Cliente
                    </Button>
                </div>

                {clientes.length === 0 ? (
                    <NoData />
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/12">ID</TableHead>
                                    <TableHead className="w-3/12">Nombre</TableHead>
                                    <TableHead className="w-2/12">Contacto</TableHead>
                                    <TableHead className="w-3/12">Correo</TableHead>
                                    <TableHead className="w-3/12">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClientes.map((cliente) => (
                                    <TableRow key={cliente.id}>
                                        <TableCell className="w-1/12 font-medium">{cliente.id}</TableCell>
                                        <TableCell className="w-3/12">{cliente.nombre}</TableCell>
                                        <TableCell className="w-2/12">{cliente.contacto}</TableCell>
                                        <TableCell className="w-3/12">{cliente.correo}</TableCell>
                                        <TableCell className="w-3/12 p-2">
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-primary hover:text-primary/80 hover:bg-primary/10 justify-start"
                                                    onClick={() => openModal(cliente)}
                                                >
                                                    <Info size={16} className="mr-1" /> Detalles
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-primary hover:text-primary/80 hover:bg-primary/10 justify-start"
                                                    onClick={() => handleEdit(cliente)}
                                                >
                                                    <Edit size={16} className="mr-1" /> Editar
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/20 justify-start"
                                                    onClick={() => handleDeleteClick(cliente)}
                                                >
                                                    <Trash2 size={16} className="mr-1" /> Eliminar
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-green-600 hover:text-green-600/80 hover:bg-green-700/10 justify-start"
                                                    onClick={() => {
                                                        setSelectedCliente(cliente)
                                                        setIsCreatingAppointment(true)
                                                        setSelectedDate(new Date())
                                                        setSelectedAppointment(null)
                                                        setIsAppointmentDialogOpen(true)
                                                        setIsViewDetails(false) // Asegúrate de que el diálogo de detalles esté cerrado
                                                    }}
                                                >
                                                    <PlusCircle size={16} className="mr-1" /> Cita
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {selectedCliente && (isViewDetails || isCreating) && (
                    <DetallesCliente
                        cliente={selectedCliente!}
                        onClose={closeModal}
                        isEditing={isEditing}
                        onSave={handleSave}
                        isCreating={isCreating}
                        onCreateSave={handleCreateSave}
                        onCancel={handleCancel}
                        onDeleteCita={handleDeleteCita}
                    />
                )}

                <ConfirmDeleteDialog
                    open={showDeleteConfirmation}
                    onOpenChange={setShowDeleteConfirmation}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                    displayMessage={`al cliente ${clienteToDelete?.nombre} y todos sus datos`}
                />

                <ConfirmDeleteDialog
                    open={showFinalDeleteConfirmation}
                    onOpenChange={setShowFinalDeleteConfirmation}
                    onConfirm={handleFinalDeleteConfirm}
                    onCancel={handleDeleteCancel}
                    displayMessage={`al cliente ${clienteToDelete?.nombre}`}
                    finalConfirmation={true}
                />
            </CardContent>
            {/* Diálogo para crear/editar citas */}
            {selectedCliente && isCreatingAppointment && (
                <AppointmentDialog
                    isOpen={isAppointmentDialogOpen}
                    onClose={() => { setIsAppointmentDialogOpen(false); setIsCreatingAppointment(false) }}
                    onSave={handleSaveAppointment}
                    appointment={selectedAppointment}
                    selectedDate={selectedDate}
                    clientId={selectedCliente.id}
                    clientName={selectedCliente.nombre}
                    clientPhone={selectedCliente.contacto.toString()}
                    clientEmail={selectedCliente.correo}
                />
            )}
        </Card>
    )
}