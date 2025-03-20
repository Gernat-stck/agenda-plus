import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Check, Copy, ArrowLeft } from "lucide-react"

export default function RegistrationLinkModal({ url }: { url: string }) {
    // Iniciar el diálogo como abierto
    const [open, setOpen] = useState(true)
    const [copied, setCopied] = useState(false)

    // Redireccionar al dashboard si el diálogo se cierra
    useEffect(() => {
        if (!open) {
            // Redireccionar al dashboard o página anterior
            window.history.back();
        }
    }, [open]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Error al copiar al portapapeles:", err)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Link de registro de citas</DialogTitle>
                    <DialogDescription>Comparte este enlace con tus clientes para que puedan agendar citas directamente.</DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 mt-4">
                    <div className="grid flex-1 gap-2">
                        <Input readOnly value={url} className="w-full" />
                    </div>
                    <Button size="icon" variant="outline" onClick={copyToClipboard} className="px-3">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span className="sr-only">Copiar link</span>
                    </Button>
                </div>
                <div className="flex justify-end mt-4">
                    <Button onClick={() => setOpen(false)} className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

