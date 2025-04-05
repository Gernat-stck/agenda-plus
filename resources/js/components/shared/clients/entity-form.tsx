import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export type FieldType = 'text' | 'number' | 'email' | 'textarea' | 'select' | 'custom' | 'readonly';

export interface EntityFormField {
    id: string;
    name: string;
    label: string;
    type: FieldType;
    required?: boolean;
    placeholder?: string;
    options?: Array<{ value: string; label: string }>;
    renderCustom?: (value: any, onChange: (value: any) => void) => React.ReactNode;
}

export interface EntityFormProps {
    entity: any;
    entityType: 'client' | 'service';
    title?: string;
    fields: EntityFormField[];
    isOpen: boolean;
    isCreating: boolean;
    readOnly?: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (entity: any) => void;
    onCancel: () => void;
    additionalContent?: React.ReactNode; // Contenido adicional (ej: listado de citas)
}

export function EntityForm({
    entity,
    entityType,
    title,
    fields,
    isOpen,
    isCreating,
    readOnly = false,
    onOpenChange,
    onSave,
    onCancel,
    additionalContent,
}: EntityFormProps) {
    const [formData, setFormData] = useState<any>(entity || {});

    useEffect(() => {
        if (entity) {
            setFormData(entity);
        }
    }, [entity]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const processedValue = type === 'number' ? Number(value) : value;

        setFormData((prev: any) => ({
            ...prev,
            [name]: processedValue,
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validar campos requeridos
        const requiredFields = fields.filter((field) => field.required);
        const missingFields = requiredFields.filter((field) => !formData[field.name]);

        if (missingFields.length > 0) {
            toast.error('Campos obligatorios incompletos', {
                description: `Por favor complete los siguientes campos: ${missingFields.map((f) => f.label).join(', ')}`,
                duration: 3000,
            });
            return;
        }

        onSave(formData);
    };

    // Renderizar los campos del formulario según su tipo
    const renderField = (field: EntityFormField) => {
        const { id, name, label, type, required, placeholder, options, renderCustom } = field;

        return (
            <div className="w-full space-y-2" key={id}>
                <Label htmlFor={id}>{label}</Label>
                {readOnly || type === 'readonly' ? (
                    <div className="font-medium">{formData[name]}</div>
                ) : (
                    <>
                        {type === 'text' || type === 'email' || type === 'number' ? (
                            <Input
                                id={id}
                                name={name}
                                type={type}
                                value={formData[name] || ''}
                                onChange={handleInputChange}
                                placeholder={placeholder}
                                required={required}
                            />
                        ) : type === 'textarea' ? (
                            <Textarea
                                id={id}
                                name={name}
                                value={formData[name] || ''}
                                onChange={handleInputChange}
                                placeholder={placeholder}
                                required={required}
                            />
                        ) : type === 'select' && options ? (
                            <Select value={formData[name] || ''} onValueChange={(value) => handleSelectChange(name, value)}>
                                <SelectTrigger id={id}>
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : type === 'custom' && renderCustom ? (
                            renderCustom(formData[name], (value) => handleSelectChange(name, value))
                        ) : null}
                    </>
                )}
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="custom-scrollbar sm:max-w-90vw h-auto overflow-auto sm:max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>
                        {title ||
                            (isCreating
                                ? `Crear nuevo ${entityType === 'client' ? 'cliente' : 'servicio'}`
                                : readOnly
                                  ? `Detalles del ${entityType === 'client' ? 'cliente' : 'servicio'}`
                                  : `Editar ${entityType === 'client' ? 'cliente' : 'servicio'}`)}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">{fields.map(renderField)}</div>

                    {additionalContent}

                    <DialogFooter className="mt-4">
                        {readOnly ? (
                            <Button type="button" onClick={onCancel}>
                                Cerrar
                            </Button>
                        ) : (
                            <>
                                <Button type="button" variant="destructive" onClick={onCancel}>
                                    Cancelar
                                </Button>
                                <Button type="submit">{isCreating ? 'Crear' : 'Guardar'}</Button>
                            </>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
