import { Link } from "@inertiajs/react"
import { CalendarClock, Copyright } from "lucide-react"

export default function Footer() {
    const year = new Date().getFullYear()
    return (
        <footer className="w-full border-t bg-background py-6">
            <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex items-center gap-2">
                    <CalendarClock className="h-6 w-6" />
                    <span className="text-lg font-bold">AppCitas</span>
                </div>
                <p className="text-center text-sm text-muted-foreground md:text-left">
                    &copy; {year} AppCitas. Todos los derechos reservados.
                </p>
                <div className="flex gap-4">
                    <Link href='/' className="text-sm text-muted-foreground hover:underline">
                        Términos
                    </Link>
                    <Link href='/' className="text-sm text-muted-foreground hover:underline">
                        Privacidad
                    </Link>
                </div>
            </div>
        </footer>
    )
}

