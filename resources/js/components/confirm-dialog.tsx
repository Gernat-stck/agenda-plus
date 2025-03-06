import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ConfirmDeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    onCancel: () => void
    displayMessage: string | undefined
    finalConfirmation?: boolean
}

export default function ConfirmDeleteDialog({
    open,
    onOpenChange,
    onConfirm,
    onCancel,
    displayMessage,
    finalConfirmation = false,
}: ConfirmDeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{finalConfirmation ? "Confirmación final" : "¿Eliminar cliente?"}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {finalConfirmation
                            ? `Esta acción no se puede deshacer. ¿Estás completamente seguro de que deseas eliminar permanentemente ${displayMessage}?`
                            : `¿Estás seguro de que deseas eliminar ${displayMessage}? Esta acción eliminará también todas sus citas.`}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={finalConfirmation ? "bg-destructive text-secondary hover:bg-destructive/90 dark:text-white" : ""}
                    >
                        {finalConfirmation ? "Eliminar permanentemente" : "Continuar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}