import { Link } from '@inertiajs/react';
import { CalendarClock } from 'lucide-react';

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="bg-background w-full border-t py-6">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex items-center gap-2">
                    <CalendarClock className="h-6 w-6" />
                    <span className="text-lg font-bold">AppCitas</span>
                </div>
                <p className="text-muted-foreground text-center text-sm md:text-left">&copy; {year} AppCitas. Todos los derechos reservados.</p>
                <div className="flex gap-4">
                    <Link href="/" className="text-muted-foreground text-sm hover:underline">
                        Términos
                    </Link>
                    <Link href="/" className="text-muted-foreground text-sm hover:underline">
                        Privacidad
                    </Link>
                </div>
            </div>
        </footer>
    );
}
