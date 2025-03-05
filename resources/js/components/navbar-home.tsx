import { useState } from "react"
import { CalendarClock, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Link, usePage } from "@inertiajs/react"
import { type SharedData } from '@/types';
import AppLogoIcon from "./app-logo-icon"

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const { auth } = usePage<SharedData>().props;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-purple-500/20 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40 shadow-lg shadow-purple-500/5 dark:border-purple-400/20 dark:shadow-purple-400/ px-15">
            <div className="container flex h-16 items-center justify-between">

                <AppLogoIcon iconClassName="w-8 h-8" />
                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-6">
                    <Link
                        href="/"
                        className="text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-purple-500 after:to-pink-500 hover:after:w-full after:transition-all after:duration-300 hover:text-purple-500 transition-colors dark:hover:text-purple-400 dark:after:from-purple-400 dark:after:to-pink-400"
                    >
                        Incio
                    </Link>
                    <Link
                        href="#about"
                        className="text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-purple-500 after:to-pink-500 hover:after:w-full after:transition-all after:duration-300 hover:text-purple-500 transition-colors dark:hover:text-purple-400 dark:after:from-purple-400 dark:after:to-pink-400"
                    >
                        Sobre Nosotros
                    </Link>
                    <Link
                        href="#pricing"
                        className="text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-purple-500 after:to-pink-500 hover:after:w-full after:transition-all after:duration-300 hover:text-purple-500 transition-colors dark:hover:text-purple-400 dark:after:from-purple-400 dark:after:to-pink-400"
                    >
                        Planes
                    </Link>
                    <Link
                        href="#contact"
                        className="text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-purple-500 after:to-pink-500 hover:after:w-full after:transition-all after:duration-300 hover:text-purple-500 transition-colors dark:hover:text-purple-400 dark:after:from-purple-400 dark:after:to-pink-400"
                    >
                        Contacto
                    </Link>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    {auth.user ? (
                        <Button
                            variant="outline"
                            asChild
                            className="border-purple-500/50 text-purple-500 hover:bg-purple-500/50 hover:text-purple-400 transition-all duration-300 dark:border-purple-400/50 dark:text-purple-400 dark:hover:text-purple-300"
                        >
                            <Link href={route('dashboard')} >
                                Dashboard
                            </Link>
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                asChild
                                className="border-purple-500/50 text-purple-500 hover:bg-purple-500/10 hover:text-purple-400 transition-all duration-300 dark:border-purple-400/50 dark:text-purple-400 dark:hover:text-purple-300"
                            >
                                <Link href={route('login')}>Iniciar sesión</Link>
                            </Button>
                            <Button
                                asChild
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 dark:from-purple-400 dark:to-pink-400 dark:hover:from-purple-500 dark:hover:to-pink-500 dark:shadow-purple-400/20 dark:hover:shadow-purple-400/40"
                            >
                                <Link href={route('register')}>Registrarse</Link>
                            </Button>
                        </>
                    )
                    }

                </div >

                {/* Mobile Navigation */}
                < div className="flex md:hidden items-center gap-2" >
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-purple-500/50 text-purple-500 hover:bg-purple-500/10 hover:text-purple-400 transition-all duration-300 dark:border-purple-400/50 dark:text-purple-400 dark:hover:text-purple-300"
                            >
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <div className="flex flex-col gap-6 py-6 px-5">
                                <Link href="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
                                    <CalendarClock className="h-6 w-6 text-purple-500 group-hover:text-purple-400 transition-all duration-300 shadow-glow-sm" />
                                    <span className="text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                                        AppCitas
                                    </span>
                                </Link>
                                <nav className="flex flex-col gap-4">
                                    <SheetClose asChild>
                                        <Link
                                            href="/"
                                            className="text-lg font-medium transition-colors hover:text-purple-500 hover:translate-x-1 duration-300 dark:hover:text-purple-400"
                                        >
                                            Home
                                        </Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link
                                            href="#about"
                                            className="text-lg font-medium transition-colors hover:text-purple-500 hover:translate-x-1 duration-300 dark:hover:text-purple-400"
                                        >
                                            About
                                        </Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link
                                            href="#pricing"
                                            className="text-lg font-medium transition-colors hover:text-purple-500 hover:translate-x-1 duration-300 dark:hover:text-purple-400"
                                        >
                                            Pricing
                                        </Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link
                                            href="#contact"
                                            className="text-lg font-medium transition-colors hover:text-purple-500 hover:translate-x-1 duration-300 dark:hover:text-purple-400"
                                        >
                                            Contact
                                        </Link>
                                    </SheetClose>
                                </nav>
                                <div className="flex flex-col gap-6 mt-15 p-5 ">
                                    {auth.user ? (
                                        <Button
                                            variant="outline"
                                            asChild
                                            className="border-purple-500/50 text-purple-500 hover:bg-purple-500/50 hover:text-purple-400 transition-all duration-300 dark:border-purple-400/50 dark:text-purple-400 dark:hover:text-purple-300"
                                        >
                                            <Link href={route('dashboard')} >
                                                Dashboard
                                            </Link>
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                variant="outline"
                                                asChild
                                                className="border-purple-500/50 text-purple-500 hover:bg-purple-500/10 hover:text-purple-400 transition-all duration-300 dark:border-purple-400/50 dark:text-purple-400 dark:hover:text-purple-300"
                                            >
                                                <Link href={route('login')} onClick={() => setIsOpen(false)}>Iniciar sesión</Link>
                                            </Button>
                                            <Button
                                                asChild
                                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 dark:from-purple-400 dark:to-pink-400 dark:hover:from-purple-500 dark:hover:to-pink-500 dark:shadow-purple-400/20 dark:hover:shadow-purple-400/40"
                                            >
                                                <Link href={route('register')} onClick={() => setIsOpen(false)}>Registrarse</Link>
                                            </Button>
                                        </>
                                    )
                                    }
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div >
            </div >
        </header >
    )
}

