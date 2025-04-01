import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';

export interface SearchBarProps {
    // Búsqueda básica
    searchTerm: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;

    // Botón de acción opcional (ej: "Nuevo Cliente", "Nuevo Servicio")
    showActionButton?: boolean;
    actionButtonLabel?: string;
    actionButtonIcon?: React.ReactNode;
    onActionButtonClick?: () => void;
    actionButtonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    actionButtonClassName?: string;

    // Filtro opcional por categoría
    showCategoryFilter?: boolean;
    filterCategory?: string;
    onCategoryChange?: (category: string) => void;
    categories?: Array<{ id: string; name: string }>;
    categoryPlaceholder?: string;
    allCategoriesLabel?: string;
}

export function SearchBar({
    // Búsqueda
    searchTerm,
    onSearchChange,
    searchPlaceholder = 'Buscar...',

    // Botón de acción
    showActionButton = false,
    actionButtonLabel = 'Nuevo',
    actionButtonIcon = <Plus size={18} />,
    onActionButtonClick,
    actionButtonVariant = 'default',
    actionButtonClassName = 'bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors',

    // Filtro por categoría
    showCategoryFilter = false,
    filterCategory = 'all',
    onCategoryChange,
    categories = [],
    categoryPlaceholder = 'Todas las categorías',
    allCategoriesLabel = 'Todas las categorías',
}: SearchBarProps) {
    return (
        <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row">
            {/* Barra de búsqueda */}
            <div className="relative w-full flex-grow">
                <Search className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" size={18} />
                <Input
                    type="text"
                    placeholder={searchPlaceholder}
                    className="w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Filtro por categoría opcional */}
            {showCategoryFilter && onCategoryChange && (
                <Select value={filterCategory} onValueChange={onCategoryChange}>
                    <SelectTrigger className="min-w-40">
                        <SelectValue placeholder={categoryPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{allCategoriesLabel}</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {/* Botón de acción opcional */}
            {showActionButton && onActionButtonClick && (
                <Button onClick={onActionButtonClick} variant={actionButtonVariant} className={actionButtonClassName}>
                    {actionButtonIcon && <span className="mr-2">{actionButtonIcon}</span>}
                    {actionButtonLabel}
                </Button>
            )}
        </div>
    );
}
