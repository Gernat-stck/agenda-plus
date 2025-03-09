import type React from "react";
import { useState, useEffect } from "react";
import type { Servicio } from "@/types/services";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ServicioDialogProps {
    servicio: Servicio | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (servicio: Servicio) => void;
    categorias: string[];
    setCategorias: React.Dispatch<React.SetStateAction<string[]>>;
    isCreating: boolean;
}

export const ServicioDialog = ({
    servicio,
    open,
    onOpenChange,
    onSave,
    categorias,
    setCategorias,
    isCreating,
}: ServicioDialogProps) => {
    const initialServicio: Servicio = {
        service_id: '',
        user_id: "CAJU3446",
        name: "",
        description: "",
        price: 0,
        duration: 30,
        category: "", // Asegúrate de incluir la propiedad 'category'
    };

    const [editedServicio, setEditedServicio] = useState<Servicio>(initialServicio);
    const [newCategoria, setNewCategoria] = useState("");

    useEffect(() => {
        if (servicio) {
            setEditedServicio(servicio);
        } else {
            setEditedServicio(initialServicio);
        }
    }, [servicio]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedServicio((prev) => ({
            ...prev,
            [name]: name === "price" || name === "duration" ? Number.parseFloat(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(editedServicio);
        onOpenChange(false);
    };

    const addNewCategoria = () => {
        if (!newCategoria) return toast.error("La categoría no puede estar vacía");
        if (newCategoria && !categorias.includes(newCategoria)) {
            setCategorias([...categorias, newCategoria]);
            setEditedServicio((prev) => ({ ...prev, category: newCategoria }));
            setNewCategoria("");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isCreating ? "Nuevo Servicio" : "Editar Servicio"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="service_id" className="text-sm font-medium">
                                ID
                            </label>
                            <Input
                                type="text"
                                id="service_id"
                                name="service_id"
                                value={editedServicio.service_id}
                                onChange={handleInputChange}
                                required
                                readOnly
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                Título
                            </label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                value={editedServicio.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="description" className="text-sm font-medium">
                                Descripción
                            </label>
                            <Textarea
                                id="description"
                                name="description"
                                value={editedServicio.description}
                                onChange={handleInputChange}
                                rows={3}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="price" className="text-sm font-medium">
                                Precio
                            </label>
                            <Input
                                type="number"
                                id="price"
                                name="price"
                                value={editedServicio.price}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="duration" className="text-sm font-medium">
                                Duración (minutos)
                            </label>
                            <Input
                                type="number"
                                id="duration"
                                name="duration"
                                value={editedServicio.duration}
                                onChange={handleInputChange}
                                min="1"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="category" className="text-sm font-medium">
                                Categoría
                            </label>
                            <Select
                                value={editedServicio.category}
                                onValueChange={(value) => setEditedServicio((prev) => ({ ...prev, category: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categorias.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="newCategoria" className="text-sm font-medium">
                                Nueva Categoría
                            </label>
                            <div className="flex">
                                <Input
                                    type="text"
                                    id="newCategoria"
                                    value={newCategoria}
                                    onChange={(e) => setNewCategoria(e.target.value)}
                                    className="rounded-r-none"
                                    placeholder="Nueva categoría"
                                />
                                <Button type="button" onClick={addNewCategoria} className="rounded-l-none">
                                    Añadir
                                </Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={() => onOpenChange(false)} variant="outline">
                            Cancelar
                        </Button>
                        <Button type="submit">{isCreating ? "Crear" : "Guardar"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

