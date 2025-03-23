import { useState } from "react"
import type { Cliente, Cita } from "@/types/clients"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DetallesCliente from "./clientes-details"
import ConfirmDeleteDialog from "../shared/confirm-dialog"
import { AppointmentDialog } from "../appointments/appointment-dialog"
import { toast } from "sonner"
import { router } from "@inertiajs/react"
import { category } from "@/types/services"
import { format } from "date-fns"
import { CalendarConfig, SpecialDate } from "@/types/calendar"
import { BusquedaClientes } from "./busqueda-clientes"
import { TablaClientes } from "./tabla-clientes"
import { useConfirmation } from "@/hooks/use-confirmation"

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
    // Estado general
    const [clientes, setClientes] = useState<Cliente[]>(clients)
    const [searchTerm, setSearchTerm] = useState("")

    // Estado para paginación
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    // Estado para modales
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedAppointment, setSelectedAppointment] = useState<Cita | null>(null)
    const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false)
    const [isCreatingAppointment, setIsCreatingAppointment] = useState(false)
    const [isViewDetails, setIsViewDetails] = useState(false)
    const {
        showConfirmation,
        showFinalConfirmation,
        startConfirmation,
        proceedToFinalConfirmation,
        cancelConfirmation
    } = useConfirmation();
    // Filtramos los clientes según la búsqueda
    const filteredClientes = clientes.filter(
        (cliente) =>
            cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.client_id.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Cuando cambia el filtro, reset a la primera página
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    }

    // Handlers
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
        setIsViewDetails(false)
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
        startConfirmation()
    }
    const handleDeleteConfirm = proceedToFinalConfirmation;

    const handleFinalDeleteConfirm = () => {
        if (!clienteToDelete) return toast.error("Error al eliminar el cliente", {
            description: "No se ha seleccionado ningún cliente para eliminar.",
            duration: 3000,
        });

        router.delete((`clients/${clienteToDelete.client_id}`), {
            onSuccess: () => {
                setClientes(clientes.filter((c) => c.client_id !== clienteToDelete.client_id))
                setClienteToDelete(null)
                cancelConfirmation()
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
        cancelConfirmation()
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

    const handleCreateAppointment = (cliente: Cliente) => {
        setSelectedCliente(cliente)
        setIsCreatingAppointment(true)
        setSelectedDate(new Date())
        setSelectedAppointment(null)
        setIsAppointmentDialogOpen(true)
        setIsViewDetails(false)
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
                {/* Componente de búsqueda y botón de crear */}
                <BusquedaClientes
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    onCreateClick={handleCreate}
                />

                {/* Tabla de clientes con paginación */}
                <TablaClientes
                    clientes={filteredClientes}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onViewDetails={openModal}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onCreateAppointment={handleCreateAppointment}
                />

                {/* Modales y diálogos */}
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
                    open={showConfirmation}
                    onOpenChange={startConfirmation}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                    displayMessage="este cliente"
                />

                <ConfirmDeleteDialog
                    open={showFinalConfirmation}
                    onOpenChange={cancelConfirmation}
                    onConfirm={handleFinalDeleteConfirm}
                    onCancel={handleDeleteCancel}
                    displayMessage="este cliente"
                    finalConfirmation={true}
                />

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
            </CardContent>
        </Card>
    )
}