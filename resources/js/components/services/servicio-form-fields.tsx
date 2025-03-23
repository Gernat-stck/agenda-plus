import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EntityFormField } from "../shared/clients/entity-form"

interface ServicioFormFieldsProps {
    categorias: string[];
    newCategoria: string;
    setNewCategoria: (value: string) => void;
    addNewCategoria: () => void;
}

export const ServicioFormFields = ({
    categorias,
    newCategoria,
    setNewCategoria,
    addNewCategoria
}: ServicioFormFieldsProps): EntityFormField[] => [
        {
            id: "name",
            name: "name",
            label: "Título",
            type: "text",
            required: true,
            placeholder: "Nombre del servicio"
        },
        {
            id: "description",
            name: "description",
            label: "Descripción",
            type: "textarea",
            required: true,
            placeholder: "Descripción del servicio"
        },
        {
            id: "price",
            name: "price",
            label: "Precio",
            type: "number",
            required: true,
            placeholder: "0.00"
        },
        {
            id: "duration",
            name: "duration",
            label: "Duración (minutos)",
            type: "number",
            required: true,
            placeholder: "30"
        },
        {
            id: "category",
            name: "category",
            label: "Categoría",
            type: "custom",
            required: true,
            renderCustom: (value, onChange) => {
                return (
                    <div className="space-y-4">
                        <Select value={value} onValueChange={onChange}>
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

                        <div className="flex">
                            <Input
                                type="text"
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
                );
            }
        }
    ];