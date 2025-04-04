import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Clock, FileCog, User } from "lucide-react"
import ConfirmDeleteDialog from "@/components/shared/confirm-dialog"
import { useState } from "react"
import { useConfirmation } from "@/hooks/use-confirmation"

interface AppointmentDetailsDialogProps {
    isOpen: boolean
    onClose: () => void
    appointment: any
    onEdit: () => void
    onDelete: () => void
    duration: number
}

export function AppointmentDetailsDialog({
    isOpen,
    onClose,
    appointment,
    onEdit,
    onDelete,
    duration,
}: AppointmentDetailsDialogProps) {
    // Estados para los diálogos de confirmación
    const {
        showConfirmation,
        showFinalConfirmation,
        startConfirmation,
        proceedToFinalConfirmation,
        cancelConfirmation
    } = useConfirmation();

    if (!appointment) return null
    const startDate = new Date(appointment.start)
    const endDate = new Date(appointment.end)
    const handleDeleteClick = startConfirmation;
    const handleDeleteConfirm = proceedToFinalConfirmation;
    const handleDeleteCancel = cancelConfirmation;

    const handleFinalDeleteConfirm = () => {
        cancelConfirmation();
        onDelete();
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{appointment.title}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm">
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                <span>{format(startDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>
                                    {format(startDate, "HH:mm")} - {format(endDate, "HH:mm")} (
                                    {duration} minutos)
                                </span>
                            </div>

                            {appointment.clientName && (
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span>{appointment.clientName}</span>
                                </div>
                            )}
                            {appointment.description && (
                                <div className="mt-4 pt-4 border-t">
                                    <h4 className="font-medium mb-2">Descripción</h4>
                                    <p className="text-sm text-muted-foreground">{appointment.description}</p>
                                </div>
                            )}

                            <div className="mt-4 pt-4 border-t">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="inline-flex items-center">
                                        <FileCog className="h-4 w-4 mr-4" />
                                        Consejo: Puedes arrastrar y cambiar la fecha de esta cita directamente en el calendario.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex justify-between sm:justify-between">
                        <div className="flex gap-2">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteClick}
                            >
                                Eliminar
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={onClose}>
                                Cerrar
                            </Button>
                            <Button onClick={onEdit}>Editar</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Primera confirmación para eliminar cita */}
            <ConfirmDeleteDialog
                open={showConfirmation}
                onOpenChange={startConfirmation}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                displayMessage="esta cita"
            />

            <ConfirmDeleteDialog
                open={showFinalConfirmation}
                onOpenChange={cancelConfirmation}
                onConfirm={handleFinalDeleteConfirm}
                onCancel={handleDeleteCancel}
                displayMessage="esta cita"
                finalConfirmation={true}
            />
        </>
    )
}

