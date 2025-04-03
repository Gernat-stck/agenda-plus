import { router, usePage } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

// Tipo para el estado de error
type ErrorState = {
    message: string;
    details?: string;
} | null;

export function useSubscriptionWebhook() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<ErrorState>(null);

    // Usar Inertia para obtener los parámetros de la URL
    const { props } = usePage();
    const { url } = props as unknown as { url: URL };

    // Analizar los parámetros de la URL
    const params = new URLSearchParams(window.location.search);

    useEffect(() => {
        const processPayment = async () => {
            // Verificar si hay parámetros en la URL
            if (!params.has('idTransaccion')) return;

            try {
                setIsProcessing(true);

                // Obtener los parámetros de la URL
                const webhookData = {
                    identificadorEnlaceComercio: params.get('identificadorEnlaceComercio'),
                    idTransaccion: params.get('idTransaccion'),
                    idEnlace: params.get('idEnlace'),
                    monto: params.get('monto'),
                    hash: params.get('hash'),
                };

                // Enviar los datos al backend para procesamiento
                const response = await axios.post('subscriptions/process-payment', webhookData);

                setSuccess(true);
                // Opcional: Redirigir después de procesar con éxito usando Inertia
                setTimeout(() => router.visit('/dashboard'), 3000);
            } catch (err) {
                // Manejo de errores mejorado con tipado
                if (axios.isAxiosError(err)) {
                    const axiosError = err as AxiosError<{ message: string }>;
                    setError({
                        message: axiosError.response?.data?.message || 'Error procesando el pago',
                        details: axiosError.message,
                    });
                } else {
                    setError({
                        message: 'Error inesperado procesando el pago',
                        details: err instanceof Error ? err.message : String(err),
                    });
                }
                console.error('Error en proceso de pago:', err);
            } finally {
                setIsProcessing(false);
            }
        };

        processPayment();
    }, [params]);

    return {
        isProcessing,
        success,
        error,
        // Método para redirigir usando Inertia
        redirectToDashboard: () => router.visit('/dashboard'),
    };
}
