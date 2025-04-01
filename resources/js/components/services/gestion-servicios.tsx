import { useAuth } from '@/context/AuthContext';
import { type Servicio } from '@/types/services';
import { router, usePage } from '@inertiajs/react';
import { Handshake, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { EntityForm } from '../shared/clients/entity-form';
import ConfirmActionDialog from '../shared/confirm-dialog';
import { NoData } from '../shared/no-data';
import { Pagination } from '../shared/pagination';
import { SearchBar } from '../shared/search-bar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ServicioFormFields } from './servicio-form-fields';
import { TablaServicios } from './tabla-servicios';

export default function GestionServicios({ services }: { services: Servicio[] }) {
    const { user } = useAuth();
    const [servicios, setServicios] = useState<Servicio[]>(services);
    const [categorias, setCategorias] = useState<string[]>([]);
    const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategoria, setFilterCategoria] = useState<string>('all');
    const [isCreating, setIsCreating] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [serviceIdToDelete, setServiceIdToDelete] = useState<string | null>(null);
    const [newCategoria, setNewCategoria] = useState('');

    const { flash } = usePage().props as any;

    // Paginación
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        // Extraer categorías únicas de los servicios
        const categoriasUnicas = Array.from(new Set(services.map((servicio) => servicio.category)));
        setCategorias(categoriasUnicas);
    }, [services]);

    useEffect(() => {
        setServicios(services);
    }, [services]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterCategoria]);

    useEffect(() => {
        if (flash && flash.success) {
            toast.success(flash.success, {
                duration: 3000,
                position: 'top-right',
            });
        }
    }, [flash]);

    // Función para añadir nueva categoría
    const addNewCategoria = () => {
        if (!newCategoria.trim()) {
            toast.error('Ingrese un nombre para la categoría');
            return;
        }

        if (categorias.includes(newCategoria.trim())) {
            toast.error('Esta categoría ya existe');
            return;
        }

        setCategorias([...categorias, newCategoria.trim()]);

        // Si hay un servicio en edición, actualizar su categoría
        if (editingServicio) {
            setEditingServicio({
                ...editingServicio,
                category: newCategoria.trim(),
            });
        }

        setNewCategoria('');
        toast.success('Categoría añadida');
    };

    const filteredServicios = servicios.filter(
        (servicio) =>
            (servicio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                servicio.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (filterCategoria === 'all' || servicio.category === filterCategoria),
    );

    // Calculamos los servicios de la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentServicios = filteredServicios.slice(indexOfFirstItem, indexOfLastItem);

    const openModal = (servicio?: Servicio) => {
        if (servicio) {
            setEditingServicio(servicio);
            setIsCreating(false);
        } else {
            setEditingServicio({
                service_id: '',
                user_id: '',
                name: '',
                description: '',
                price: 0,
                duration: 30,
                category: '',
            } as Servicio);
            setIsCreating(true);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingServicio(null);
        setIsCreating(false);
        setNewCategoria('');
    };

    const handleSave = (servicio: Servicio) => {
        if (isCreating) {
            router.post('services', { ...servicio, user_id: user?.user_id });
        } else {
            router.patch(`services/${servicio.service_id}`, { ...servicio, user_id: user?.user_id });
        }
        closeModal();
    };

    const handleDeleteClick = (id: string) => {
        setServiceIdToDelete(id);
        setIsConfirmDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!serviceIdToDelete) return;

        router.delete(`services/destroy/${serviceIdToDelete}`, {
            onSuccess: () => {
                toast.success('Servicio eliminado correctamente', {
                    duration: 3000,
                    position: 'top-right',
                });
                setIsConfirmDialogOpen(false);
                setServiceIdToDelete(null);
            },
            onError: (error) => {
                toast.error('Error al eliminar el servicio', {
                    duration: 3000,
                    position: 'top-right',
                });
                setIsConfirmDialogOpen(false);
                setServiceIdToDelete(null);
            },
        });
    };

    return (
        <Card className="container mx-auto border-0 p-6">
            <CardHeader className="pb-0">
                <CardTitle className="text-3xl font-bold">Servicios</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Buscar servicios..."
                    showActionButton={true}
                    actionButtonLabel="Nuevo Servicio"
                    actionButtonIcon={<PlusCircle size={20} />}
                    onActionButtonClick={() => openModal()}
                    showCategoryFilter={true}
                    filterCategory={filterCategoria}
                    onCategoryChange={setFilterCategoria}
                    categories={categorias.map((cat) => ({ id: cat, name: cat }))}
                    categoryPlaceholder="Todas las categorías"
                />

                {servicios.length === 0 ? (
                    <NoData title="No hay servicios" description="No se han registrado servicios en el sistema." icon={<Handshake size={64} />} />
                ) : (
                    <>
                        <TablaServicios servicios={currentServicios} onEdit={openModal} onDelete={handleDeleteClick} />
                        <Pagination
                            totalItems={filteredServicios.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                            showIcons={false}
                            showPageNumbers={false}
                            showPageText={true}
                        />
                    </>
                )}

                {isModalOpen && (
                    <EntityForm
                        entity={editingServicio}
                        entityType="service"
                        fields={ServicioFormFields({
                            categorias,
                            newCategoria,
                            setNewCategoria,
                            addNewCategoria,
                        })}
                        isOpen={isModalOpen}
                        isCreating={isCreating}
                        onOpenChange={setIsModalOpen}
                        onSave={handleSave}
                        onCancel={closeModal}
                    />
                )}
                {isConfirmDialogOpen && (
                    <ConfirmActionDialog
                        open={isConfirmDialogOpen}
                        onOpenChange={setIsConfirmDialogOpen}
                        onConfirm={confirmDelete}
                        onCancel={() => {
                            setIsConfirmDialogOpen(false);
                            setServiceIdToDelete(null);
                        }}
                        title="Eliminar servicio"
                        displayMessage="eliminar este servicio"
                        confirmText="Eliminar"
                        cancelText="Cancelar"
                        finalConfirmation={true}
                        isDestructive={true}
                    />
                )}
            </CardContent>
        </Card>
    );
}
