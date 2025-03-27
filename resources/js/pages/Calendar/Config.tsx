import { router, useForm } from '@inertiajs/react';
import { Calendar, CalendarIcon, Clock, Edit, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';
import type { CalendarConfig, SpecialDate } from '@/types/calendar';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

// Extendemos la interfaz CalendarConfig para incluir special_dates
interface ExtendedCalendarConfig extends CalendarConfig {
    special_dates: SpecialDate[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Calendario',
        href: '/calendar',
    },
    {
        title: 'Configuración',
        href: '/calendar/config',
    },
];

// Array de días de la semana para los checkboxes
const daysOfWeek = [
    { id: 1, name: 'Lunes', shortName: 'L' },
    { id: 2, name: 'Martes', shortName: 'M' },
    { id: 3, name: 'Miércoles', shortName: 'X' },
    { id: 4, name: 'Jueves', shortName: 'J' },
    { id: 5, name: 'Viernes', shortName: 'V' },
    { id: 6, name: 'Sábado', shortName: 'S' },
    { id: 0, name: 'Domingo', shortName: 'D' },
];

// Colores predefinidos para fechas especiales
const predefinedColors = [
    '#ef4444', // Rojo
    '#f97316', // Naranja
    '#f59e0b', // Ámbar
    '#10b981', // Esmeralda
    '#06b6d4', // Cian
    '#3b82f6', // Azul
    '#8b5cf6', // Violeta
    '#ec4899', // Rosa
    '#6b7280', // Gris
];
export default function CalendarConfigPage({ config }: { config: ExtendedCalendarConfig }) {
    const { data, setData, processing, errors, reset } = useForm<ExtendedCalendarConfig>({
        ...config,
        special_dates: config.special_dates || [],
    });

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [currentSpecialDate, setCurrentSpecialDate] = useState<SpecialDate | null>(null);
    const [newSpecialDate, setNewSpecialDate] = useState<Partial<SpecialDate>>({
        title: '',
        date: '',
        is_available: false,
        color: predefinedColors[0],
        description: '',
    });

    const toggleDay = (dayId: number) => {
        const currentDays = [...data.business_days];
        if (currentDays.includes(dayId)) {
            setData(
                'business_days',
                currentDays.filter((id) => id !== dayId),
            );
        } else {
            setData('business_days', [...currentDays, dayId]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Detectar si hay días de fin de semana seleccionados
        const hasWeekendSelected = data.business_days.some((day) => day === 0 || day === 6);

        // Crear un objeto con los datos actualizados
        const finalData = {
            ...data,
            show_weekend: hasWeekendSelected,
            special_dates: JSON.stringify(data.special_dates), // Serializar a JSON
        };

        // Enviar los datos actualizados directamente
        router.post('/calendar/config', finalData, {
            onSuccess: () => {
                // Actualizar el estado local después de éxito
                setData('show_weekend', hasWeekendSelected);

                toast.success('Configuración guardada correctamente', {
                    duration: 5000,
                    description: 'Los cambios se han guardado correctamente.',
                });
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            },
        });
    };

    const handleReset = () => {
        reset();
        toast.info('Configuración restablecida', {
            duration: 5000,
            description: 'La configuración ha sido restablecida a su estado original.',
        });
    };

    // Modificar el método handleAddSpecialDate
    const handleAddSpecialDate = () => {
        if (!newSpecialDate.title || !newSpecialDate.date) {
            toast.error('Error', {
                duration: 5000,
                description: 'El título y la fecha son obligatorios.',
            });
            return;
        }

        // Generar un ID temporal
        const tempId = Date.now();

        const specialDateToAdd: SpecialDate = {
            id: tempId,
            user_id: 'current_user',
            specialdate_id: tempId.toString(),
            title: newSpecialDate.title || '',
            date: newSpecialDate.date || '',
            is_available: newSpecialDate.is_available || false,
            color: newSpecialDate.color,
            description: newSpecialDate.description,
        };
        // Enviar al servidor (corregido)
        router.post('/special-dates', specialDateToAdd as unknown as Record<string, any>, {
            onSuccess: () => {
                toast.success('Fecha especial añadida', {
                    duration: 5000,
                    description: 'La fecha especial se ha guardado en el servidor.',
                });
            },
        });

        // Actualizar el estado local
        setData('special_dates', [...data.special_dates, specialDateToAdd]);
        // Resetear el formulario
        setNewSpecialDate({
            title: '',
            date: '',
            is_available: false,
            color: predefinedColors[0],
            description: '',
        });

        setIsAddDialogOpen(false);
    };

    const handleEditSpecialDate = () => {
        if (!currentSpecialDate || !currentSpecialDate.title || !currentSpecialDate.date) {
            toast.error('Error', {
                duration: 5000,
                description: 'El título y la fecha son obligatorios.',
            });
            return;
        }

        router.patch(`/special-dates/${currentSpecialDate.specialdate_id}`, currentSpecialDate as unknown as Record<string, any>, {
            onSuccess: () => {
                toast.success('Fecha especial actualizada', {
                    duration: 3000,
                    description: 'La fecha especial se ha actualizado correctamente.',
                });
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            },
        });

        const updatedSpecialDates = data.special_dates.map((date) => (date.id === currentSpecialDate.id ? currentSpecialDate : date));

        setData('special_dates', updatedSpecialDates);
        setIsEditDialogOpen(false);
    };

    const handleDeleteSpecialDate = (id: string) => {
        if (!id)
            return toast.error('Error', {
                duration: 5000,
                description: 'Falta el ID.',
            });

        const updatedSpecialDates = data.special_dates.filter((date) => date.specialdate_id !== id);
        setData('special_dates', updatedSpecialDates);

        router.delete(`/special-dates/${id}`, {
            onSuccess: () => {
                toast.success('Fecha especial eliminada', {
                    duration: 5000,
                    description: 'La fecha especial se ha eliminado correctamente.',
                });
            },
            onError: () => {
                toast.error('Error', {
                    duration: 5000,
                    description: 'No se pudo eliminar la fecha especial.',
                });
            },
        });
    };
    const openEditDialog = (specialDate: SpecialDate) => {
        setCurrentSpecialDate(specialDate);
        setIsEditDialogOpen(true);
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuración del Calendario" />
            <div className="container mx-auto max-w-4xl py-6">
                <form onSubmit={handleSubmit}>
                    <Tabs defaultValue="horario" className="w-full">
                        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Configuración del Calendario</h1>
                                <p className="text-muted-foreground">Personaliza cómo se muestra y comporta tu calendario</p>
                            </div>
                            <TabsList>
                                <TabsTrigger value="horario">Horario</TabsTrigger>
                                <TabsTrigger value="dias">Días</TabsTrigger>
                                <TabsTrigger value="fechas-especiales">Fechas Especiales</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="horario">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Clock className="text-primary h-5 w-5" />
                                        <CardTitle>Horario Laboral</CardTitle>
                                    </div>
                                    <CardDescription>Configura las horas de inicio y fin de tu jornada laboral</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="start_time">Hora de inicio</Label>
                                            <Input
                                                id="start_time"
                                                type="time"
                                                value={data.start_time}
                                                onChange={(e) => setData('start_time', e.target.value)}
                                                className="w-full"
                                            />
                                            {errors.start_time && <p className="text-destructive text-sm">{errors.start_time}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="end_time">Hora de fin</Label>
                                            <Input
                                                id="end_time"
                                                type="time"
                                                value={data.end_time}
                                                onChange={(e) => setData('end_time', e.target.value)}
                                                className="w-full"
                                            />
                                            {errors.end_time && <p className="text-destructive text-sm">{errors.end_time}</p>}
                                        </div>
                                    </div>
                                    <div className="mt-6 space-y-2">
                                        <Label htmlFor="max_appointments">Número máximo de citas por franja</Label>
                                        <Input
                                            id="max_appointments"
                                            type="number"
                                            min="1"
                                            value={data.max_appointments}
                                            onChange={(e) => setData('max_appointments', Number.parseInt(e.target.value))}
                                            className="w-full"
                                        />
                                        {errors.max_appointments && <p className="text-destructive text-sm">{errors.max_appointments}</p>}
                                        <p className="text-muted-foreground text-sm">
                                            Define cuántas citas pueden agendarse simultáneamente en una misma franja horaria.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="dias">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="text-primary h-5 w-5" />
                                        <CardTitle>Días Laborales</CardTitle>
                                    </div>
                                    <CardDescription>Selecciona los días que forman parte de tu semana laboral</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                                        {daysOfWeek.map((day) => {
                                            const isSelected = data.business_days.includes(day.id);
                                            return (
                                                <button
                                                    key={day.id}
                                                    type="button"
                                                    onClick={() => toggleDay(day.id)}
                                                    className={`flex h-16 w-16 flex-col items-center justify-center rounded-lg border-2 transition-all ${
                                                        isSelected
                                                            ? 'border-primary bg-primary/10 text-primary font-medium'
                                                            : 'border-border hover:border-primary/50 hover:bg-primary/5'
                                                    }`}
                                                >
                                                    <span className="text-xl font-semibold">{day.shortName}</span>
                                                    <span className="text-xs">{day.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.business_days && <p className="text-destructive text-sm">{errors.business_days}</p>}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="fechas-especiales">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="text-primary h-5 w-5" />
                                            <CardTitle>Fechas Especiales</CardTitle>
                                        </div>
                                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button size="sm">
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Añadir fecha
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[500px]">
                                                <DialogHeader>
                                                    <DialogTitle>Añadir fecha especial</DialogTitle>
                                                    <DialogDescription>Añade una fecha especial o día atípico a tu calendario.</DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="title">Título</Label>
                                                        <Input
                                                            id="title"
                                                            value={newSpecialDate.title}
                                                            onChange={(e) => setNewSpecialDate({ ...newSpecialDate, title: e.target.value })}
                                                            placeholder="Ej: Día festivo, Vacaciones..."
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="date">Fecha</Label>
                                                        <DatePicker
                                                            date={newSpecialDate.date || ''}
                                                            onDateChange={(newDate) =>
                                                                setNewSpecialDate({
                                                                    ...newSpecialDate,
                                                                    date: newDate,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Disponibilidad</Label>
                                                        <div className="flex items-center space-x-2">
                                                            <Switch
                                                                id="is_available"
                                                                checked={newSpecialDate.is_available}
                                                                onCheckedChange={(checked) =>
                                                                    setNewSpecialDate({ ...newSpecialDate, is_available: checked })
                                                                }
                                                            />
                                                            <Label htmlFor="is_available">
                                                                {newSpecialDate.is_available ? 'Disponible' : 'No disponible'}
                                                            </Label>
                                                        </div>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Color</Label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {predefinedColors.map((color) => (
                                                                <button
                                                                    key={color}
                                                                    type="button"
                                                                    onClick={() => setNewSpecialDate({ ...newSpecialDate, color })}
                                                                    className={`h-8 w-8 rounded-full transition-all ${
                                                                        newSpecialDate.color === color ? 'ring-primary ring-2 ring-offset-2' : ''
                                                                    }`}
                                                                    style={{ backgroundColor: color }}
                                                                    aria-label={`Color ${color}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="description">Descripción (opcional)</Label>
                                                        <Textarea
                                                            id="description"
                                                            value={newSpecialDate.description || ''}
                                                            onChange={(e) => setNewSpecialDate({ ...newSpecialDate, description: e.target.value })}
                                                            placeholder="Añade una descripción para esta fecha especial..."
                                                            rows={3}
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                                        Cancelar
                                                    </Button>
                                                    <Button onClick={handleAddSpecialDate}>Añadir</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <CardDescription>Gestiona días especiales o atípicos en tu calendario</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {data.special_dates && data.special_dates.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Título</TableHead>
                                                    <TableHead>Fecha</TableHead>
                                                    <TableHead>Estado</TableHead>
                                                    <TableHead className="text-right">Acciones</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data.special_dates.map((specialDate) => (
                                                    <TableRow key={specialDate.id}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="h-3 w-3 rounded-full"
                                                                    style={{ backgroundColor: specialDate.color || '#3b82f6' }}
                                                                />
                                                                {specialDate.title}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {format(new Date(specialDate.date.substring(0, 10) + 'T12:00:00'), 'dd MMM yyyy', {
                                                                locale: es,
                                                            })}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={specialDate.is_available ? 'outline' : 'secondary'}>
                                                                {specialDate.is_available ? 'Disponible' : 'No disponible'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    type="button"
                                                                    onClick={() => openEditDialog(specialDate)}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                    <span className="sr-only">Editar</span>
                                                                </Button>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button variant="ghost" size="icon" type="button">
                                                                            <Trash2 className="text-destructive h-4 w-4" />
                                                                            <span className="sr-only">Eliminar</span>
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                Esta acción eliminará la fecha especial "{specialDate.title}" y no se
                                                                                puede deshacer.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => handleDeleteSpecialDate(specialDate.specialdate_id)}
                                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                            >
                                                                                Eliminar
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <Calendar className="text-muted-foreground mb-4 h-12 w-12" />
                                            <h3 className="text-lg font-medium">No hay fechas especiales</h3>
                                            <p className="text-muted-foreground mt-1 mb-4 max-w-md text-sm">
                                                Añade fechas especiales como días festivos, vacaciones o cualquier día atípico que afecte a tu
                                                calendario.
                                            </p>
                                            <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(true)}>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Añadir primera fecha
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <div className="mt-6 flex items-center justify-end gap-4">
                            <Button type="button" variant="outline" onClick={handleReset} disabled={processing}>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Restablecer
                            </Button>
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 h-4 w-4" />
                                Guardar configuración
                            </Button>
                        </div>
                    </Tabs>
                </form>
            </div>

            {/* Diálogo de edición */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Editar fecha especial</DialogTitle>
                        <DialogDescription>Modifica los detalles de esta fecha especial.</DialogDescription>
                    </DialogHeader>
                    {currentSpecialDate && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-title">Título</Label>
                                <Input
                                    id="edit-title"
                                    value={currentSpecialDate.title}
                                    onChange={(e) => setCurrentSpecialDate({ ...currentSpecialDate, title: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-date">Fecha</Label>
                                <div className="grid gap-2">
                                    <Label htmlFor="date">Fecha</Label>
                                    <DatePicker
                                        date={currentSpecialDate.date}
                                        onDateChange={(newDate) =>
                                            setCurrentSpecialDate({
                                                ...currentSpecialDate,
                                                date: newDate,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Disponibilidad</Label>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="edit-is_available"
                                        checked={currentSpecialDate.is_available}
                                        onCheckedChange={(checked) => setCurrentSpecialDate({ ...currentSpecialDate, is_available: checked })}
                                    />
                                    <Label htmlFor="edit-is_available">{currentSpecialDate.is_available ? 'Disponible' : 'No disponible'}</Label>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Color</Label>
                                <div className="flex flex-wrap gap-2">
                                    {predefinedColors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setCurrentSpecialDate({ ...currentSpecialDate, color })}
                                            className={`h-8 w-8 rounded-full transition-all ${
                                                currentSpecialDate.color === color ? 'ring-primary ring-2 ring-offset-2' : ''
                                            }`}
                                            style={{ backgroundColor: color }}
                                            aria-label={`Color ${color}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-description">Descripción (opcional)</Label>
                                <Textarea
                                    id="edit-description"
                                    value={currentSpecialDate.description || ''}
                                    onChange={(e) => setCurrentSpecialDate({ ...currentSpecialDate, description: e.target.value })}
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleEditSpecialDate}>Guardar cambios</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppSidebarLayout>
    );
}
