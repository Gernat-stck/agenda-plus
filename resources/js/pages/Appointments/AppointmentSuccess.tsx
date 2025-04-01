import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Check, Clock, Copy, CreditCard, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

interface AppointmentProps {
    id: string;
    title: string;
    start_time: string;
    end_time: string;
    service_name: string;
    client_name: string;
    payment_type: string;
    status: string;
}

interface AppointmentSuccessProps {
    appointment: AppointmentProps;
    shareUrl: string;
    success: boolean;
    message: string;
}

export default function AppointmentSuccess({ appointment, shareUrl, success, message }: AppointmentSuccessProps) {
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (success) {
            toast.success(message);
        }
    }, [success, message]);

    const copyToClipboard = () => {
        navigator.clipboard
            .writeText(shareUrl)
            .then(() => {
                setIsCopied(true);
                toast.success('Enlace copiado al portapapeles');
                setTimeout(() => setIsCopied(false), 2000);
            })
            .catch((err) => {
                console.error('Error al copiar: ', err);
                toast.error('No se pudo copiar al portapapeles');
            });
    };

    const startDate = parseISO(appointment.start_time);
    const endDate = parseISO(appointment.end_time);

    const formattedDate = format(startDate, 'PPPP', { locale: es });
    const startTime = format(startDate, 'HH:mm');
    const endTime = format(endDate, 'HH:mm');

    const statusColors = {
        pendiente: 'bg-yellow-100 text-yellow-800',
        finalizado: 'bg-green-100 text-green-800',
        cancelada: 'bg-red-100 text-red-800',
        encurso: 'bg-blue-100 text-blue-800',
    };

    const statusColor = statusColors[appointment.status as keyof typeof statusColors] || statusColors.pendiente;

    const goToHome = () => {
        window.location.href = '/';
    };

    return (
        <>
            <Head title="Cita Agendada" />
            <Toaster position="top-right" richColors />

            <div className="bg-accent flex min-h-screen items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="from-primary/90 to-primary text-primary-foreground bg-gradient-to-r">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                            <Check className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-center text-xl">¡Cita registrada con éxito!</CardTitle>
                        <p className="text-primary-foreground/80 text-center">Tu cita ha sido programada correctamente</p>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-6">
                        <div>
                            <h3 className="text-lg font-medium">{appointment.title}</h3>
                            <p className="text-muted-foreground">{appointment.service_name}</p>

                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div className="flex items-start space-x-2">
                                    <Calendar className="text-primary mt-0.5 h-5 w-5" />
                                    <div>
                                        <p className="text-sm font-medium">Fecha</p>
                                        <p className="text-muted-foreground text-sm">{formattedDate}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-2">
                                    <Clock className="text-primary mt-0.5 h-5 w-5" />
                                    <div>
                                        <p className="text-sm font-medium">Hora</p>
                                        <p className="text-muted-foreground text-sm">
                                            {startTime} - {endTime}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-2">
                                    <User className="text-primary mt-0.5 h-5 w-5" />
                                    <div>
                                        <p className="text-sm font-medium">Cliente</p>
                                        <p className="text-muted-foreground text-sm">{appointment.client_name}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-2">
                                    <CreditCard className="text-primary mt-0.5 h-5 w-5" />
                                    <div>
                                        <p className="text-sm font-medium">Pago</p>
                                        <p className="text-muted-foreground text-sm capitalize">{appointment.payment_type}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}>
                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </span>
                            </div>
                        </div>

                        <div className="bg-muted/30 space-y-3 rounded-lg p-4">
                            <p className="text-sm font-medium">Comparte el enlace de tu cita:</p>
                            <div className="flex items-center">
                                <div className="bg-background flex-1 truncate rounded-l-md border p-2 text-sm">{shareUrl}</div>
                                <Button variant="outline" size="icon" className="rounded-l-none border-l-0" onClick={copyToClipboard}>
                                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                            <p className="text-muted-foreground text-xs">
                                Puedes usar este enlace para acceder a los detalles de tu cita en cualquier momento.
                            </p>
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button onClick={goToHome} className="w-full">
                            Ir al inicio
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
