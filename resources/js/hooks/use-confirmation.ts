import { useCallback, useState } from 'react';

export function useConfirmation() {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);

    const startConfirmation = useCallback(() => setShowConfirmation(true), []);

    const proceedToFinalConfirmation = useCallback(() => {
        setShowConfirmation(false);
        // Añadir un pequeño retardo antes de mostrar el segundo diálogo
        setTimeout(() => {
            setShowFinalConfirmation(true);
        }, 100);
    }, []);

    const cancelConfirmation = useCallback(() => {
        setShowConfirmation(false);
        setShowFinalConfirmation(false);
    }, []);

    return {
        showConfirmation,
        showFinalConfirmation,
        startConfirmation,
        proceedToFinalConfirmation,
        cancelConfirmation,
        setShowConfirmation,
        setShowFinalConfirmation,
    };
}
