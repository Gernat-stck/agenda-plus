import { useState, useEffect } from "react";
import { Handshake } from "lucide-react";
import { router, usePage } from "@inertiajs/react";
import { type Servicio } from "@/types/services";
import { ServicioDialog } from "./service-dialog";
import { TablaServicios } from "./tabla-servicios";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { NoData } from "../shared/no-data";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { FiltersBar } from "./filters-bar";
import { Pagination } from "../shared/pagination";
import ConfirmActionDialog from "../shared/confirm-dialog";

export default function GestionServicios({ services }: { services: Servicio[] }) {
    const { user } = useAuth();
    const [servicios, setServicios] = useState<Servicio[]>(services);
    const [categorias, setCategorias] = useState<string[]>([]);
    const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategoria, setFilterCategoria] = useState<string>("all");
    const [isCreating, setIsCreating] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [serviceIdToDelete, setServiceIdToDelete] = useState<string | null>(null);

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
                position: "top-right",
            });
        }
    }, [flash]);

    const filteredServicios = servicios.filter(
        (servicio) =>
            (servicio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                servicio.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (filterCategoria === "all" || servicio.category === filterCategoria),
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
                service_id: "",
                user_id: "",
                name: "",
                description: "",
                price: 0,
                duration: 30,
                category: "",
            } as Servicio);
            setIsCreating(true);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingServicio(null);
        setIsCreating(false);
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
                toast.success("Servicio eliminado correctamente", {
                    duration: 3000,
                    position: "top-right",
                });
                setIsConfirmDialogOpen(false);
                setServiceIdToDelete(null);
            },
            onError: (error) => {
                toast.error("Error al eliminar el servicio", {
                    duration: 3000,
                    position: "top-right",
                });
                setIsConfirmDialogOpen(false);
                setServiceIdToDelete(null);
            }
        });
    };
    return (
        <Card className="container mx-auto p-6 border-0">
            <CardHeader className="pb-0">
                <CardTitle className="text-3xl font-bold">Servicios</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <FiltersBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterCategoria={filterCategoria}
                    setFilterCategoria={setFilterCategoria}
                    categorias={categorias}
                    onNewClick={() => openModal()}
                />

                {servicios.length === 0 ? (
                    <NoData
                        title="No hay servicios"
                        description="No se han registrado servicios en el sistema."
                        icon={<Handshake size={64} />}
                    />
                ) : (
                    <>
                        <TablaServicios
                            servicios={currentServicios}
                            onEdit={openModal}
                            onDelete={handleDeleteClick}
                        />
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
                    <ServicioDialog
                        servicio={editingServicio}
                        open={isModalOpen}
                        onOpenChange={setIsModalOpen}
                        onSave={handleSave}
                        categorias={categorias}
                        setCategorias={setCategorias}
                        isCreating={isCreating}
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