import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BusquedaClientesProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    onCreateClick: () => void
}

export function BusquedaClientes({ searchTerm, onSearchChange, onCreateClick }: BusquedaClientesProps) {
    return (
        <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-grow w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                    type="text"
                    placeholder="Buscar por nombre o ID de cliente..."
                    className="w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <Button
                onClick={onCreateClick}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                variant="default"
            >
                <Plus size={18} className="mr-2" />
                Nuevo Cliente
            </Button>
        </div>
    )
}