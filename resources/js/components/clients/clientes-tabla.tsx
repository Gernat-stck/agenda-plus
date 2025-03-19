import { useState } from "react"
import { Search, Info, Edit, Plus, Trash2, PlusCircle } from "lucide-react"
import DetallesCliente from "./clientes-details"
import { NoData } from "../no-data"
import type { Cliente, Cita } from "@/types/clients"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ConfirmDeleteDialog from "../confirm-dialog"
import { toast } from "sonner"
import { AppointmentDialog } from "../calendar/appointment-dialog"
import { router } from "@inertiajs/react"
import { category } from "@/types/services"
import { format } from "date-fns"
import { CalendarConfig, SpecialDate } from "@/types/calendar"

export default function ListaClientes(
    {
        clients,
        category,
        config,
        specialDates
    }: {
        clients: Cliente[],
        category: category[],
        config: CalendarConfig,
        specialDates: SpecialDate[]
    }) {
    const [clientes, setClientes] = useState<Cliente[]>(clients)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [showFinalDeleteConfirmation, setShowFinalDeleteConfirmation] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedAppointment, setSelectedAppointment] = useState<Cita | null>(null)
    const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false)
    const [isCreatingAppointment, setIsCreatingAppointment] = useState(false)
    const [isViewDetails, setIsViewDetails] = useState(false)
    const filteredClientes = clientes.filter(
        (cliente) =>
            cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.client_id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    const openModal = (cliente: Cliente) => {
        setSelectedCliente(cliente)
        setIsEditing(false)
        setIsViewDetails(true)
        setIsCreatingAppointment(false)
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
        setIsCreatingAppointment(false)
    }

    const handleSave = (updatedCliente: Cliente) => {
        router.patch((`clients/${updatedCliente.client_id}`), {
            client_id: updatedCliente.client_id,
            name: updatedCliente.name,
            contact_number: updatedCliente.contact_number,
            email: updatedCliente.email
        }, {
            onSuccess: () => {
                setClientes(clientes.map((c) => (c.client_id === updatedCliente.client_id ? updatedCliente : c)))
                setIsEditing(false)
                setIsViewDetails(false)
                toast.success("Cliente actualizado", {
                    description: `El cliente "${updatedCliente.name}" ha sido actualizado correctamente.`,
                    duration: 3000,
                })
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message || "Error desconocido al actualizar el cliente";
                toast.error("Error al actualizar el cliente", {
                    description: errorMessage,
                    duration: 3000,
                })
            }
        });
    }

    const handleCreate = () => {
        setIsCreating(true)
        setSelectedCliente({
            client_id: `CLI${(clientes.length + 1).toString().padStart(3, "0")}`,
            name: "",
            contact_number: "",
            email: "",
            citas: [],
        })
        setIsViewDetails(false) // Asegúrate de que el diálogo de detalles esté cerrado
    }

    const handleCreateSave = (newCliente: Cliente) => {
        router.post('clients/create', {
            client_id: newCliente.client_id,
            name: newCliente.name,
            contact_number: newCliente.contact_number,
            email: newCliente.email
        }, {
            onSuccess: () => {
                setClientes([...clientes, newCliente])
                setIsCreating(false)
                setSelectedCliente(null)
                toast.success("Cliente creado", {
                    description: `El cliente "${newCliente.name}" ha sido creado correctamente.`,
                    duration: 3000,
                })
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message || "Error desconocido al crear el cliente";
                toast.error("Error al crear el cliente", {
                    description: errorMessage,
                    duration: 3000,
                })
            }
        });
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
        if (!clienteToDelete) return toast.error("Error al eliminar el cliente", {
            description: "No se ha seleccionado ningún cliente para eliminar.",
            duration: 3000,
        });

        router.delete((`clients/${clienteToDelete.client_id}`), {
            onSuccess: () => {
                setClientes(clientes.filter((c) => c.client_id !== clienteToDelete.client_id))
                setClienteToDelete(null)
                setShowFinalDeleteConfirmation(false)
                toast.success("Cliente eliminado", {
                    description: `El cliente ha sido eliminado correctamente.`,
                    duration: 3000,
                })
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message || "Error desconocido al eliminar el cliente";
                toast.error("Error al eliminar el cliente", {
                    description: errorMessage,
                    duration: 3000,
                })
            }
        });
    }
    const handleDeleteCancel = () => {
        setClienteToDelete(null)
        setShowDeleteConfirmation(false)
        setShowFinalDeleteConfirmation(false)
    }
    const handleDeleteCita = (clienteclient_id: string, citaclient_id: string) => {
        if (!clienteclient_id || !citaclient_id) return toast.error("Error al eliminar la cita", {
            description: "No se ha seleccionado ningún cliente o cita para eliminar.",
            duration: 3000,
        });
        router.delete((`appointments/client/${citaclient_id}`), {
            onSuccess: () => {
                const updatedClientes = clientes.map((cliente) => {
                    if (cliente.client_id === clienteclient_id) {
                        return {
                            ...cliente,
                            citas: cliente.citas ? cliente.citas.filter((cita) => cita.appointment_id !== citaclient_id) : [],
                        }
                    }
                    return cliente
                })
                setClientes(updatedClientes)
                if (selectedCliente && selectedCliente.client_id === clienteclient_id) {
                    const updatedCliente = updatedClientes.find((c) => c.client_id === clienteclient_id)
                    if (updatedCliente) {
                        setSelectedCliente(updatedCliente)
                    }
                }
                toast.success("Cita eliminada", {
                    description: `La cita ha sido eliminada correctamente.`,
                    duration: 3000,
                })
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message || "Error desconocido al eliminar la cita";
                toast.error("Error al eliminar la cita", {
                    description: errorMessage,
                    duration: 3000,
                })
            }
        });
    }

    const handleSaveAppointment = (appointment: Cita) => {
        if (!appointment || !appointment.start_time || !appointment.end_time) {
            toast.error("Error al guardar la cita", {
                description: "Datos de cita incompletos. Por favor verifica la información.",
                duration: 3000,
            });
            return;
        }
        const formattedStartTime = format(appointment.start_time, "yyyy-MM-dd HH:mm:ss");
        const formattedEndTime = format(appointment.end_time, "yyyy-MM-dd HH:mm:ss");
        router.post('appointments/client', {
            client_id: selectedCliente?.client_id,
            appointment_id: appointment.appointment_id,
            service_id: appointment.service_id,
            title: appointment.title,
            start_time: formattedStartTime,
            end_time: formattedEndTime,
            status: appointment.status,
            payment_type: appointment.payment_type
        }, {
            onSuccess: () => {
                setIsAppointmentDialogOpen(false)
                setIsCreatingAppointment(false)
                setIsViewDetails(false)
                toast.success("Cita guardada", {
                    description: `La cita ha sido guardada correctamente.`,
                    duration: 3000,
                })
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message || "Error desconocido al guardar la cita";
                toast.error("Error al guardar la cita", {
                    description: errorMessage,
                    duration: 3000,
                })
            }
        });
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
                            placeholder="Buscar por nombre o ID de cliente..."
                            className="w-full pl-10"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleCreate} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors" variant="default">
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
                                    <TableRow key={cliente.client_id}>
                                        <TableCell className="w-1/12 font-medium">{cliente.client_id}</TableCell>
                                        <TableCell className="w-3/12">{cliente.name}</TableCell>
                                        <TableCell className="w-2/12">{cliente.contact_number}</TableCell>
                                        <TableCell className="w-3/12">{cliente.email}</TableCell>
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
                    displayMessage={`al cliente ${clienteToDelete?.name} y todos sus datos`}
                />

                <ConfirmDeleteDialog
                    open={showFinalDeleteConfirmation}
                    onOpenChange={setShowFinalDeleteConfirmation}
                    onConfirm={handleFinalDeleteConfirm}
                    onCancel={handleDeleteCancel}
                    displayMessage={`al cliente ${clienteToDelete?.name}`}
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
                    clientId={selectedCliente.client_id}
                    clientName={selectedCliente.name}
                    clientPhone={selectedCliente.contact_number.toString()}
                    clientEmail={selectedCliente.email}
                    category={category}
                    config={config}
                    specialDates={specialDates}

                />
            )}
        </Card>
    )
}