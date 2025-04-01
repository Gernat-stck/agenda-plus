import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, UserPlus } from "lucide-react"

export function UserFilters() {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Buscar usuarios..." className="pl-8 w-full md:w-[300px]" />
                </div>
                <Select defaultValue="all-status">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-status">Todos los estados</SelectItem>
                        <SelectItem value="active">Activos</SelectItem>
                        <SelectItem value="inactive">Inactivos</SelectItem>
                        <SelectItem value="suspended">Suspendidos</SelectItem>
                    </SelectContent>
                </Select>
                <Select defaultValue="all-roles">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Rol" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-roles">Todos los roles</SelectItem>
                        <SelectItem value="admin">Administradores</SelectItem>
                        <SelectItem value="editor">Editores</SelectItem>
                        <SelectItem value="user">Usuarios</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9">
                    <Download className="h-4 w-4" />
                </Button>
                <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Nuevo Usuario
                </Button>
            </div>
        </div>
    )
}

