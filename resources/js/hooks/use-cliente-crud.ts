import type { Cita, Cliente } from '@/types/clients';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import { useConfirmation } from './use-confirmation';

export interface UseClienteCrudOptions {
    onSuccess?: () => void;
    reloadOnSuccess?: boolean;
    reloadDelay?: number;
}

export function useClienteCrud(initialClientes: Cliente[], options: UseClienteCrudOptions = {}) {
    const [clientes, setClientes] = useState<Cliente[]>(initialClientes);
    const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);
    const [citaToDelete, setCitaToDelete] = useState<{ clienteId: string; citaId: string } | null>(null);

    // Estado para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // Opciones con valores por defecto
    const { onSuccess = () => {}, reloadOnSuccess = true, reloadDelay = 3000 } = options;

    // Integración con el hook de confirmación
    const confirmationHook = useConfirmation();
    const { startConfirmation, proceedToFinalConfirmation, cancelConfirmation } = confirmationHook;

    // Métodos de utilidad
    const handleReloadIfNeeded = () => {
        if (reloadOnSuccess) {
            setTimeout(() => window.location.reload(), reloadDelay);
        }
        onSuccess();
    };

    // CRUD de Clientes
    const handleSave = (updatedCliente: Cliente) => {
        router.patch(
            `clients/${updatedCliente.client_id}`,
            {
                client_id: updatedCliente.client_id,
                name: updatedCliente.name,
                contact_number: updatedCliente.contact_number,
                email: updatedCliente.email,
            },
            {
                onSuccess: () => {
                    setClientes(clientes.map((c) => (c.client_id === updatedCliente.client_id ? updatedCliente : c)));
                    toast.success('Cliente actualizado', {
                        description: `El cliente "${updatedCliente.name}" ha sido actualizado correctamente.`,
                        duration: 3000,
                    });
                    handleReloadIfNeeded();
                },
                onError: (error: any) => {
                    const errorMessage = error.response?.data?.message || 'Error desconocido al actualizar el cliente';
                    toast.error('Error al actualizar el cliente', {
                        description: errorMessage,
                        duration: 3000,
                    });
                },
            },
        );
    };

    const handleCreate = (newCliente: Cliente) => {
        router.post(
            'clients/create',
            {
                client_id: newCliente.client_id,
                name: newCliente.name,
                contact_number: newCliente.contact_number,
                email: newCliente.email,
            },
            {
                onSuccess: () => {
                    setClientes([...clientes, newCliente]);
                    toast.success('Cliente creado', {
                        description: `El cliente "${newCliente.name}" ha sido creado correctamente.`,
                        duration: 3000,
                    });
                    handleReloadIfNeeded();
                },
                onError: (error: any) => {
                    const errorMessage = error.response?.data?.message || 'Error desconocido al crear el cliente';
                    toast.error('Error al crear el cliente', {
                        description: errorMessage,
                        duration: 3000,
                    });
                },
            },
        );
    };

    const initDeleteCliente = (cliente: Cliente) => {
        console.log('initDeleteCliente llamado con:', cliente);
        setClienteToDelete(cliente);
        startConfirmation();
    };

    const handleDeleteCliente = () => {
        console.log('handleDeleteCliente llamado con:', clienteToDelete);

        if (!clienteToDelete) {
            toast.error('Error al eliminar el cliente', {
                description: 'No se ha seleccionado ningún cliente para eliminar.',
                duration: 3000,
            });
            return;
        }

        router.delete(`clients/${clienteToDelete.client_id}`, {
            onSuccess: () => {
                setClientes(clientes.filter((c) => c.client_id !== clienteToDelete.client_id));
                setClienteToDelete(null);
                cancelConfirmation();
                toast.success('Cliente eliminado', {
                    description: 'El cliente ha sido eliminado correctamente.',
                    duration: 3000,
                });
                handleReloadIfNeeded();
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message || 'Error desconocido al eliminar el cliente';
                toast.error('Error al eliminar el cliente', {
                    description: errorMessage,
                    duration: 3000,
                });
                cancelConfirmation();
            },
        });
    };

    // CRUD de Citas
    const initDeleteCita = (clienteId: string, citaId: string) => {
        setCitaToDelete({ clienteId, citaId });
        startConfirmation();
    };

    const handleDeleteCita = () => {
        if (!citaToDelete) {
            toast.error('Error al eliminar la cita', {
                description: 'No se ha seleccionado ninguna cita para eliminar.',
                duration: 3000,
            });
            return;
        }

        const { clienteId, citaId } = citaToDelete;

        router.delete(`appointments/client/${citaId}`, {
            onSuccess: () => {
                const updatedClientes = clientes.map((cliente) => {
                    if (cliente.client_id === clienteId) {
                        return {
                            ...cliente,
                            citas: cliente.citas ? cliente.citas.filter((cita) => cita.appointment_id !== citaId) : [],
                        };
                    }
                    return cliente;
                });

                setClientes(updatedClientes);
                setCitaToDelete(null);
                cancelConfirmation();
                toast.success('Cita eliminada', {
                    description: 'La cita ha sido eliminada correctamente.',
                    duration: 3000,
                });
                handleReloadIfNeeded();
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message || 'Error desconocido al eliminar la cita';
                toast.error('Error al eliminar la cita', {
                    description: errorMessage,
                    duration: 3000,
                });
                cancelConfirmation();
            },
        });
    };

    const createAppointment = (appointment: Cita, clienteId: string) => {
        if (!appointment || !appointment.start_time || !appointment.end_time) {
            toast.error('Error al guardar la cita', {
                description: 'Datos de cita incompletos. Por favor verifica la información.',
                duration: 3000,
            });
            return;
        }

        const formattedStartTime = format(appointment.start_time, 'yyyy-MM-dd HH:mm:ss');
        const formattedEndTime = format(appointment.end_time, 'yyyy-MM-dd HH:mm:ss');

        router.post(
            'appointments/client',
            {
                client_id: clienteId,
                appointment_id: appointment.appointment_id,
                service_id: appointment.service_id,
                title: appointment.title,
                start_time: formattedStartTime,
                end_time: formattedEndTime,
                status: appointment.status,
                payment_type: appointment.payment_type,
            },
            {
                onSuccess: () => {
                    toast.success('Cita guardada', {
                        description: 'La cita ha sido guardada correctamente.',
                        duration: 3000,
                    });
                    handleReloadIfNeeded();
                },
                onError: (error: any) => {
                    const errorMessage = error.response?.data?.message || 'Error desconocido al guardar la cita';
                    toast.error('Error al guardar la cita', {
                        description: errorMessage,
                        duration: 3000,
                    });
                },
            },
        );
    };

    // Filtrado de clientes
    const filteredClientes = clientes.filter(
        (cliente) =>
            cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) || cliente.client_id.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Actualizar la búsqueda
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    // Generar un ID para un nuevo cliente
    const generateClientId = () => {
        return `CLI${(clientes.length + 1).toString().padStart(3, '0')}`;
    };

    return {
        // Estados
        clientes,
        filteredClientes,
        currentPage,
        searchTerm,
        clienteToDelete,
        citaToDelete,
        // Modificadores de estado
        setClientes,
        setCurrentPage,
        // Operaciones CRUD de clientes
        handleSave,
        handleCreate,
        initDeleteCliente,
        handleDeleteCliente,
        // Operaciones CRUD de citas
        initDeleteCita,
        handleDeleteCita,
        createAppointment,
        // Utilidades
        handleSearchChange,
        generateClientId,
        // Hook de confirmación
        ...confirmationHook,
    };
}
