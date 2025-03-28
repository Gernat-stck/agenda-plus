import { useSubscriptionWebhook } from '@/hooks/use-suscription-webhook';

function PaymentCallback() {
    const { isProcessing, success, error } = useSubscriptionWebhook();

    return (
        <div className="container py-8">
            <div className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-md">
                <h1 className="mb-4 text-center text-2xl font-bold">Procesando su suscripción</h1>

                {isProcessing && (
                    <div className="flex flex-col items-center">
                        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
                        <p>Procesando su pago, por favor espere un momento...</p>
                    </div>
                )}

                {error && (
                    <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                        <p className="font-bold">Error</p>
                        <p>{error.message}</p>
                        {error.details && <p className="mt-2 text-sm">{error.details}</p>}
                    </div>
                )}

                {success && (
                    <div className="rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
                        <p className="font-bold">¡Suscripción exitosa!</p>
                        <p>Su suscripción ha sido procesada correctamente. Será redirigido en unos momentos.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PaymentCallback;
