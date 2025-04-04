import { router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

// Tipo para el estado de error
type ErrorState = {
    message: string;
    details?: string;
} | null;

// Respuesta de verificación de suscripción
interface SubscriptionVerificationResponse {
    status: 'active' | 'inactive' | 'pending' | 'error';
    message: string;
    subscription?: {
        plan_name: string;
        valid_until: string;
    };
    details?: string;
}

export function useSubscriptionWebhook() {
    const [isProcessing, setIsProcessing] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<ErrorState>(null);
    const [subscriptionData, setSubscriptionData] = useState<SubscriptionVerificationResponse | null>(null);

    // Obtener parámetros de la URL
    const params = new URLSearchParams(window.location.search);

    useEffect(() => {
        const verifyPaymentAndSubscription = async () => {
            try {
                // Verificar si hay parámetros en la URL
                if (!params.has('idTransaccion') && !params.has('IdTransaccion')) {
                    setError({ message: 'No se detectaron parámetros de transacción en la URL' });
                    setIsProcessing(false);
                    return;
                }

                // Determinar el ID de transacción (compatibilidad con ambos formatos)
                const transactionId = params.get('idTransaccion') || params.get('IdTransaccion') || '';

                // Enviar datos al servidor para verificación
                const paymentData = {
                    identificadorEnlaceComercio: params.get('identificadorEnlaceComercio') || params.get('IdentificadorEnlaceComercio'),
                    idTransaccion: transactionId,
                    idEnlace: params.get('idEnlace') || params.get('IdEnlace'),
                    monto: params.get('monto') || params.get('Monto'),
                    hash: params.get('hash'),
                };

                // Verificar el estado de la suscripción
                const response = await axios.post<SubscriptionVerificationResponse>('subscriptions/verify', paymentData);
                const data = response.data;
                setSubscriptionData(data);

                if (data.status === 'active') {
                    setSuccess(true);
                    // Redirigir después de un breve momento
                    setTimeout(() => router.visit('/dashboard'), 6000);
                } else if (data.status === 'pending') {
                    // Mantener el estado de procesamiento y volver a verificar después de un tiempo
                    setTimeout(() => verifyPaymentAndSubscription(), 5000);
                } else {
                    setError({
                        message: data.message || 'La suscripción no está activa',
                        details: data.details,
                    });
                    setIsProcessing(false);
                }
            } catch (err) {
                console.error('Error en proceso de verificación:', err);

                // Manejar el error de forma específica
                let errorMsg = 'Error inesperado durante la verificación';
                let details = '';

                if (axios.isAxiosError(err)) {
                    errorMsg = err.response?.data?.message || 'Error en la comunicación con el servidor';
                    details = `Código: ${err.response?.status || 'desconocido'} - ${err.message}`;
                } else if (err instanceof Error) {
                    errorMsg = 'Error en la verificación de la suscripción';
                    details = err.message;
                }

                setError({ message: errorMsg, details });
                setIsProcessing(false);
            }
        };

        verifyPaymentAndSubscription();
    }, []);

    return {
        isProcessing,
        success,
        error,
        subscriptionData,
        redirectToDashboard: () => router.visit('/dashboard'),
    };
}
