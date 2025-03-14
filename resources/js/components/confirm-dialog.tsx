import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmActionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    displayMessage: string;
    confirmText?: string;
    cancelText?: string;
    finalConfirmation?: boolean;
    isDestructive?: boolean;
}

export default function ConfirmActionDialog({
    open,
    onOpenChange,
    onConfirm,
    onCancel,
    title = "¿Estás seguro?",
    displayMessage,
    confirmText,
    cancelText = "Cancelar",
    finalConfirmation = false,
    isDestructive = false,
}: ConfirmActionDialogProps) {
    // Determina el texto del botón de confirmación basado en el contexto
    const defaultConfirmText = isDestructive ? "Eliminar" : "Confirmar";
    const actualConfirmText = confirmText || defaultConfirmText;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {finalConfirmation
                            ? `Esta acción no se puede deshacer. ¿Estás seguro de que deseas ${displayMessage}?`
                            : `¿Estás seguro de que deseas ${displayMessage}?`}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={isDestructive ? "bg-destructive hover:bg-destructive/90" : undefined}
                    >
                        {actualConfirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// Para mantener compatibilidad con el código existente
export { ConfirmActionDialog as ConfirmDeleteDialog };