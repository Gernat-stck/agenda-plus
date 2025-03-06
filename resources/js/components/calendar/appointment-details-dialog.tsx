import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Clock, Mail, Phone, User } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AppointmentDetailsDialogProps {
    isOpen: boolean
    onClose: () => void
    appointment: any
    onEdit: () => void
    onDelete: () => void
}

export function AppointmentDetailsDialog({
    isOpen,
    onClose,
    appointment,
    onEdit,
    onDelete,
}: AppointmentDetailsDialogProps) {
    if (!appointment) return null

    const startDate = new Date(appointment.start)
    const endDate = new Date(appointment.end)

    return (
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
                                {Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))} minutos)
                            </span>
                        </div>

                        {appointment.clientName && (
                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.clientName}</span>
                            </div>
                        )}

                        {appointment.clientPhone && (
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.clientPhone}</span>
                            </div>
                        )}

                        {appointment.clientEmail && (
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.clientEmail}</span>
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
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mr-1"
                                    >
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="12" y1="18" x2="12" y2="12"></line>
                                        <line x1="9" y1="15" x2="15" y2="15"></line>
                                    </svg>
                                    Consejo: Puedes arrastrar y redimensionar esta cita directamente en el calendario.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex justify-between sm:justify-between">
                    <div className="flex gap-2">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    Eliminar
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Esto eliminará permanentemente esta cita.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={onDelete}>Eliminar</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
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
    )
}

