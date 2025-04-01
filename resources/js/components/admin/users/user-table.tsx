import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreHorizontal, Eye, Edit, Lock, Mail } from "lucide-react"

// Datos de ejemplo
const users = [
    {
        id: "USR-001",
        name: "Juan Pérez",
        email: "juan@example.com",
        status: "active",
        role: "admin",
        plan: "Pro",
        lastLogin: "2023-10-15T14:23:45Z",
        avatar: "JP",
    },
    {
        id: "USR-002",
        name: "María García",
        email: "maria@example.com",
        status: "active",
        role: "user",
        plan: "Basic",
        lastLogin: "2023-10-15T12:10:22Z",
        avatar: "MG",
    },
    {
        id: "USR-003",
        name: "Carlos Rodríguez",
        email: "carlos@example.com",
        status: "inactive",
        role: "user",
        plan: "Pro",
        lastLogin: "2023-10-14T09:45:12Z",
        avatar: "CR",
    },
    {
        id: "USR-004",
        name: "Ana Martínez",
        email: "ana@example.com",
        status: "active",
        role: "editor",
        plan: "Enterprise",
        lastLogin: "2023-10-14T08:30:55Z",
        avatar: "AM",
    },
    {
        id: "USR-005",
        name: "Roberto Sánchez",
        email: "roberto@example.com",
        status: "suspended",
        role: "user",
        plan: "Basic",
        lastLogin: "2023-10-13T16:42:30Z",
        avatar: "RS",
    },
]

export function UsersTable() {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return (
                    <Badge variant="outline" className="bg-emerald-50 border-emerald-500 text-emerald-700">
                        Activo
                    </Badge>
                )
            case "inactive":
                return (
                    <Badge variant="outline" className="bg-slate-100 border-slate-500 text-slate-700">
                        Inactivo
                    </Badge>
                )
            case "suspended":
                return (
                    <Badge variant="outline" className="bg-rose-50 border-rose-500 text-rose-700">
                        Suspendido
                    </Badge>
                )
            default:
                return <Badge variant="outline">Desconocido</Badge>
        }
    }

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "admin":
                return <Badge variant="secondary">Administrador</Badge>
            case "editor":
                return <Badge variant="outline">Editor</Badge>
            case "user":
                return <Badge variant="outline">Usuario</Badge>
            default:
                return <Badge variant="outline">Desconocido</Badge>
        }
    }

    const getPlanBadge = (plan: string) => {
        switch (plan) {
            case "Enterprise":
                return <Badge className="bg-purple-100 hover:bg-purple-100 text-purple-800 border-purple-300">Enterprise</Badge>
            case "Pro":
                return <Badge className="bg-blue-100 hover:bg-blue-100 text-blue-800 border-blue-300">Pro</Badge>
            case "Basic":
                return <Badge className="bg-gray-100 hover:bg-gray-100 text-gray-800 border-gray-300">Basic</Badge>
            default:
                return <Badge variant="outline">Free</Badge>
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[250px]">Usuario</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Último acceso</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback>{user.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{getPlanBadge(user.plan)}</TableCell>
                        <TableCell>{formatDate(user.lastLogin)}</TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Abrir menú</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Eye className="h-4 w-4 mr-2" />
                                        Ver perfil
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Editar usuario
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Enviar email
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Lock className="h-4 w-4 mr-2" />
                                        Cambiar contraseña
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

