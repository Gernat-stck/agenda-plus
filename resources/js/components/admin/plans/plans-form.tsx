import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash, Check, X, Users, Headphones, BarChart, Download, Code, Server, Mail, Grip } from "lucide-react"

// Interfaces proporcionadas por el usuario
interface PlanFeature {
    included: boolean
    text: string
    icon?: string
}

interface Plan {
    id: number
    badge?: { text: string; variant: "secondary" | "default" | "outline" | "destructive" | null | undefined }
    highlight?: boolean
    buttonText: string
    buttonVariant: "default" | "outline"
    title: string
    description: string
    price: string
    period: string
    features: PlanFeature[]
}

// Datos de ejemplo para edición
const planExample: Plan = {
    id: 1,
    badge: { text: "Popular", variant: "default" },
    highlight: true,
    buttonText: "Comenzar ahora",
    buttonVariant: "default",
    title: "Pro",
    description: "Perfecto para negocios en crecimiento",
    price: "19.99",
    period: "mes",
    features: [
        { included: true, text: "Hasta 10 usuarios", icon: "users" },
        { included: true, text: "Soporte prioritario", icon: "headphones" },
        { included: true, text: "Análisis avanzados", icon: "bar-chart" },
        { included: true, text: "Exportación de datos", icon: "download" },
        { included: false, text: "API personalizada", icon: "code" },
    ],
}

// Iconos disponibles para las características
const availableIcons = [
    { name: "users", icon: Users },
    { name: "headphones", icon: Headphones },
    { name: "bar-chart", icon: BarChart },
    { name: "download", icon: Download },
    { name: "code", icon: Code },
    { name: "server", icon: Server },
    { name: "mail", icon: Mail },
]

export function PlanForm({ id }: { id?: string }) {
    const [plan, setPlan] = useState<Plan>({
        id: 0,
        buttonText: "",
        buttonVariant: "default",
        title: "",
        description: "",
        price: "",
        period: "mes",
        features: [],
    })
    const [hasBadge, setHasBadge] = useState(false)
    const [previewMode, setPreviewMode] = useState(false)

    useEffect(() => {
        // Si hay un ID, cargar los datos del plan para edición
        if (id) {
            // En un caso real, aquí se haría una petición a la API
            // Por ahora, usamos datos de ejemplo
            setPlan(planExample)
            setHasBadge(!!planExample.badge)
        } else {
            // Inicializar con un plan vacío para creación
            setPlan({
                id: Math.floor(Math.random() * 1000),
                buttonText: "Comenzar ahora",
                buttonVariant: "default",
                title: "",
                description: "",
                price: "",
                period: "mes",
                features: [{ included: true, text: "", icon: "users" }],
            })
        }
    }, [id])

    const handleFeatureChange = (index: number, field: keyof PlanFeature, value: any) => {
        const updatedFeatures = [...plan.features]
        updatedFeatures[index] = { ...updatedFeatures[index], [field]: value }
        setPlan({ ...plan, features: updatedFeatures })
    }

    const addFeature = () => {
        setPlan({
            ...plan,
            features: [...plan.features, { included: true, text: "", icon: "users" }],
        })
    }

    const removeFeature = (index: number) => {
        const updatedFeatures = [...plan.features]
        updatedFeatures.splice(index, 1)
        setPlan({ ...plan, features: updatedFeatures })
    }

    const getIconComponent = (iconName?: string) => {
        const iconItem = availableIcons.find((i) => i.name === iconName)
        if (iconItem) {
            const IconComponent = iconItem.icon
            return <IconComponent className="h-4 w-4" />
        }
        return <Users className="h-4 w-4" />
    }

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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Nombre del plan</Label>
                                <Input
                                    id="title"
                                    value={plan.title}
                                    onChange={(e) => setPlan({ ...plan, title: e.target.value })}
                                    placeholder="Ej: Pro, Basic, Enterprise"
                                />
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        setHasBadge(checked)
                                        if (!checked) {
                                            setPlan({ ...plan, badge: undefined })
                                        } else {
                                            setPlan({ ...plan, badge: { text: "Popular", variant: "default" } })
                                        }
                                    }}
                                />
                                <Label htmlFor="hasBadge">Añadir insignia</Label>
                            </div>
                        </div>

                        {hasBadge && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md">
                                <div className="space-y-2">
                                    <Label htmlFor="badgeText">Texto de la insignia</Label>
                                    <Input
                                        id="badgeText"
                                        value={plan.badge?.text || ""}
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
                                        value={plan.badge?.variant || "default"}
                                        onValueChange={(value: "default" | "secondary") =>
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
                                onValueChange={(value: "default" | "outline") => setPlan({ ...plan, buttonVariant: value })}
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
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Características</CardTitle>
                        <CardDescription>Añade las características incluidas en este plan</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                                <Grip className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            id={`feature-${index}-included`}
                                            checked={feature.included}
                                            onCheckedChange={(checked) => handleFeatureChange(index, "included", checked)}
                                        />
                                        <Label htmlFor={`feature-${index}-included`}>{feature.included ? "Incluido" : "No incluido"}</Label>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Input
                                            value={feature.text}
                                            onChange={(e) => handleFeatureChange(index, "text", e.target.value)}
                                            placeholder="Descripción de la característica"
                                        />
                                    </div>
                                </div>
                                <Select
                                    value={feature.icon || "users"}
                                    onValueChange={(value) => handleFeatureChange(index, "icon", value)}
                                >
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Icono" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableIcons.map((icon) => (
                                            <SelectItem key={icon.name} value={icon.name}>
                                                <div className="flex items-center gap-2">
                                                    {React.createElement(icon.icon, { className: "h-4 w-4" })}
                                                    <span className="capitalize">{icon.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFeature(index)}
                                    disabled={plan.features.length <= 1}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}

                        <Button variant="outline" onClick={addFeature} className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Añadir característica
                        </Button>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancelar</Button>
                    <Button>Guardar Plan</Button>
                </div>
            </TabsContent>

            <TabsContent value="preview">
                <div className="flex justify-center p-6 bg-muted/20 rounded-lg">
                    <Card className={`w-full max-w-sm ${plan.highlight ? "border-primary shadow-md" : ""}`}>
                        {plan.badge && (
                            <div className="absolute top-4 right-4">
                                <Badge variant={plan.badge.variant}>{plan.badge.text}</Badge>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle>{plan.title || "Nombre del Plan"}</CardTitle>
                            <CardDescription>{plan.description || "Descripción del plan"}</CardDescription>
                            <div className="mt-4">
                                <span className="text-3xl font-bold">{plan.price ? `€${plan.price}` : "€0.00"}</span>
                                <span className="text-muted-foreground">/{plan.period}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button className="w-full" variant={plan.buttonVariant}>
                                {plan.buttonText || "Comenzar ahora"}
                            </Button>

                            <div className="space-y-2">
                                {plan.features.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <div className="mt-0.5">
                                            {feature.included ? (
                                                <div className="rounded-full bg-primary/20 p-1">
                                                    <Check className="h-3 w-3 text-primary" />
                                                </div>
                                            ) : (
                                                <div className="rounded-full bg-muted p-1">
                                                    <X className="h-3 w-3 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {feature.icon && getIconComponent(feature.icon)}
                                            <span className={!feature.included ? "text-muted-foreground" : ""}>
                                                {feature.text || "Característica"}
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
    )
}

