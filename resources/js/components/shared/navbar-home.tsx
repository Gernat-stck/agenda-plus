import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { CalendarClock, Menu } from 'lucide-react';
import { useState } from 'react';
import AppLogoIcon from './app-logo-icon';
import { SmoothScrollLink } from './smooth-scroll-link';
import { useActiveSection } from '../../context/ActiveSectionProvider';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { auth } = usePage<SharedData>().props;
    const { activeSection } = useActiveSection();


    return (
        <header className="bg-background/70 supports-[backdrop-filter]:bg-background/40 dark:shadow-purple-400/ sticky top-0 z-50 w-full border-b border-purple-500/20 shadow-lg shadow-purple-500/5 backdrop-blur-xl dark:border-purple-400/20">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between">
                <AppLogoIcon iconClassName="w-8 h-8" />
                {/* Desktop Navigation */}
                <nav className="hidden gap-6 md:flex">
                    <SmoothScrollLink
                        to="#first"
                        className="relative text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-purple-500 after:to-pink-500 after:transition-all after:duration-300 hover:text-purple-500 hover:after:w-full dark:after:from-purple-400 dark:after:to-pink-400 dark:hover:text-purple-400"
                    >
                        Incio
                    </SmoothScrollLink>
                    <SmoothScrollLink
                        to="#features"
                        className="relative text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-purple-500 after:to-pink-500 after:transition-all after:duration-300 hover:text-purple-500 hover:after:w-full dark:after:from-purple-400 dark:after:to-pink-400 dark:hover:text-purple-400"
                    >
                        Caracteristicas
                    </SmoothScrollLink>
                    <SmoothScrollLink
                        to="#pricing"
                        className="relative text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-purple-500 after:to-pink-500 after:transition-all after:duration-300 hover:text-purple-500 hover:after:w-full dark:after:from-purple-400 dark:after:to-pink-400 dark:hover:text-purple-400"
                    >
                        Planes
                    </SmoothScrollLink>
                    <SmoothScrollLink
                        to="#about"
                        className="relative text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-purple-500 after:to-pink-500 after:transition-all after:duration-300 hover:text-purple-500 hover:after:w-full dark:after:from-purple-400 dark:after:to-pink-400 dark:hover:text-purple-400"
                    >
                        Sobre Nosotros
                    </SmoothScrollLink>
                    <SmoothScrollLink
                        to="#contact"
                        className="relative text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-purple-500 after:to-pink-500 after:transition-all after:duration-300 hover:text-purple-500 hover:after:w-full dark:after:from-purple-400 dark:after:to-pink-400 dark:hover:text-purple-400"
                    >
                        Contacto
                    </SmoothScrollLink>
                </nav>

                <div className="hidden items-center gap-4 md:flex">
                    {auth.user ? (
                        <Button
                            variant="outline"
                            asChild
                            className="border-purple-500/50 text-purple-500 transition-all duration-300 hover:bg-purple-500/50 hover:text-purple-400 dark:border-purple-400/50 dark:text-purple-400 dark:hover:text-purple-300"
                        >
                            <SmoothScrollLink to={route('dashboard')}>Dashboard</SmoothScrollLink>
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                asChild
                                className="border-purple-500/50 text-purple-500 transition-all duration-300 hover:bg-purple-500/10 hover:text-purple-400 dark:border-purple-400/50 dark:text-purple-400 dark:hover:text-purple-300"
                            >
                                <SmoothScrollLink to={route('login')}>Iniciar sesión</SmoothScrollLink>
                            </Button>
                            <Button
                                asChild
                                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:from-purple-600 hover:to-pink-600 hover:shadow-purple-500/40 dark:from-purple-400 dark:to-pink-400 dark:shadow-purple-400/20 dark:hover:from-purple-500 dark:hover:to-pink-500 dark:hover:shadow-purple-400/40"
                            >
                                <SmoothScrollLink to={route('register')}>Registrarse</SmoothScrollLink>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Navigation */}
                <div className="flex items-center gap-2 md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-purple-500/50 text-purple-500 transition-all duration-300 hover:bg-purple-500/10 hover:text-purple-400 dark:border-purple-400/50 dark:text-purple-400 dark:hover:text-purple-300"
                            >
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <div className="flex flex-col gap-6 px-5 py-6">
                                <SmoothScrollLink to="/" className="group flex items-center gap-2" onClick={() => setIsOpen(false)}>
                                    <CalendarClock className="shadow-glow-sm h-6 w-6 text-purple-500 transition-all duration-300 group-hover:text-purple-400" />
                                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-lg font-bold text-transparent">
                                        AppCitas
                                    </span>
                                </SmoothScrollLink>
                                <nav className="flex flex-col gap-4">
                                    <SheetClose asChild>
                                        <SmoothScrollLink
                                            to="/"
                                            className="text-lg font-medium transition-colors duration-300 hover:translate-x-1 hover:text-purple-500 dark:hover:text-purple-400"
                                        >
                                            Inicio
                                        </SmoothScrollLink>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <SmoothScrollLink
                                            to="#features"
                                            className="text-lg font-medium transition-colors duration-300 hover:translate-x-1 hover:text-purple-500 dark:hover:text-purple-400"
                                        >
                                            Caracteristicas
                                        </SmoothScrollLink>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <SmoothScrollLink
                                            to="#pricing"
                                            className="text-lg font-medium transition-colors duration-300 hover:translate-x-1 hover:text-purple-500 dark:hover:text-purple-400"
                                        >
                                            Planes
                                        </SmoothScrollLink>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <SmoothScrollLink
                                            to="#about"
                                            className="text-lg font-medium transition-colors duration-300 hover:translate-x-1 hover:text-purple-500 dark:hover:text-purple-400"
                                        >
                                            Sobre Nosotros
                                        </SmoothScrollLink>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <SmoothScrollLink
                                            to="#contact"
                                            className="text-lg font-medium transition-colors duration-300 hover:translate-x-1 hover:text-purple-500 dark:hover:text-purple-400"
                                        >
                                            Contacto
                                        </SmoothScrollLink>
                                    </SheetClose>
                                </nav>
                                <div className="mt-15 flex flex-col gap-6 p-5">
                                    {auth.user ? (
                                        <Button
                                            variant="outline"
                                            asChild
                                            className="border-purple-500/50 text-purple-500 transition-all duration-300 hover:bg-purple-500/50 hover:text-purple-400 dark:border-purple-400/50 dark:text-purple-400 dark:hover:text-purple-300"
                                        >
                                            <SmoothScrollLink to={route('dashboard')}>Dashboard</SmoothScrollLink>
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                variant="outline"
                                                asChild
                                                className="border-purple-500/50 text-purple-500 transition-all duration-300 hover:bg-purple-500/10 hover:text-purple-400 dark:border-purple-400/50 dark:text-purple-400 dark:hover:text-purple-300"
                                            >
                                                <SmoothScrollLink to={route('login')} onClick={() => setIsOpen(false)}>
                                                    Iniciar sesión
                                                </SmoothScrollLink>
                                            </Button>
                                            <Button
                                                asChild
                                                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:from-purple-600 hover:to-pink-600 hover:shadow-purple-500/40 dark:from-purple-400 dark:to-pink-400 dark:shadow-purple-400/20 dark:hover:from-purple-500 dark:hover:to-pink-500 dark:hover:shadow-purple-400/40"
                                            >
                                                <SmoothScrollLink to={route('register')} onClick={() => setIsOpen(false)}>
                                                    Registrarse
                                                </SmoothScrollLink>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
