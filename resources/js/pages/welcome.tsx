import ContactSection from '@/components/shared/contact-section';
import Footer from '@/components/shared/footer';
import Navbar from '@/components/shared/navbar-home';
import { PricingCards } from '@/components/shared/pricing-cards';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { CalendarClock, MessageSquare, Users } from 'lucide-react';
import { plans } from '../components/mocks/plans';
import { SmoothScrollLink } from '@/components/shared/smooth-scroll-link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import calendar from '@/../img/Calendar-Laravel-03-28-2025_09_52_PM.png';
import clients from '@/../img/Clients-Laravel-03-29-2025_12_06_AM.png';
import calendarConfig from '@/../img/Configuración-del-Calendario-Laravel-03-29-2025_12_05_AM.png';
import calendarConfig2 from '@/../img/Configuración-del-Calendario-Laravel-03-29-2025_12_06_AM.png';
import services from '@/../img/Services-Laravel-03-29-2025_12_07_AM.png';
import bussinessImage from '@/../img/istockphoto-1418476287-612x612.jpg'
export default function Welcome() {
    const images = [calendar, clients, calendarConfig, calendarConfig2, services];
    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Navbar />
            <div className="flex min-h-screen flex-col overflow-x-hidden">
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex-1">
                        {/* Hero Section */}
                        <section id="first" className="mb-15 w-full py-12 md:py-24 lg:py-32 xl:py-48">
                            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                                <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                                    <div className="flex flex-col justify-center space-y-4">
                                        <div className="space-y-2">
                                            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                                Gestiona tus citas de manera eficiente
                                            </h1>
                                            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                                                Nuestra aplicación te permite organizar, programar y gestionar todas tus citas en un solo lugar. Ahorra
                                                tiempo y mejora la experiencia de tus clientes.
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                            <SmoothScrollLink to="#pricing">
                                                <Button
                                                    size="lg"
                                                    variant="outline"
                                                    className="h-12 border-purple-500/50 text-purple-500 transition-all duration-300 hover:bg-purple-500/10 hover:text-purple-400 dark:border-purple-400/50 dark:text-purple-400 dark:hover:text-purple-300"
                                                >
                                                    Comenzar ahora
                                                </Button>
                                            </SmoothScrollLink>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                                            <Carousel className="w-full">
                                                <CarouselContent>
                                                    {images.map((src, index) => (
                                                        <CarouselItem key={index}>
                                                            <div className="relative aspect-video w-full">
                                                                <img
                                                                    src={src || "/placeholder.svg"}
                                                                    alt={`App Screenshot ${index + 1}`}
                                                                    className="object-cover rounded-xl"
                                                                />
                                                            </div>
                                                        </CarouselItem>
                                                    ))}
                                                </CarouselContent>
                                                <CarouselPrevious className="left-2" />
                                                <CarouselNext className="right-2" />
                                            </Carousel>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Features Section */}
                        <section id='features' className="mb-15 w-full bg-gray-50 py-12 md:py-24 lg:py-32 dark:bg-gray-900">
                            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                                    <div className="space-y-2">
                                        <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">Características</div>
                                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Todo lo que necesitas</h2>
                                        <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                            Nuestra aplicación está diseñada para simplificar la gestión de citas y mejorar la eficiencia de tu
                                            negocio.
                                        </p>
                                    </div>
                                </div>
                                <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
                                    <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                                        <div className="bg-primary/10 rounded-full p-4">
                                            <CalendarClock className="text-primary h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-bold">Programación inteligente</h3>
                                        <p className="text-center text-gray-500 dark:text-gray-400">
                                            Algoritmos inteligentes que optimizan tu calendario y evitan conflictos de horarios.
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                                        <div className="bg-primary/10 rounded-full p-4">
                                            <MessageSquare className="text-primary h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-bold">Recordatorios automáticos</h3>
                                        <p className="text-center text-gray-500 dark:text-gray-400">
                                            Envía recordatorios automáticos por email o SMS para reducir las ausencias.
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                                        <div className="bg-primary/10 rounded-full p-4">
                                            <Users className="text-primary h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-bold">Gestión de clientes</h3>
                                        <p className="text-center text-gray-500 dark:text-gray-400">
                                            Mantén un registro completo de tus clientes y su historial de citas.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Pricing Section */}
                        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
                            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Planes simples y transparentes</h2>
                                        <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                            Elige el plan que mejor se adapte a las necesidades de tu negocio.
                                        </p>
                                    </div>
                                </div>
                                <div className="mx-auto flex w-full flex-col justify-center py-12">
                                    <PricingCards plans={plans} defaultActiveCard={1} />
                                </div>
                            </div>
                        </section>
                        {/* About Section */}
                        <section id="about" className="w-full bg-gray-50 py-12 md:py-24 lg:py-32 dark:bg-gray-900">
                            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                                    <div className="flex flex-col justify-center space-y-4">
                                        <div className="space-y-2">
                                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Sobre nosotros</h2>
                                            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                                Somos un equipo apasionado por crear soluciones que simplifiquen la vida de profesionales y empresas.
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Nuestra aplicación de gestión de citas nació de la necesidad de ofrecer una herramienta intuitiva y
                                                potente que permitiera a cualquier negocio optimizar su agenda y mejorar la experiencia de sus
                                                clientes.
                                            </p>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Con años de experiencia en el desarrollo de software y un profundo conocimiento de las necesidades de
                                                diferentes industrias, hemos creado una solución que se adapta a todo tipo de negocios, desde
                                                profesionales independientes hasta grandes empresas con múltiples sedes.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <div className="relative h-[400px] w-full overflow-hidden rounded-xl">
                                            <img src={bussinessImage} alt="Team Photo" className="h-full w-full object-cover" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Contact Section */}
                        <ContactSection />
                    </main>
                </div>
                <Footer />
            </div >
        </>
    );
}
