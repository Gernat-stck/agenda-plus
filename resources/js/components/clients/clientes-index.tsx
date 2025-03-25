import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClienteCrud } from '@/hooks/use-cliente-crud';
import { CalendarConfig, SpecialDate } from '@/types/calendar';
import type { Cita, Cliente } from '@/types/clients';
import { category } from '@/types/services';
import { PlusCircle, User2Icon } from 'lucide-react';
import { useState } from 'react';
import { AppointmentDialog } from '../appointments/appointment-dialog';
import { EntityForm } from '../shared/clients/entity-form';
import ConfirmDeleteDialog from '../shared/confirm-dialog';
import { NoData } from '../shared/no-data';
import { SearchBar } from '../shared/search-bar';
import { ClienteFormFields } from './clientes-form-field';
import { HistorialCitas } from './historial-citas';
import { TablaClientes } from './tabla-clientes';

export default function ListaClientes({
    clients,
    category,
    config,
    specialDates,
}: {
    clients: Cliente[];
    category: category[];
    config: CalendarConfig;
    specialDates: SpecialDate[];
}) {
    // Usamos el hook personalizado para el CRUD
    const {
        filteredClientes,
        currentPage,
        searchTerm,
        handleSave,
        handleCreate,
        initDeleteCliente,
        handleDeleteCliente,
        initDeleteCita,
        handleDeleteCita,
        createAppointment,
        setCurrentPage,
        handleSearchChange,
        generateClientId,
        showConfirmation,
        showFinalConfirmation,
        proceedToFinalConfirmation,
        cancelConfirmation,
    } = useClienteCrud(clients, {
        reloadOnSuccess: true,
        reloadDelay: 3000,
    });

    // Estados para modales
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Cita | null>(null);
    const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
    const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
    const [isViewDetails, setIsViewDetails] = useState(false);

    // Handlers UI
    const openModal = (cliente: Cliente) => {
        setSelectedCliente(cliente);
        setIsEditing(false);
        setIsViewDetails(true);
        setIsCreatingAppointment(false);
    };

    const closeModal = () => {
        setSelectedCliente(null);
        setIsEditing(false);
        setIsViewDetails(false);
        setIsCreatingAppointment(false);
    };

    const handleEdit = (cliente: Cliente) => {
        setSelectedCliente(cliente);
        setIsEditing(true);
        setIsViewDetails(true);
        setIsCreatingAppointment(false);
    };

    const handleCreateClick = () => {
        setIsCreating(true);
        setSelectedCliente({
            client_id: generateClientId(),
            name: '',
            contact_number: '',
            email: '',
            citas: [],
        });
        setIsViewDetails(false);
    };

    const handleCancel = () => {
        setIsCreating(false);
        setSelectedCliente(null);
        setIsEditing(false);
        setIsViewDetails(false);
        setIsCreatingAppointment(false);
    };

    const handleCreateAppointment = (cliente: Cliente) => {
        setSelectedCliente(cliente);
        setIsCreatingAppointment(true);
        setSelectedDate(new Date());
        setSelectedAppointment(null);
        setIsAppointmentDialogOpen(true);
        setIsViewDetails(false);
    };

    const handleSaveAppointment = (appointment: Cita) => {
        if (selectedCliente) {
            createAppointment(appointment, selectedCliente.client_id);
            setIsAppointmentDialogOpen(false);
            setIsCreatingAppointment(false);
            setIsViewDetails(false);
        }
    };

    // Adaptadores para conectar el UI con el CRUD
    const handleSaveCliente = (updatedCliente: Cliente) => {
        handleSave(updatedCliente);
        setIsEditing(false);
        setIsViewDetails(false);
    };

    const handleCreateSaveCliente = (newCliente: Cliente) => {
        handleCreate(newCliente);
        setIsCreating(false);
        setSelectedCliente(null);
    };

    const handleDeleteClienteClick = (cliente: Cliente) => {
        initDeleteCliente(cliente);
    };

    const handleDeleteCitaClick = (clienteId: string, citaId: string) => {
        initDeleteCita(clienteId, citaId);
    };
    return (
        <Card className="container mx-auto border-0 p-3 shadow-none">
            <CardHeader className="pb-0">
                <CardTitle className="text-3xl font-bold">Clientes</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
                {/* Componente de búsqueda y botón de crear */}
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Buscar por nombre o ID de cliente..."
                    showActionButton={true}
                    actionButtonLabel="Nuevo Cliente"
                    actionButtonIcon={<PlusCircle size={18} />}
                    onActionButtonClick={handleCreateClick}
                />

                {/* Tabla de clientes con paginación */}

                {clients.length === 0 ? (
                    <NoData title="No hay Clientes" description="No se han registrado clientes en el sistema." icon={<User2Icon size={64} />} />
                ) : (
                    <TablaClientes
                        clientes={filteredClientes}
                        currentPage={currentPage}
                        itemsPerPage={6}
                        onPageChange={setCurrentPage}
                        onViewDetails={openModal}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClienteClick}
                        onCreateAppointment={handleCreateAppointment}
                    />
                )}
                {/* Modales y diálogos */}
                {selectedCliente && (isViewDetails || isCreating) && (
                    <EntityForm
                        entity={selectedCliente}
                        entityType="client"
                        fields={ClienteFormFields()}
                        isOpen={true}
                        isCreating={isCreating}
                        readOnly={!isEditing && !isCreating}
                        onOpenChange={() => closeModal()}
                        onSave={isCreating ? handleCreateSaveCliente : handleSaveCliente}
                        onCancel={handleCancel}
                        additionalContent={
                            !isCreating && selectedCliente.citas && selectedCliente.citas.length > 0 ? (
                                <HistorialCitas
                                    citas={selectedCliente.citas}
                                    clienteId={selectedCliente.client_id}
                                    onDeleteCita={(clienteId, citaId) => handleDeleteCitaClick(clienteId, citaId)}
                                />
                            ) : null
                        }
                    />
                )}

                {/* Diálogos de confirmación */}
                <ConfirmDeleteDialog
                    open={showConfirmation}
                    onOpenChange={cancelConfirmation}
                    onConfirm={proceedToFinalConfirmation}
                    onCancel={cancelConfirmation}
                    displayMessage="este cliente"
                />

                <ConfirmDeleteDialog
                    open={showFinalConfirmation}
                    onOpenChange={cancelConfirmation}
                    onConfirm={handleDeleteCliente}
                    onCancel={cancelConfirmation}
                    displayMessage="este cliente"
                    finalConfirmation={true}
                />

                {/* Diálogo para crear/editar citas */}
                {selectedCliente && isCreatingAppointment && (
                    <AppointmentDialog
                        isOpen={isAppointmentDialogOpen}
                        onClose={() => {
                            setIsAppointmentDialogOpen(false);
                            setIsCreatingAppointment(false);
                        }}
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
    );
}
