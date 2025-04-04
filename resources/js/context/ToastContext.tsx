import { usePage } from '@inertiajs/react';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
interface PageProps {
    flash: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
        [key: string]: any; // Signatura de índice para flash
    };
    [key: string]: any; // Signatura de índice para props generales
}

interface ToastContextProps {
    showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    // No usamos usePage() directamente aquí
    const [mounted, setMounted] = useState(false);

    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
        switch (type) {
            case 'success':
                toast.success(message);
                break;
            case 'error':
                toast.error(message);
                break;
            case 'info':
                toast.info(message);
                break;
            case 'warning':
                toast.warning(message);
                break;
            default:
                toast(message);
        }
    };

    // Marcar como montado después del primer render
    useEffect(() => {
        setMounted(true);
    }, []);

    // FlashMessageHandler sólo se monta cuando el componente principal está listo
    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {mounted && <FlashMessageHandler />}
        </ToastContext.Provider>
    );
}

// Componente separado que usa usePage()
function FlashMessageHandler() {
    const { flash } = usePage<PageProps>().props;
    const [processedFlash, setProcessedFlash] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Para cada tipo de mensaje flash, verificar si ya ha sido procesado
        const types = ['success', 'error', 'warning', 'info'] as const;

        types.forEach((type) => {
            const message = flash[type];
            // Si hay un mensaje y no ha sido procesado aún
            if (message && !processedFlash[`${type}-${message}`]) {
                // Mostrar el toast correspondiente
                toast[type](message);
                // Marcar este mensaje específico como procesado
                setProcessedFlash((prev) => ({
                    ...prev,
                    [`${type}-${message}`]: true,
                }));
            }
        });
    }, [flash, processedFlash]);

    return null; // Este componente no renderiza nada
}

export const useToast = () => {
    const context = useContext(ToastContext);

    if (context === undefined) {
        throw new Error('useToast debe ser usado dentro de un ToastProvider');
    }

    return context;
};
