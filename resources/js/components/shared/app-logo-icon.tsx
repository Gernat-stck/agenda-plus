import { CalendarClock } from "lucide-react";
import { Link } from '@inertiajs/react';

interface AppLogoIconProps {
    iconClassName?: string;
}
export default function AppLogoIcon({ iconClassName }: AppLogoIconProps) {
    return (
        <div className="flex items-center gap-2">
            <Link href={route('home')} className="flex items-center gap-2 group">
                <CalendarClock className={`text-purple-500 group-hover:text-purple-400 transition-all duration-300 shadow-glow-sm dark:text-purple-400 dark:group-hover:text-purple-300 ${iconClassName}`} />
                <span className="text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300 dark:from-purple-400 dark:to-pink-400 dark:group-hover:from-purple-300 dark:group-hover:to-pink-300">
                    AppCitas
                </span>
            </Link>
        </div>
    );
}
