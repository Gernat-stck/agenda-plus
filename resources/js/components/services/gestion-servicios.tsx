import { useState } from "react";
import { Handshake, Plus, Search } from "lucide-react";
import { router } from "@inertiajs/react";
import { type Servicio, categoriasIniciales, serviciosIniciales } from "@/types/services";
import { ServicioDialog } from "./service-dialog";
import { TablaServicios } from "./tabla-servicios";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { NoData } from "../no-data";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { toast } from "sonner";

export default function GestionServicios({ services }: { services: Servicio[] }) {
    const [servicios, setServicios] = useState<Servicio[]>(services);
    const [categorias, setCategorias] = useState<string[]>(categoriasIniciales);
    const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategoria, setFilterCategoria] = useState<string>("all");
    const [isCreating, setIsCreating] = useState(false);

    const filteredServicios = servicios.filter(
        (servicio) =>
            (servicio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                servicio.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (filterCategoria === "all" || servicio.category === filterCategoria),
    );

    const openModal = (servicio?: Servicio) => {
        if (servicio) {
            setEditingServicio(servicio);
            setIsCreating(false);
        } else {
            setEditingServicio({
                service_id: `SERV${(servicios.length + 1).toString().padStart(3, "0")}`,
                user_id: "CAJU3446",
                name: "",
                description: "",
                price: 0,
                duration: 30,
                category: "",
            });
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
        console.log(servicio);
        try {
            if (isCreating) {

                router.post(('services'), { ...servicio }, {
                    onSuccess: () => {
                        setServicios([...servicios, servicio]);
                        closeModal();
                        toast.success("Servicio guardado correctamente.", {
                            duration: 3000,
                            position: "top-right",
                        });
                    },
                });
            } else {
                router.patch((`services/${servicio.service_id}`), { ...servicio }, {
                    onSuccess: () => {
                        setServicios(servicios.map((s) => (s.service_id === servicio.service_id ? servicio : s)));
                        closeModal();
                        toast.success("Servicio actualizado correctamente.", {
                            duration: 3000,
                            position: "top-right",
                        });
                    },
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar el servicio.", {
                duration: 3000,
                position: "top-right",
            });
        }
    };

    const handleDelete = (id: string) => {
        /*Inertia.delete(route('services.destroy', { service: id }), {
            onSuccess: () => {
                setServicios(servicios.filter((s) => s.id !== id));
                toast.success("Servicio eliminado correctamente.", {
                    duration: 3000,
                    position: "top-right",
                });
            },
        });*/
    };

    return (
        <Card className="container mx-auto p-6">
            <CardHeader className="pb-0">
                <CardTitle className="text-3xl font-bold">Servicios</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center mb-4">
                <Button
                    onClick={() => openModal()}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                    <Plus size={20} className="inline-block mr-2" />
                    Nuevo Servicio
                </Button>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Buscar servicios..."
                            className="pl-10 pr-4 py-2 border rounded-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    </div>
                    <Select defaultValue="all" onValueChange={(value) => setFilterCategoria(value)}>
                        <SelectTrigger className="border rounded-md px-2 py-2">
                            <SelectValue placeholder="Todas las categorías" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las categorías</SelectItem>
                            {categorias.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            {servicios.length === 0 ? (
                <NoData
                    title="No hay servicios"
                    description="No se han registrado servicios en el sistema."
                    icon={<Handshake size={64} />}
                />
            ) : (
                <TablaServicios servicios={filteredServicios} onEdit={openModal} onDelete={handleDelete} />
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
        </Card>
    );
}