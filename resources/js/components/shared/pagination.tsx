import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    // Formas de calcular las páginas
    totalItems?: number;
    itemsPerPage?: number;
    totalPages?: number;

    currentPage: number;
    onPageChange: (page: number) => void;

    // Opciones de visualización
    showPageNumbers?: boolean;
    showPageText?: boolean;
    showIcons?: boolean;
    maxPageButtons?: number;
}

export function Pagination({
    totalItems,
    itemsPerPage = 10,
    totalPages: propsTotalPages,
    currentPage,
    onPageChange,
    showPageNumbers = true,
    showPageText = true,
    showIcons = true,
    maxPageButtons = 5
}: PaginationProps) {
    // Calcular páginas totales usando totalItems/itemsPerPage o usando el prop directo
    const totalPages = propsTotalPages || (totalItems ? Math.ceil(totalItems / itemsPerPage) : 0);

    if (totalPages <= 1) return null;

    // Función para generar los botones de página limitados si hay muchas páginas
    const getPageButtons = () => {
        if (!showPageNumbers) return null;

        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

        // Ajustar el rango si estamos cerca del final
        if (endPage - startPage + 1 < maxPageButtons) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }

        const pages = [];

        // Agregar primera página y elipsis si es necesario
        if (startPage > 1) {
            pages.push(
                <Button
                    key="1"
                    variant={currentPage === 1 ? "default" : "outline"}
                    className="w-8 h-8"
                    size="sm"
                    onClick={() => onPageChange(1)}
                >
                    1
                </Button>
            );
            if (startPage > 2) {
                pages.push(<span key="ellipsis1" className="px-2">...</span>);
            }
        }

        // Agregar páginas del rango actual
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    className="w-8 h-8"
                    size="sm"
                    onClick={() => onPageChange(i)}
                >
                    {i}
                </Button>
            );
        }

        // Agregar última página y elipsis si es necesario
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="ellipsis2" className="px-2">...</span>);
            }
            pages.push(
                <Button
                    key={totalPages}
                    variant={currentPage === totalPages ? "default" : "outline"}
                    className="w-8 h-8"
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                >
                    {totalPages}
                </Button>
            );
        }

        return <div className="flex gap-1">{pages}</div>;
    };

    return (
        <div className="flex items-center justify-between mt-6">
            {showPageText && (
                <div className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                </div>
            )}

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    size="sm"
                >
                    {showIcons && <ChevronLeft size={16} className="mr-1" />}
                    Anterior
                </Button>

                {getPageButtons()}

                <Button
                    variant="outline"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    size="sm"
                >
                    Siguiente
                    {showIcons && <ChevronRight size={16} className="ml-1" />}
                </Button>
            </div>
        </div>
    );
}