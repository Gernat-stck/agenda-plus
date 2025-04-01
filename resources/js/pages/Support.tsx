
import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    AlertCircle,
    CheckCircle2,
    HelpCircle,
    Bug,
    AlertTriangle,
    Lightbulb,
    Send,
    User,
    Mail,
    Phone,
    MessageSquare,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { BreadcrumbItem } from "../types"
import AppLayout from "../layouts/app-layout"
import axios from "axios"
import { toast } from "sonner"
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Support',
        href: '/support',
    },
];
export default function CustomerServiceForm() {
    const [formData, setFormData] = useState({
        requestType: "",
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    })

    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        error: false,
        message: "",
    })

    const [step, setStep] = useState(1)
    const totalSteps = 3

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({ ...prev, requestType: value }))
    }

    const nextStep = () => {
        if (step < totalSteps) {
            setStep(step + 1)
        }
    }

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1)
        }
    }

    const getRequestTypeIcon = (type: string) => {
        switch (type) {
            case "consulta":
                return <HelpCircle className="h-5 w-5 text-blue-500" />
            case "reporte":
                return <Bug className="h-5 w-5 text-red-500" />
            case "reclamo":
                return <AlertTriangle className="h-5 w-5 text-amber-500" />
            case "sugerencia":
                return <Lightbulb className="h-5 w-5 text-green-500" />
            default:
                return null
        }
    }

    // Reemplazar en resources/js/pages/Support.tsx
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus({ submitted: false, submitting: true, error: false, message: "" })

        try {
            // Usar el endpoint de nuestra aplicación
            await axios.post(route("support.send"), formData);
            toast.success("¡Mensaje enviado con éxito!")
            setStatus({ submitted: true, submitting: false, error: false, message: "Tu mensaje ha sido enviado con éxito. Nos pondremos en contacto contigo pronto." })
            setStep(1)
        } catch (error) {
            setStatus({
                submitted: false,
                submitting: false,
                error: true,
                message: error instanceof Error ? error.message : "Ocurrió un error al enviar el formulario.",
            })
        }
    }
    const isStepValid = () => {
        if (step === 1) {
            return !!formData.requestType
        } else if (step === 2) {
            return !!formData.name && !!formData.email
        }
        return true
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>

            <Card className="w-full max-w-3xl m-auto border shadow-none  ">
                <CardHeader className="bg-muted/50">
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <MessageSquare className="h-6 w-6 text-primary" />
                        Atención al Cliente
                    </CardTitle>
                    <CardDescription>
                        Completa el formulario para enviarnos tu consulta, reporte, reclamo o sugerencia.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {status.submitted ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                            <div className="rounded-full bg-green-100 p-3">
                                <CheckCircle2 className="h-10 w-10 text-green-600" />
                            </div>
                            <h3 className="text-xl font-medium text-green-800">¡Enviado con éxito!</h3>
                            <p className="text-green-700 max-w-md">{status.message}</p>
                            <Button
                                variant="outline"
                                onClick={() => setStatus((prev) => ({ ...prev, submitted: false }))}
                                className="mt-4"
                            >
                                Enviar otra solicitud
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8">
                                <div className="flex justify-between mb-2 text-sm">
                                    <span>
                                        Paso {step} de {totalSteps}
                                    </span>
                                    <span>{Math.round((step / totalSteps) * 100)}%</span>
                                </div>
                                <Progress value={(step / totalSteps) * 100} className="h-2 [&>div]:!bg-gradient-to-r [&>div]:!from-purple-500 [&>div]:!to-pink-500"
                                />
                            </div>

                            {status.error && (
                                <Alert variant="destructive" className="mb-6">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{status.message}</AlertDescription>
                                </Alert>
                            )}

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    if (step === totalSteps) handleSubmit(e)
                                    else nextStep()
                                }}
                                className="space-y-6"
                            >
                                {step === 1 && (
                                    <div className="space-y-4 animate-in fade-in duration-300">
                                        <div className="space-y-2">
                                            <Label htmlFor="requestType" className="text-base">
                                                ¿En qué podemos ayudarte?
                                            </Label>
                                            <Select value={formData.requestType} onValueChange={handleSelectChange} required>
                                                <SelectTrigger id="requestType" className="h-14">
                                                    <SelectValue placeholder="Selecciona una opción" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="consulta" className="flex items-center h-12">
                                                        <div className="flex items-center gap-2">
                                                            <HelpCircle className="h-5 w-5 text-blue-500" />
                                                            <span>Consulta</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="reporte" className="flex items-center h-12">
                                                        <div className="flex items-center gap-2">
                                                            <Bug className="h-5 w-5 text-red-500" />
                                                            <span>Reporte de errores o fallos</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="reclamo" className="flex items-center h-12">
                                                        <div className="flex items-center gap-2">
                                                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                                                            <span>Reclamo</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="sugerencia" className="flex items-center h-12">
                                                        <div className="flex items-center gap-2">
                                                            <Lightbulb className="h-5 w-5 text-green-500" />
                                                            <span>Sugerencia</span>
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {formData.requestType && (
                                            <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-3 animate-in fade-in duration-300">
                                                {getRequestTypeIcon(formData.requestType)}
                                                <div>
                                                    <h3 className="font-medium mb-1">
                                                        {formData.requestType === "consulta" && "Consulta"}
                                                        {formData.requestType === "reporte" && "Reporte de errores o fallos"}
                                                        {formData.requestType === "reclamo" && "Reclamo"}
                                                        {formData.requestType === "sugerencia" && "Sugerencia"}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formData.requestType === "consulta" &&
                                                            "Responderemos a tus dudas sobre nuestros productos o servicios."}
                                                        {formData.requestType === "reporte" &&
                                                            "Ayúdanos a mejorar reportando cualquier error o fallo que hayas encontrado."}
                                                        {formData.requestType === "reclamo" &&
                                                            "Lamentamos los inconvenientes. Cuéntanos tu problema para poder solucionarlo."}
                                                        {formData.requestType === "sugerencia" &&
                                                            "Tus ideas son valiosas. Comparte cómo podemos mejorar nuestros servicios."}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-6 animate-in fade-in duration-300">
                                        <h3 className="text-lg font-medium">Tus datos de contacto</h3>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    Nombre completo
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Tu nombre"
                                                    className="h-12"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    Correo electrónico
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="tu@correo.com"
                                                    className="h-12"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                                    Teléfono (opcional)
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="Tu número de teléfono"
                                                    className="h-12"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-6 animate-in fade-in duration-300">
                                        <h3 className="text-lg font-medium">Detalles de tu {formData.requestType}</h3>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="subject">Asunto</Label>
                                                <Input
                                                    id="subject"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    placeholder="Asunto de tu mensaje"
                                                    className="h-12"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="message">Mensaje</Label>
                                                <Textarea
                                                    id="message"
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    placeholder="Describe tu consulta, reporte, reclamo o sugerencia en detalle"
                                                    className="min-h-[150px]"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </>
                    )}
                </CardContent>

                {!status.submitted && (
                    <CardFooter className="flex flex-col sm:flex-row gap-3 border-t p-4">
                        {step > 1 && (
                            <Button variant="outline" onClick={prevStep} className="w-full sm:w-auto">
                                Anterior
                            </Button>
                        )}

                        <Button
                            onClick={step === totalSteps ? handleSubmit : nextStep}
                            disabled={status.submitting || !isStepValid()}
                            className={`w-full sm:w-auto ${step === 1 ? "sm:ml-auto" : ""} ${step === totalSteps ? "bg-green-600 hover:bg-green-700" : ""}`}
                        >
                            {status.submitting ? (
                                "Enviando..."
                            ) : step === totalSteps ? (
                                <span className="flex items-center gap-2">
                                    <Send className="h-4 w-4" />
                                    Enviar mensaje
                                </span>
                            ) : (
                                "Siguiente"
                            )}
                        </Button>
                    </CardFooter>
                )
                }
            </Card >
        </AppLayout >
    )
}

