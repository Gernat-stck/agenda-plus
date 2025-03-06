import type React from "react"
import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import type { Cliente } from "@/types/clients"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ConfirmDeleteDialog from "../confirm-dialog"

interface DetallesClienteProps {
    cliente: Cliente
    onClose: () => void
    isEditing: boolean
    onSave: (cliente: Cliente) => void
    isCreating: boolean
    onCreateSave: (cliente: Cliente) => void
    onCancel: () => void
    onDeleteCita: (clienteId: string, citaId: string) => void
}

export default function DetallesCliente({
    cliente,
    onClose,
    isEditing,
    onSave,
    isCreating,
    onCreateSave,
    onCancel,
    onDeleteCita,
}: DetallesClienteProps) {
    const [editedCliente, setEditedCliente] = useState(cliente)
    const [citaToDelete, setCitaToDelete] = useState<string | null>(null)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [showFinalDeleteConfirmation, setShowFinalDeleteConfirmation] = useState(false)

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

    const getBadgeStyles = (estado: string) => {
        switch (estado) {
            case "Programado":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900"
            case "Completado":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900"
            case "Pendiente":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900"
            case "Cancelado":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
        }
    }

    const handleDeleteCitaClick = (citaId: string) => {
        setCitaToDelete(citaId)
        setShowDeleteConfirmation(true)
    }

    const handleDeleteConfirm = () => {
        setShowDeleteConfirmation(false)
        setShowFinalDeleteConfirmation(true)
    }

    const handleFinalDeleteConfirm = () => {
        if (citaToDelete) {
            onDeleteCita(cliente.id, citaToDelete)
            setCitaToDelete(null)
        }
        setShowFinalDeleteConfirmation(false)
    }

    const handleDeleteCancel = () => {
        setCitaToDelete(null)
        setShowDeleteConfirmation(false)
        setShowFinalDeleteConfirmation(false)
    }

    return (
        <>
            <Dialog open={true} onOpenChange={() => onCancel()}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {isCreating ? "Crear Nuevo Cliente" : isEditing ? "Editar Cliente" : "Detalles del Cliente"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="id">ID</Label>
                            <div className="font-medium">{editedCliente.id}</div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre</Label>
                            {isEditing || isCreating ? (
                                <Input id="nombre" name="nombre" value={editedCliente.nombre} onChange={handleInputChange} />
                            ) : (
                                <div className="font-medium">{editedCliente.nombre}</div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contacto">Contacto</Label>
                            {isEditing || isCreating ? (
                                <Input
                                    id="contacto"
                                    name="contacto"
                                    type="number"
                                    value={editedCliente.contacto}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <div className="font-medium">{editedCliente.contacto}</div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="correo">Correo</Label>
                            {isEditing || isCreating ? (
                                <Input
                                    id="correo"
                                    name="correo"
                                    type="email"
                                    value={editedCliente.correo}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <div className="font-medium">{editedCliente.correo}</div>
                            )}
                        </div>
                    </div>

                    {!isCreating && editedCliente.citas && editedCliente.citas.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-medium mb-2">Historial de Citas</h3>
                            <div className="rounded-md border">
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
                                        {editedCliente.citas.map((cita) => (
                                            <TableRow key={cita.id}>
                                                <TableCell className="font-medium">{cita.id}</TableCell>
                                                <TableCell>{cita.fecha}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeStyles(cita.estado)}`}>
                                                        {cita.estado}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="capitalize">{cita.metodoPago}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                                        onClick={() => handleDeleteCitaClick(cita.id)}
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
                    )}

                    <DialogFooter className="mt-4">
                        {isEditing || isCreating ? (
                            <>
                                <Button type="button" variant="destructive" onClick={onCancel}>
                                    Cancelar
                                </Button>
                                <Button type="button" onClick={handleSave}>
                                    {isCreating ? "Crear" : "Guardar"}
                                </Button>
                            </>
                        ) : (
                            <Button type="button" onClick={onClose}>
                                Cerrar
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Primera confirmación para eliminar cita */}
            <ConfirmDeleteDialog
                open={showDeleteConfirmation}
                onOpenChange={setShowDeleteConfirmation}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                displayMessage="esta cita"
            />

            {/* Segunda confirmación para eliminar cita */}
            <ConfirmDeleteDialog
                open={showFinalDeleteConfirmation}
                onOpenChange={setShowFinalDeleteConfirmation}
                onConfirm={handleFinalDeleteConfirm}
                onCancel={handleDeleteCancel}
                displayMessage="esta cita"
                finalConfirmation={true}
            />
        </>
    )
}

