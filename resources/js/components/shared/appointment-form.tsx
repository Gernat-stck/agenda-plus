import { addMinutes } from 'date-fns';
import { Banknote, CheckCircle2, CreditCard, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAvailableSlots } from '@/hooks/use-available-slots';
import { getServiceDuration, getServiceInfo, getServiceName, getServicePrice } from '@/utils/service-utils';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

import type { CalendarConfig, SpecialDate } from '@/types/calendar';
import type { Cita } from '@/types/clients';
import type { category } from '@/types/services';
import { isDateAvailable, isTimeWithinBusinessHours } from '@/utils/appointment-validations';
import { formatForDisplay, formatTimeRange } from '@/utils/date-utils';
import { Button } from '../ui/button';
import { DateTimePicker } from '../ui/date-time-picker';
import { Input } from '../ui/input';
// Modificar la interfaz para incluir isSubmitting
interface AppointmentFormProps {
    onSave: (appointment: Cita) => void;
    onCancel: () => void;
    appointment: Cita | null;
    selectedDate: Date | null;
    clientId: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    category: category[];
    config: CalendarConfig;
    specialDates: SpecialDate[];
    isSubmitting?: boolean;
    slotUrl: string;
}

export function AppointmentForm({
    onSave,
    onCancel,
    appointment,
    selectedDate,
    clientId,
    clientName,
    clientPhone,
    clientEmail,
    category,
    config,
    specialDates,
    isSubmitting,
    slotUrl,
}: AppointmentFormProps) {
    const [formData, setFormData] = useState<Cita>({
        appointment_id: '',
        service_id: '',
        title: '',
        start_time: new Date(),
        end_time: new Date(new Date().getTime() + 60 * 60 * 1000),
        status: 'pendiente',
        payment_type: '',
        client_name: clientName || '',
        client_phone: clientPhone || '',
        client_email: clientEmail || '',
    });

    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [step, setStep] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Añadir estos nuevos estados para los slots disponibles
    const { availableSlots, loading: loadingSlots, loadAvailableSlots } = useAvailableSlots(config?.user_id);
    useEffect(() => {
        const currentTime = new Date();

        if (appointment) {
            // Asegurar que appointment tiene start_time y end_time válidos
            if (!appointment.start_time) appointment.start_time = currentTime;
            if (!appointment.end_time) appointment.end_time = new Date(currentTime.getTime() + 60 * 60 * 1000);
            setFormData(appointment);

            // Encontrar la categoría del servicio seleccionado
            for (const cat of category) {
                if (cat.services.some((service) => service.service_id === appointment.service_id)) {
                    setSelectedCategory(cat.name);
                    break;
                }
            }

            // Si es una edición, mostrar todos los pasos
            setStep(3);
        } else if (selectedDate) {
            const startTime = new Date(selectedDate);
            const endTime = new Date(startTime);
            endTime.setHours(startTime.getHours() + 1);
            setFormData({
                appointment_id: '',
                service_id: '',
                title: clientName ? `Cita de ${clientName}` : 'Nueva cita',
                start_time: startTime,
                end_time: endTime,
                status: 'pendiente',
                payment_type: '',
                client_name: clientName || '',
                client_id: clientId || '',
                client_phone: clientPhone || '',
                client_email: clientEmail || '',
            });
        } else {
            const startTime = new Date();
            const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

            setFormData({
                appointment_id: '',
                service_id: '',
                title: '',
                start_time: startTime,
                end_time: endTime,
                status: 'pendiente',
                payment_type: '',
                client_name: clientName || '',
                client_phone: clientPhone || '',
                client_email: clientEmail || '',
            });
        }
    }, [appointment, selectedDate, clientName, clientId, clientPhone, clientEmail, category]);
    // Función de utilidad para obtener la duración del servicio

    // Cargar slots disponibles cuando cambia la fecha
    useEffect(() => {
        if (formData.start_time) {
            loadAvailableSlots(formData.start_time);
        }
    }, [formData.start_time]);

    const handleDateChange = (date: Date | undefined) => {
        if (!date) return;

        // Crear nueva fecha preservando la hora actual
        const currentHours = formData.start_time.getHours();
        const currentMinutes = formData.start_time.getMinutes();

        const newDate = new Date(date);
        // Mantener la hora actual
        newDate.setHours(currentHours, currentMinutes, 0, 0);

        // Obtener la duración del servicio seleccionado
        const serviceDuration = getServiceDuration(formData.service_id, category);

        // Calcular nueva hora de finalización
        const newEndDate = addMinutes(newDate, serviceDuration);

        setFormData({
            ...formData,
            start_time: newDate,
            end_time: newEndDate,
        });

        // Cargar slots disponibles para la nueva fecha
        loadAvailableSlots(newDate);
    };

    const handleTimeChange = (newDate: Date) => {
        // Calcular la duración del servicio y la hora de fin
        const serviceDuration = getServiceDuration(formData.service_id, category);
        const newEndDate = addMinutes(newDate, serviceDuration);

        // Verificar si está dentro del horario laboral
        const endTimeResult = isTimeWithinBusinessHours(newEndDate, config);
        if (!endTimeResult.isWithin) {
            toast.warning('La cita excede el horario laboral', {
                description: endTimeResult.errorMessage,
                duration: 3000,
            });
        }

        setFormData({
            ...formData,
            start_time: newDate,
            end_time: newEndDate,
        });
    };

    const handleSelectChange = (type: 'service' | 'payment' | 'category', value: string) => {
        if (type === 'category') {
            setSelectedCategory(value);
            return;
        }

        if (type === 'payment') {
            if (value === 'tarjeta' || value === 'efectivo') {
                setFormData({
                    ...formData,
                    payment_type: value,
                });
            }
            return;
        }

        // Variables para almacenar información del servicio
        let serviceName = '';
        let categoryName = '';
        let serviceDuration = 60;

        // Buscar el servicio seleccionado
        for (const cat of category) {
            const foundService = cat.services.find((service) => service.service_id === value);

            if (foundService) {
                serviceName = foundService.name;
                categoryName = cat.name;

                // Asegurarse de que la duración es un número
                serviceDuration =
                    typeof foundService.duration === 'number' ? foundService.duration : Number.parseInt(String(foundService.duration), 10);
                break;
            }
        }

        // Calcular la hora de fin con la duración exacta del servicio
        const newEndDate = addMinutes(formData.start_time, serviceDuration);

        setFormData({
            ...formData,
            service_id: value,
            title: `${serviceName} de ${clientName || 'Cliente'}`,
            end_time: newEndDate,
        });

        // Actualizar la categoría seleccionada
        setSelectedCategory(categoryName);
    };

    const handleSlotSelect = (startTime: string, endTime: string) => {
        const [startHour, startMinute] = startTime.split(':').map((n) => Number.parseInt(n));
        const newDate = new Date(formData.start_time);
        newDate.setHours(startHour, startMinute, 0, 0);

        // Usar handleTimeChange existente
        handleTimeChange(newDate);
    };

    const handleSubmit = () => {
        setIsLoading(true);

        // Verificación más robusta al inicio de la función
        if (!formData || !formData.start_time || !formData.end_time) {
            toast.error('Error en los datos de la cita', {
                description: 'La información de la cita está incompleta',
                duration: 3000,
            });
            setIsLoading(false);
            return;
        }

        // 1. Validar campos obligatorios
        const hasErrors =
            !formData.title ||
            !formData.service_id ||
            !formData.payment_type ||
            !formData.client_name ||
            !formData.client_email ||
            !formData.client_phone;
        !formData.title && toast.error('El título es obligatorio');
        !formData.service_id && toast.error('Debe seleccionar un servicio');
        !formData.payment_type && toast.error('Debe seleccionar una forma de pago');
        !formData.client_name && toast.error('Debe ingresar su nombre');
        !formData.client_email && toast.error('Debe ingresar su correo electrónico');
        !formData.client_phone && toast.error('Debe ingresar su número de teléfono');

        if (hasErrors) {
            setIsLoading(false);
            return;
        }

        // Validar disponibilidad de fecha
        const dateResult = isDateAvailable(formData.start_time, config, specialDates);
        if (!dateResult.isAvailable) {
            toast.error('Fecha no disponible', {
                description: dateResult.errorMessage,
                duration: 3000,
            });
            setIsLoading(false);
            return;
        }
        // Validar horario laboral
        const timeResult = isTimeWithinBusinessHours(formData.start_time, config);
        if (!timeResult.isWithin) {
            toast.error('Horario no disponible', {
                description: timeResult.errorMessage,
                duration: 3000,
            });
            setIsLoading(false);
            return;
        }

        // Verificar si la cita termina después del horario laboral
        const endTimeResult = isTimeWithinBusinessHours(formData.end_time, config);
        if (!endTimeResult.isWithin) {
            toast.warning('La cita excede el horario laboral', {
                description: 'La hora de finalización queda fuera del horario configurado.',
                duration: 3000,
            });
        }

        // Continuar con la lógica existente si pasa todas las validaciones
        setTimeout(() => {
            onSave(formData);
            setIsLoading(false);
        }, 500);
    };

    const nextStep = () => {
        if (step === 0) {
            if (!formData.client_name) {
                toast.error('Debe ingresar su nombre para continuar');
                return;
            }
            if (!formData.client_email) {
                toast.error('Debe ingresar su correo electrónico para continuar');
                return;
            }
            if (!formData.client_phone) {
                toast.error('Debe ingresar su número de teléfono para continuar');
                return;
            }
        }

        if (step === 1 && !formData.service_id) {
            toast.error('Debe seleccionar un servicio para continuar');
            return;
        }

        if (step === 2) {
            // Usar la utilidad para validar horario
            const timeResult = isTimeWithinBusinessHours(formData.start_time, config);
            if (!timeResult.isWithin) {
                toast.error('Horario no disponible', {
                    description: timeResult.errorMessage,
                    duration: 3000,
                });
                return;
            }
        }

        setStep((prev) => Math.min(prev + 1, 3));
    };
    const prevStep = () => {
        setStep((prev) => Math.max(prev - 1, 0));
    };

    return (
        <Card className="w-full border-0 shadow-lg">
            <CardHeader className="from-primary/90 to-primary text-primary-foreground border-0 bg-gradient-to-r">
                <CardTitle className="text-xl font-bold">{appointment ? 'Editar cita' : 'Nueva cita'}</CardTitle>
                {clientName && <p className="text-sm opacity-90">Cliente: {clientName}</p>}
            </CardHeader>

            <CardContent className="p-6">
                {/* Indicador de pasos */}
                <div className="mb-6 flex justify-between">
                    <div className={`flex flex-col items-center ${step >= 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                        <div
                            className={`mb-1 flex h-8 w-8 items-center justify-center rounded-full ${step >= 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                        >
                            1
                        </div>
                        <span className="text-xs">Datos</span>
                    </div>
                    <div className="mx-2 flex grow items-center">
                        <div className={`h-0.5 w-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`}></div>
                    </div>
                    <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                        <div
                            className={`mb-1 flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                        >
                            2
                        </div>
                        <span className="text-xs">Servicio</span>
                    </div>
                    <div className="mx-2 flex grow items-center">
                        <div className={`h-0.5 w-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
                    </div>
                    <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                        <div
                            className={`mb-1 flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                        >
                            3
                        </div>
                        <span className="text-xs">Fecha/Hora</span>
                    </div>
                    <div className="mx-2 flex grow items-center">
                        <div className={`h-0.5 w-full ${step >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
                    </div>
                    <div className={`flex flex-col items-center ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                        <div
                            className={`mb-1 flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                        >
                            4
                        </div>
                        <span className="text-xs">Confirmar</span>
                    </div>
                </div>

                {/* Paso 0: Información del usuario */}
                {step === 0 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="client_name" className="text-sm font-medium">
                                Nombre completo
                            </Label>
                            <Input
                                id="client_name"
                                value={formData.client_name || ''}
                                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                placeholder="Ingrese su nombre completo"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="client_email" className="text-sm font-medium">
                                Correo electrónico
                            </Label>
                            <Input
                                id="client_email"
                                type="email"
                                value={formData.client_email || ''}
                                onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                                placeholder="ejemplo@correo.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="client_phone" className="text-sm font-medium">
                                Número de teléfono
                            </Label>
                            <Input
                                id="client_phone"
                                value={formData.client_phone || ''}
                                onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                                placeholder="Ej: 555-123-4567"
                                required
                            />
                        </div>
                    </div>
                )}

                {/* Paso 1: Selección de servicio */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-sm font-medium">
                                Categoría de servicio
                            </Label>
                            <Select value={selectedCategory} onValueChange={(value) => handleSelectChange('category', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecciona una categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {category.map((cat) => (
                                        <SelectItem key={cat.name} value={cat.name}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="service" className="text-sm font-medium">
                                Servicio
                            </Label>
                            <Select value={formData.service_id} onValueChange={(value) => handleSelectChange('service', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecciona un servicio" />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedCategory
                                        ? category
                                              .find((cat) => cat.name === selectedCategory)
                                              ?.services.map((service) => (
                                                  <SelectItem key={service.service_id} value={service.service_id}>
                                                      <div className="flex w-full justify-between">
                                                          <span>{service.name}</span>
                                                          <span className="text-muted-foreground">
                                                              ${service.price} - {service.duration}min
                                                          </span>
                                                      </div>
                                                  </SelectItem>
                                              ))
                                        : category.map((cat) => (
                                              <div key={cat.name} className="pb-1">
                                                  <div className="bg-muted/50 px-2 py-1.5 text-sm font-semibold">{cat.name}</div>
                                                  {cat.services.map((service) => (
                                                      <SelectItem key={service.service_id} value={service.service_id}>
                                                          <div className="flex w-full justify-between">
                                                              <span>{service.name}</span>
                                                              <span className="text-muted-foreground">
                                                                  ${service.price} - {service.duration}min
                                                              </span>
                                                          </div>
                                                      </SelectItem>
                                                  ))}
                                              </div>
                                          ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.service_id && (
                            <div className="bg-muted/30 mt-4 rounded-lg p-3">
                                <div className="text-sm font-medium">Servicio seleccionado:</div>
                                <div className="mt-1 flex justify-between">
                                    <span>{getServiceName(formData.service_id, category)}</span>
                                    <span className="font-medium">${getServicePrice(formData.service_id, category)}</span>
                                </div>
                                <div className="text-muted-foreground mt-1 text-xs">
                                    Duración: {getServiceDuration(formData.service_id, category)} minutos
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Paso 2: Selección de fecha y hora */}
                {step === 2 && (
                    <div className="space-y-4">
                        <DateTimePicker
                            date={formData.start_time}
                            onDateChange={(newDate) => {
                                // Mantener la misma hora al cambiar la fecha
                                const updatedDate = new Date(newDate);
                                const serviceDuration = getServiceDuration(formData.service_id, category);
                                const newEndDate = addMinutes(updatedDate, serviceDuration);

                                setFormData({
                                    ...formData,
                                    start_time: updatedDate,
                                    end_time: newEndDate,
                                });

                                loadAvailableSlots(updatedDate);
                            }}
                            onTimeChange={(newTime) => {
                                // Actualizar hora manteniendo la misma fecha
                                const serviceDuration = getServiceDuration(formData.service_id, category);
                                const newEndDate = addMinutes(newTime, serviceDuration);

                                setFormData({
                                    ...formData,
                                    start_time: newTime,
                                    end_time: newEndDate,
                                });
                            }}
                            userId={config?.user_id}
                            config={config}
                            specialDates={specialDates}
                            slotUrl={slotUrl}
                            label="Fecha y hora de la cita"
                        />{' '}
                        {formData.service_id && (
                            <div className="bg-muted/30 mt-4 rounded-lg p-3">
                                <div className="text-sm font-medium">Resumen de la cita:</div>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    <div className="text-xs">
                                        <span className="text-muted-foreground">Servicio:</span>
                                        <div className="font-medium">{getServiceName(formData.service_id, category)}</div>
                                    </div>
                                    <div className="text-xs">
                                        <span className="text-muted-foreground">Precio:</span>
                                        <div className="font-medium">${getServicePrice(formData.service_id, category)}</div>
                                    </div>
                                    <div className="text-xs">
                                        <span className="text-muted-foreground">Duración:</span>
                                        <div className="font-medium">{getServiceDuration(formData.service_id, category)} minutos</div>
                                    </div>
                                    <div className="text-xs">
                                        <span className="text-muted-foreground">Fecha:</span>
                                        <div className="font-medium">{formatForDisplay(formData.start_time)}</div>
                                    </div>
                                    <div className="text-xs">
                                        <span className="text-muted-foreground">Hora:</span>
                                        <div className="font-medium">{formatTimeRange(formData.start_time, formData.end_time)}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Paso 3: Confirmación y pago */}
                {step === 3 && (
                    <div className="space-y-4">
                        <div className="bg-muted/30 rounded-lg p-4">
                            <h3 className="mb-3 text-lg font-medium">Resumen de la cita</h3>
                            {(() => {
                                const serviceInfo = getServiceInfo(formData.service_id, category);
                                return (
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Servicio:</span>
                                            <span className="font-medium">{serviceInfo.name}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Fecha:</span>
                                            <span className="font-medium">{formatForDisplay(formData.start_time)}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Hora:</span>
                                            <span className="font-medium">{formatTimeRange(formData.start_time, formData.end_time)}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Duración:</span>
                                            <span className="font-medium">{serviceInfo.duration} minutos</span>
                                        </div>

                                        <Separator />

                                        <div className="flex justify-between text-lg">
                                            <span className="font-medium">Total:</span>
                                            <span className="font-bold">${serviceInfo.price}</span>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="payment-type" className="text-sm font-medium">
                                Forma de pago
                            </Label>
                            <div className="mt-1 grid grid-cols-2 gap-3">
                                <div
                                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors ${formData.payment_type === 'tarjeta' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                                    onClick={() => handleSelectChange('payment', 'tarjeta')}
                                >
                                    <CreditCard className="text-primary h-5 w-5" />
                                    <span>Tarjeta</span>
                                    {formData.payment_type === 'tarjeta' && <CheckCircle2 className="text-primary ml-auto h-4 w-4" />}
                                </div>

                                <div
                                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors ${formData.payment_type === 'efectivo' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                                    onClick={() => handleSelectChange('payment', 'efectivo')}
                                >
                                    <Banknote className="text-primary h-5 w-5" />
                                    <span>Efectivo</span>
                                    {formData.payment_type === 'efectivo' && <CheckCircle2 className="text-primary ml-auto h-4 w-4" />}
                                </div>
                            </div>
                        </div>

                        {!clientName && (
                            <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-blue-700">
                                <Info className="mt-0.5 h-5 w-5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium">Información del cliente</p>
                                    <p className="text-xs">Nombre: {formData.client_name}</p>
                                    <p className="text-xs">Email: {formData.client_email}</p>
                                    <p className="text-xs">Teléfono: {formData.client_phone}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between p-6 pt-0">
                {step > 0 ? (
                    <Button variant="outline" onClick={prevStep}>
                        Atrás
                    </Button>
                ) : (
                    <Button variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>
                )}

                {step < 3 ? (
                    <Button onClick={nextStep}>Continuar</Button>
                ) : (
                    <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <span className="mr-2 animate-spin">⏳</span>
                                Guardando...
                            </>
                        ) : (
                            'Guardar Cita'
                        )}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
