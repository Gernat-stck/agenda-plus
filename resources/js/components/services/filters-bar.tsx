import { Plus, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface FiltersBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterCategoria: string;
    setFilterCategoria: (category: string) => void;
    categorias: string[];
    onNewClick: () => void;
}

export function FiltersBar({
    searchTerm,
    setSearchTerm,
    filterCategoria,
    setFilterCategoria,
    categorias,
    onNewClick
}: FiltersBarProps) {
    return (
        <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-grow w-full">
                <Input
                    type="text"
                    placeholder="Buscar servicios..."
                    className="pl-10 pr-4 py-2 border rounded-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>

            <Select value={filterCategoria} onValueChange={(value) => setFilterCategoria(value)}>
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
            <Button
                onClick={onNewClick}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
                <Plus size={20} className="inline-block mr-2" />
                Nuevo Servicio
            </Button>
        </div>
    );
}