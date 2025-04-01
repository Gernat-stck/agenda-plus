import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EntityFormField } from "../shared/clients/entity-form"
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";

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
            type: "custom",
            required: true,
            renderCustom: (value, onChange) => {
                // Asegurar que el valor inicial sea múltiplo de 30
                const currentValue = value || 30;

                const increment = () => {
                    onChange(currentValue + 30);
                };

                const decrement = () => {
                    if (currentValue > 30) {
                        onChange(currentValue - 30);
                    }
                };

                return (
                    <div className="flex items-center space-x-2 border rounded-md p-2 max-w-2xs max-h-10">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={decrement}
                            disabled={currentValue <= 30}
                            className="max-w-2 max-h-5"
                        >
                            <MinusCircleIcon />
                        </Button>
                        <div className="flex-1 text-center font-medium">
                            {currentValue} minutos
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            className="max-w-2 max-h-5 "
                            onClick={increment}
                        >
                            <PlusCircleIcon />
                        </Button>

                    </div>
                );
            }
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
