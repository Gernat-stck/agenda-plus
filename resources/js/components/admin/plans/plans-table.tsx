import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plan } from '@/types/pricing'; // Importa el tipo Plan
import { Copy, Edit, Eye, MoreHorizontal, Trash } from 'lucide-react';

interface PlansTableProps {
    plans: Plan[];
    onEditPlan?: (id: string) => void;
}

export function PlansTable({ plans, onEditPlan }: PlansTableProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Destacado</TableHead>
                    <TableHead>Características</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {plans.map((plan) => (
                    <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.id}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                {plan.title}
                                {plan.badge && <Badge variant={plan.badge.variant}>{plan.badge.text}</Badge>}
                            </div>
                        </TableCell>
                        <TableCell>{plan.description}</TableCell>
                        <TableCell>
                            {plan.highlight ? (
                                <Badge variant="outline" className="border-emerald-500 bg-emerald-50 text-emerald-700">
                                    Sí
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="border-slate-500 bg-slate-100 text-slate-700">
                                    No
                                </Badge>
                            )}
                        </TableCell>
                        <TableCell>{plan.features.length} características</TableCell>
                        <TableCell className="text-right font-medium">
                            {formatCurrency(plan.price)}/{plan.period}
                        </TableCell>
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
                                        <Eye className="mr-2 h-4 w-4" />
                                        Ver detalles
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onEditPlan && onEditPlan(plan.id.toString())}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar plan
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Copy className="mr-2 h-4 w-4" />
                                        Duplicar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                        <Trash className="mr-2 h-4 w-4" />
                                        Eliminar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
