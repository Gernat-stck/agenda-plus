import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { NoData } from "../shared/no-data"
import { AccionesCliente } from "./acciones-cliente"
import type { Cliente } from "@/types/clients"
import { Pagination } from "../shared/pagination"

interface TablaClientesProps {
    clientes: Cliente[]
    currentPage: number
    itemsPerPage: number
    onPageChange: (page: number) => void
    onViewDetails: (cliente: Cliente) => void
    onEdit: (cliente: Cliente) => void
    onDelete: (cliente: Cliente) => void
    onCreateAppointment: (cliente: Cliente) => void
}

export function TablaClientes({
    clientes,
    currentPage,
    itemsPerPage,
    onPageChange,
    onViewDetails,
    onEdit,
    onDelete,
    onCreateAppointment
}: TablaClientesProps) {
    // Calcular total de páginas
    const totalPages = Math.ceil(clientes.length / itemsPerPage);

    // Obtener los clientes de la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const clientesPaginados = clientes.slice(startIndex, startIndex + itemsPerPage);

    if (clientes.length === 0) {
        return <NoData />;
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/12">ID</TableHead>
                            <TableHead className="w-3/12">Nombre</TableHead>
                            <TableHead className="w-2/12">Contacto</TableHead>
                            <TableHead className="w-3/12">Correo</TableHead>
                            <TableHead className="w-3/12">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clientesPaginados.map((cliente) => (
                            <TableRow key={cliente.client_id}>
                                <TableCell className="w-1/12 font-medium">{cliente.client_id}</TableCell>
                                <TableCell className="w-3/12">{cliente.name}</TableCell>
                                <TableCell className="w-2/12">{cliente.contact_number}</TableCell>
                                <TableCell className="w-3/12">{cliente.email}</TableCell>
                                <TableCell className="w-3/12 p-2">
                                    <AccionesCliente
                                        cliente={cliente}
                                        onViewDetails={onViewDetails}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onCreateAppointment={onCreateAppointment}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                showIcons={false}
                showPageNumbers={false}
                showPageText={true}
            />
        </>
    )
}