import { AccionesCliente } from "./acciones-cliente"
import type { Cliente } from "@/types/clients"
import { DataTable, Column } from "../shared/data-table"

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
    
    // Definir las columnas para la tabla de clientes
    const columns: Column<Cliente>[] = [
        {
            key: "client_id",
            header: "ID",
            width: "w-1/12",
            cell: (cliente) => <span className="font-medium">{cliente.client_id}</span>
        },
        {
            key: "name",
            header: "Nombre",
            width: "w-3/12",
            cell: (cliente) => cliente.name
        },
        {
            key: "contact_number",
            header: "Contacto",
            width: "w-2/12",
            cell: (cliente) => cliente.contact_number
        },
        {
            key: "email",
            header: "Correo",
            width: "w-3/12",
            cell: (cliente) => cliente.email
        },
        {
            key: "actions",
            header: "Acciones",
            width: "w-3/12",
            cell: (cliente) => (
                <AccionesCliente
                    cliente={cliente}
                    onViewDetails={onViewDetails}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onCreateAppointment={onCreateAppointment}
                />
            )
        }
    ];

    return (
        <DataTable
            data={clientes}
            columns={columns}
            keyExtractor={(cliente) => cliente.client_id}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
        />
    );
}