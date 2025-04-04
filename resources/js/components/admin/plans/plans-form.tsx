import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Plan, PlanFeature } from '@/types/pricing';
import { useForm } from '@inertiajs/react';
import { BarChart, Check, Code, Download, Grip, Headphones, Mail, Plus, Server, Trash, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Iconos disponibles para las características
const availableIcons = [
    { name: 'users', icon: Users },
    { name: 'headphones', icon: Headphones },
    { name: 'bar-chart', icon: BarChart },
    { name: 'download', icon: Download },
    { name: 'code', icon: Code },
    { name: 'server', icon: Server },
    { name: 'mail', icon: Mail },
];

// Modificar la definición de la función para aceptar un plan completo
export function PlanForm({ plan: initialPlan }: { plan?: Plan | null }) {
    // Estados locales para el preview y la insignia
    const [hasBadge, setHasBadge] = useState(false);

    // Configuración de useForm
    const {
        data: plan,
        setData: setPlan,
        post,
        patch,
        processing,
        errors,
        reset,
    } = useForm<Plan>({
        id: 0,
        buttonText: 'Comenzar ahora',
        buttonVariant: 'default' as const,
        title: '',
        description: '',
        price: '',
        period: 'mes',
        features: [{ included: true, text: '', icon: 'users' }],
        highlight: false,
        badge: undefined,
    });

    // Modificar el useEffect para transformar correctamente las características
    useEffect(() => {
        if (initialPlan) {
            // Transformar las características del backend al formato del formulario
            const formattedPlan = {
                ...initialPlan,
                features: initialPlan.features.map((feature) => ({
                    included: feature.included !== undefined ? feature.included : true,
                    text: feature.text || '',
                    icon: feature.icon || 'users',
                })),
            };

            setPlan(formattedPlan);
            setHasBadge(!!initialPlan.badge);
        }
    }, [initialPlan]);

    const handleFeatureChange = (index: number, field: keyof PlanFeature, value: any) => {
        const updatedFeatures = [...plan.features];
        updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
        setPlan({ ...plan, features: updatedFeatures });
    };

    const addFeature = () => {
        setPlan({
            ...plan,
            features: [...plan.features, { included: true, text: '', icon: 'users' }],
        });
    };

    const removeFeature = (index: number) => {
        const updatedFeatures = [...plan.features];
        updatedFeatures.splice(index, 1);
        setPlan({ ...plan, features: updatedFeatures });
    };

    // Función para manejar el envío del formulario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (initialPlan) {
            // Actualizar plan existente
            patch(route('admin.plans.update', initialPlan.id), {
                onSuccess: () => {
                    toast.success('Plan actualizado correctamente');
                },
            });
        } else {
            // Crear nuevo plan
            post(route('admin.plans.store'), {
                onSuccess: () => {
                    reset(); // Limpiar el formulario después de crear
                },
            });
        }
    };

    const getIconComponent = (iconName?: string) => {
        const iconItem = availableIcons.find((i) => i.name === iconName);
        if (iconItem) {
            const IconComponent = iconItem.icon;
            return <IconComponent className="h-4 w-4" />;
        }
        return <Users className="h-4 w-4" />;
    };

    return (
        <Tabs defaultValue="edit" className="w-full">
            <TabsList className="mb-4">
                <TabsTrigger value="edit">Editar</TabsTrigger>
                <TabsTrigger value="preview">Vista previa</TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Información básica</CardTitle>
                        <CardDescription>Configura la información principal del plan</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Nombre del plan</Label>
                                <Input
                                    id="title"
                                    value={plan.title}
                                    onChange={(e) => setPlan({ ...plan, title: e.target.value })}
                                    placeholder="Ej: Pro, Basic, Enterprise"
                                />
                                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Precio</Label>
                                <Input
                                    id="price"
                                    value={plan.price}
                                    onChange={(e) => setPlan({ ...plan, price: e.target.value })}
                                    placeholder="Ej: 19.99"
                                    type="number"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="period">Periodo</Label>
                                <Select value={plan.period} onValueChange={(value) => setPlan({ ...plan, period: value })}>
                                    <SelectTrigger id="period">
                                        <SelectValue placeholder="Selecciona un periodo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mes">Mensual</SelectItem>
                                        <SelectItem value="año">Anual</SelectItem>
                                        <SelectItem value="día">Diario</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="buttonText">Texto del botón</Label>
                                <Input
                                    id="buttonText"
                                    value={plan.buttonText}
                                    onChange={(e) => setPlan({ ...plan, buttonText: e.target.value })}
                                    placeholder="Ej: Comenzar ahora"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                value={plan.description}
                                onChange={(e) => setPlan({ ...plan, description: e.target.value })}
                                placeholder="Describe brevemente el plan"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="highlight"
                                    checked={plan.highlight || false}
                                    onCheckedChange={(checked) => setPlan({ ...plan, highlight: checked })}
                                />
                                <Label htmlFor="highlight">Destacar este plan</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="hasBadge"
                                    checked={hasBadge}
                                    onCheckedChange={(checked) => {
                                        setHasBadge(checked);
                                        if (!checked) {
                                            setPlan({ ...plan, badge: undefined });
                                        } else {
                                            setPlan({ ...plan, badge: { text: 'Popular', variant: 'default' } });
                                        }
                                    }}
                                />
                                <Label htmlFor="hasBadge">Añadir insignia</Label>
                            </div>
                        </div>

                        {hasBadge && (
                            <div className="grid grid-cols-1 gap-4 rounded-md border p-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="badgeText">Texto de la insignia</Label>
                                    <Input
                                        id="badgeText"
                                        value={plan.badge?.text || ''}
                                        onChange={(e) =>
                                            setPlan({
                                                ...plan,
                                                badge: { ...plan.badge!, text: e.target.value },
                                            })
                                        }
                                        placeholder="Ej: Popular, Nuevo"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="badgeVariant">Estilo de la insignia</Label>
                                    <Select
                                        value={plan.badge?.variant || 'default'}
                                        onValueChange={(value: 'default' | 'secondary') =>
                                            setPlan({
                                                ...plan,
                                                badge: { ...plan.badge!, variant: value },
                                            })
                                        }
                                    >
                                        <SelectTrigger id="badgeVariant">
                                            <SelectValue placeholder="Selecciona un estilo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="primary">Primario</SelectItem>
                                            <SelectItem value="secondary">Secundario</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="buttonVariant">Estilo del botón</Label>
                            <Select
                                value={plan.buttonVariant}
                                onValueChange={(value: 'default' | 'outline') => setPlan({ ...plan, buttonVariant: value })}
                            >
                                <SelectTrigger id="buttonVariant">
                                    <SelectValue placeholder="Selecciona un estilo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Primario</SelectItem>
                                    <SelectItem value="outline">Contorno</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="paymentWidget">URL de pago (Wompi)</Label>
                            <Input
                                id="paymentWidget"
                                value={plan.paymentWidget || ''}
                                onChange={(e) => setPlan({ ...plan, paymentWidget: e.target.value })}
                                placeholder="Ej: https://u.wompi.sv/235192psZ"
                            />
                            <p className="text-xs text-gray-500">Ingresa la URL única de pago para este plan</p>
                            {errors.paymentWidget && <p className="text-sm text-red-500">{errors.paymentWidget}</p>}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Características</CardTitle>
                        <CardDescription>Añade las características incluidas en este plan</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 rounded-md border p-2">
                                <Grip className="text-muted-foreground h-4 w-4" />
                                <div className="grid flex-1 grid-cols-1 gap-2 md:grid-cols-3">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            id={`feature-${index}-included`}
                                            checked={feature.included}
                                            onCheckedChange={(checked) => handleFeatureChange(index, 'included', checked)}
                                        />
                                        <Label htmlFor={`feature-${index}-included`}>{feature.included ? 'Incluido' : 'No incluido'}</Label>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Input
                                            value={feature.text}
                                            onChange={(e) => handleFeatureChange(index, 'text', e.target.value)}
                                            placeholder="Descripción de la característica"
                                        />
                                    </div>
                                </div>
                                <Select value={feature.icon || 'users'} onValueChange={(value) => handleFeatureChange(index, 'icon', value)}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Icono" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableIcons.map((icon) => (
                                            <SelectItem key={icon.name} value={icon.name}>
                                                <div className="flex items-center gap-2">
                                                    {React.createElement(icon.icon, { className: 'h-4 w-4' })}
                                                    <span className="capitalize">{icon.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button variant="ghost" size="icon" onClick={() => removeFeature(index)} disabled={plan.features.length <= 1}>
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}

                        <Button variant="outline" onClick={addFeature} className="w-full">
                            <Plus className="mr-2 h-4 w-4" />
                            Añadir característica
                        </Button>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" type="button" disabled={processing}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={processing}>
                        {processing ? (
                            <span className="flex items-center">
                                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Procesando...
                            </span>
                        ) : initialPlan ? (
                            'Actualizar Plan'
                        ) : (
                            'Guardar Plan'
                        )}
                    </Button>
                </div>
            </TabsContent>

            <TabsContent value="preview">
                <div className="bg-muted/20 flex justify-center rounded-lg p-6">
                    <Card className={`w-full max-w-sm ${plan.highlight ? 'border-primary shadow-md' : ''}`}>
                        {plan.badge && (
                            <div className="absolute top-4 right-4">
                                <Badge variant={plan.badge.variant}>{plan.badge.text}</Badge>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle>{plan.title || 'Nombre del Plan'}</CardTitle>
                            <CardDescription>{plan.description || 'Descripción del plan'}</CardDescription>
                            <div className="mt-4">
                                <span className="text-3xl font-bold">{plan.price ? `$${plan.price}` : '$0.00'}</span>
                                <span className="text-muted-foreground">/{plan.period}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button className="w-full" variant={plan.buttonVariant}>
                                {plan.buttonText || 'Comenzar ahora'}
                            </Button>

                            <div className="space-y-2">
                                {plan.features.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <div className="mt-0.5">
                                            {feature.included ? (
                                                <div className="bg-primary/20 rounded-full p-1">
                                                    <Check className="text-primary h-3 w-3" />
                                                </div>
                                            ) : (
                                                <div className="bg-muted rounded-full p-1">
                                                    <X className="text-muted-foreground h-3 w-3" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {feature.icon && getIconComponent(feature.icon)}
                                            <span className={!feature.included ? 'text-muted-foreground' : ''}>
                                                {feature.text || 'Característica'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
        </Tabs>
    );
}
