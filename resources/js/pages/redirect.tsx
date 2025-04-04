import { useEffect, useState } from "react"
import { useSubscriptionWebhook } from "@/hooks/use-suscription-webhook"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function PaymentCallback() {
    const { isProcessing, success, error, subscriptionData, redirectToDashboard } = useSubscriptionWebhook()
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        if (success) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        redirectToDashboard()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)

            return () => clearInterval(timer)
        }
    }, [success, redirectToDashboard])

    return (
        <div className="w-full flex items-center justify-center min-h-[80vh] py-8">
            <Card className="w-full max-w-md border-0 shadow-lg">
                <CardHeader className="pb-4 space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Estado de su suscripción</CardTitle>
                </CardHeader>
                <CardContent>
                    {isProcessing && (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                            <div className="relative">
                                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-10 h-10 bg-background rounded-full" />
                                </div>
                            </div>
                            <p className="text-lg text-center text-muted-foreground">Verificando el estado de su pago...</p>
                        </div>
                    )}

                    {error && (
                        <div className="overflow-hidden rounded-lg">
                            <div className="bg-destructive/10 p-6 flex flex-col items-center space-y-4">
                                <div className="rounded-full bg-destructive/15 p-3">
                                    <AlertCircle className="h-8 w-8 text-destructive" />
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="font-bold text-lg text-destructive">Error en el proceso de pago</h3>
                                    <p className="text-destructive/90">{error.message}</p>
                                    {error.details && <p className="text-sm text-destructive/80">{error.details}</p>}
                                </div>
                                <Button onClick={() => redirectToDashboard()} variant="destructive" className="mt-2">
                                    Volver al dashboard
                                </Button>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="overflow-hidden rounded-lg">
                            <div className="bg-green-50 dark:bg-green-950/20 p-6 flex flex-col items-center space-y-4">
                                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="font-bold text-lg text-green-700 dark:text-green-500">¡Suscripción exitosa!</h3>
                                    <p className="text-green-700 dark:text-green-400">Su suscripción ha sido procesada correctamente.</p>
                                </div>

                                {subscriptionData?.subscription && (
                                    <div className="w-full bg-white dark:bg-gray-800 rounded-lg p-4 mt-2">
                                        <p className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Detalles de su plan:</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Plan:</span>
                                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                                    {subscriptionData.subscription.plan_name}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Válido hasta:</span>
                                                <span className="text-sm font-medium">
                                                    {format(new Date(subscriptionData.subscription.valid_until), "PPP", { locale: es })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="text-center mt-4">
                                    <p className="text-sm text-green-700/70 dark:text-green-400/70">
                                        Será redirigido al dashboard en <span className="font-bold">{countdown}</span> segundos...
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default PaymentCallback

