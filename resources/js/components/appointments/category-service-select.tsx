import { category } from "@/types/services";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryServiceSelectProps {
    categories: category[];
    value: string;
    onChange: (value: string) => void;
}

export function CategoryServiceSelect({ categories, value, onChange }: CategoryServiceSelectProps) {
    return (
        <Select value={value} onValueChange={onChange} required>
            <SelectTrigger>
                <SelectValue placeholder="Selecciona un servicio" />
            </SelectTrigger>
            <SelectContent>
                {categories.map((cat) => (
                    <div key={cat.name} className="pb-1">
                        <div className="font-semibold text-sm px-2 py-1.5 bg-muted/50">
                            {cat.name}
                        </div>
                        {cat.services.map((service) => (
                            <SelectItem key={service.service_id} value={service.service_id}>
                                {service.name} (${service.price} - {service.duration}min)
                            </SelectItem>
                        ))}
                    </div>
                ))}
            </SelectContent>
        </Select>
    );
}