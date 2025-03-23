import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "./pagination";
import { NoData } from "./no-data";

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  cell: (item: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];                          // Los datos a mostrar
  columns: Column<T>[];               // Configuración de columnas
  keyExtractor: (item: T) => string;  // Función para extraer la clave única
  
  // Paginación
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  
  // Personalización
  noDataComponent?: React.ReactNode;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  currentPage,
  itemsPerPage,
  onPageChange,
  noDataComponent,
  className = ""
}: DataTableProps<T>) {
  // Calcular el total de páginas
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  // Obtener los items de la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);
  
  // Si no hay datos, mostrar componente de NoData
  if (data.length === 0) {
    return noDataComponent ? <>{noDataComponent}</> : <NoData />;
  }
  
  return (
    <>
      <div className={`rounded-md border ${className}`}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.key} 
                  className={column.width ? column.width : ""}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow key={keyExtractor(item)} className="hover:bg-gray-400/20 dark:hover:bg-gray-400/20">
                {columns.map((column) => (
                  <TableCell key={`${keyExtractor(item)}-${column.key}`} className="p-4">
                    {column.cell(item, index)}
                  </TableCell>
                ))}
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
  );
}