import { Banknote, CheckCircle2, CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';

type PaymentType = "" | "tarjeta" | "efectivo";

interface PaymentMethodSelectorProps {
    serviceId: string;
    value: PaymentType;
    onChange: (paymentType: PaymentType) => void;
    label?: string;
}

export function PaymentMethodSelector({
    serviceId,
    value,
    onChange,
    label = 'Forma de pago'
}: PaymentMethodSelectorProps) {
    const [isCardDisabled, setIsCardDisabled] = useState<boolean>(false);
    const [isCashDisabled, setIsCashDisabled] = useState<boolean>(false);
    //TODO: Recordatorio, en el useEffect se puede aplicar logica para implementar los pagos con tarjeta
    // Lógica para determinar qué métodos de pago están disponibles
    useEffect(() => {
        if (true) {
            //if (serviceId) {
            // Ejemplo: deshabilitar pago con tarjeta para servicios caros
            setIsCardDisabled(true); // Solo ejemplo, ajusta según tus necesidades
            setIsCashDisabled(false); // Habilitar pago en efectivo
        }
    }, [])
    //[serviceId]);
    const handlePaymentSelection = (paymentType: PaymentType) => {
        if ((paymentType === 'tarjeta' && !isCardDisabled) ||
            (paymentType === 'efectivo' && !isCashDisabled)) {
            onChange(paymentType);
        }
    };

    return (
        <div className="space-y-2">
            {label && (
                <label className="text-sm font-medium">{label}</label>
            )}
            <div className="mt-1 grid grid-cols-2 gap-3">
                <div
                    className={`flex items-center gap-2 rounded-lg border p-3 transition-colors ${value === 'tarjeta' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                        } ${isCardDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => !isCardDisabled && handlePaymentSelection('tarjeta')}
                >
                    <CreditCard className={`h-5 w-5 ${isCardDisabled ? 'text-muted-foreground' : 'text-primary'}`} />
                    <span>Tarjeta</span>
                    {value === 'tarjeta' && <CheckCircle2 className="text-primary ml-auto h-4 w-4" />}
                    {isCardDisabled && <span className="ml-auto text-xs text-muted-foreground">Proximamente</span>}
                </div>

                <div
                    className={`flex items-center gap-2 rounded-lg border p-3 transition-colors ${value === 'efectivo' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                        } ${isCashDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => !isCashDisabled && handlePaymentSelection('efectivo')}
                >
                    <Banknote className={`h-5 w-5 ${isCashDisabled ? 'text-muted-foreground' : 'text-primary'}`} />
                    <span>Efectivo</span>
                    {value === 'efectivo' && <CheckCircle2 className="text-primary ml-auto h-4 w-4" />}
                    {isCashDisabled && <span className="ml-auto text-xs text-muted-foreground">No disponible</span>}
                </div>
            </div>
        </div>
    );
}
