import Navbar from '@/components/shared/navbar-home';
import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/react';
import { CalendarClock, CheckCircle, MessageSquare, Users } from 'lucide-react';
import placeholderImage from "@/../img/placeholder.svg"
import Footer from '@/components/shared/footer';
export default function Welcome() {
    //TODO: Crear un playground para interactuar con la app

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex-1">
                        {/* Hero Section */}
                        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                            <div className="container px-4 md:px-6">
                                <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                                    <div className="flex flex-col justify-center space-y-4">
                                        <div className="space-y-2">
                                            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                                Gestiona tus citas de manera eficiente
                                            </h1>
                                            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                                                Nuestra aplicación te permite organizar, programar y gestionar todas tus citas en un solo lugar.
                                                Ahorra tiempo y mejora la experiencia de tus clientes.
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                            <Button size="lg" className="h-12">
                                                Comenzar ahora
                                            </Button>
                                            <Button size="lg" variant="outline" className="h-12">
                                                Ver demostración
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <div className="relative w-full h-[450px] overflow-hidden rounded-xl">
                                            <img
                                                src={placeholderImage}
                                                alt="App Screenshot"
                                                className="object-cover w-full h-full"
                                                loading="eager"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Features Section */}
                        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
                            <div className="container px-4 md:px-6">
                                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                                    <div className="space-y-2">
                                        <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                                            Características
                                        </div>
                                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Todo lo que necesitas</h2>
                                        <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                            Nuestra aplicación está diseñada para simplificar la gestión de citas y mejorar la eficiencia de tu
                                            negocio.
                                        </p>
                                    </div>
                                </div>
                                <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
                                    <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                                        <div className="rounded-full bg-primary/10 p-4">
                                            <CalendarClock className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-bold">Programación inteligente</h3>
                                        <p className="text-center text-gray-500 dark:text-gray-400">
                                            Algoritmos inteligentes que optimizan tu calendario y evitan conflictos de horarios.
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                                        <div className="rounded-full bg-primary/10 p-4">
                                            <MessageSquare className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-bold">Recordatorios automáticos</h3>
                                        <p className="text-center text-gray-500 dark:text-gray-400">
                                            Envía recordatorios automáticos por email o SMS para reducir las ausencias.
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                                        <div className="rounded-full bg-primary/10 p-4">
                                            <Users className="h-6 w-6 text-primary" />
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
                            <div className="container px-4 md:px-6">
                                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Planes simples y transparentes</h2>
                                        <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                            Elige el plan que mejor se adapte a las necesidades de tu negocio.
                                        </p>
                                    </div>
                                </div>
                                <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
                                    <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-bold">Básico</h3>
                                            <p className="text-gray-500 dark:text-gray-400">Ideal para profesionales independientes</p>
                                        </div>
                                        <div className="mt-4 flex items-baseline text-gray-900 dark:text-gray-50">
                                            <span className="text-3xl font-bold">$19</span>
                                            <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">/mes</span>
                                        </div>
                                        <ul className="mt-6 space-y-3">
                                            <li className="flex items-center">
                                                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                                                <span>Hasta 50 citas mensuales</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                                                <span>Recordatorios por email</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                                                <span>Calendario personalizable</span>
                                            </li>
                                        </ul>
                                        <Button className="mt-8">Comenzar</Button>
                                    </div>
                                    <div className="flex flex-col rounded-lg border bg-primary p-6 shadow-sm">
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-bold text-primary-foreground">Profesional</h3>
                                            <p className="text-primary-foreground/80">Perfecto para pequeños negocios</p>
                                        </div>
                                        <div className="mt-4 flex items-baseline text-primary-foreground">
                                            <span className="text-3xl font-bold">$49</span>
                                            <span className="ml-1 text-xl font-normal text-primary-foreground/80">/mes</span>
                                        </div>
                                        <ul className="mt-6 space-y-3 text-primary-foreground">
                                            <li className="flex items-center">
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                <span>Citas ilimitadas</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                <span>Recordatorios por email y SMS</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                <span>Integración con Google Calendar</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                <span>Hasta 3 usuarios</span>
                                            </li>
                                        </ul>
                                        <Button variant="secondary" className="mt-8">
                                            Comenzar
                                        </Button>
                                    </div>
                                    <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-bold">Empresarial</h3>
                                            <p className="text-gray-500 dark:text-gray-400">Para empresas con múltiples sedes</p>
                                        </div>
                                        <div className="mt-4 flex items-baseline text-gray-900 dark:text-gray-50">
                                            <span className="text-3xl font-bold">$99</span>
                                            <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">/mes</span>
                                        </div>
                                        <ul className="mt-6 space-y-3">
                                            <li className="flex items-center">
                                                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                                                <span>Todo lo del plan Profesional</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                                                <span>Usuarios ilimitados</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                                                <span>API para integraciones</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                                                <span>Soporte prioritario</span>
                                            </li>
                                        </ul>
                                        <Button className="mt-8">Contactar ventas</Button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* About Section */}
                        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
                            <div className="container px-4 md:px-6">
                                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                                    <div className="flex flex-col justify-center space-y-4">
                                        <div className="space-y-2">
                                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Sobre nosotros</h2>
                                            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                                Somos un equipo apasionado por crear soluciones que simplifiquen la vida de profesionales y
                                                empresas.
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Nuestra aplicación de gestión de citas nació de la necesidad de ofrecer una herramienta intuitiva y
                                                potente que permitiera a cualquier negocio optimizar su agenda y mejorar la experiencia de sus
                                                clientes.
                                            </p>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Con años de experiencia en el desarrollo de software y un profundo conocimiento de las necesidades
                                                de diferentes industrias, hemos creado una solución que se adapta a todo tipo de negocios, desde
                                                profesionales independientes hasta grandes empresas con múltiples sedes.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <div className="relative w-full h-[400px] overflow-hidden rounded-xl">
                                            <img src={placeholderImage} alt="Team Photo" className="object-cover w-full h-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Contact Section */}
                        <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
                            <div className="container px-4 md:px-6">
                                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Contacta con nosotros</h2>
                                        <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                            ¿Tienes alguna pregunta? Estamos aquí para ayudarte.
                                        </p>
                                    </div>
                                </div>
                                <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <div className="rounded-lg border p-4">
                                            <h3 className="text-lg font-bold">Email</h3>
                                            <p className="text-gray-500 dark:text-gray-400">info@tuapp.com</p>
                                        </div>
                                        <div className="rounded-lg border p-4">
                                            <h3 className="text-lg font-bold">Teléfono</h3>
                                            <p className="text-gray-500 dark:text-gray-400">+34 123 456 789</p>
                                        </div>
                                        <div className="rounded-lg border p-4">
                                            <h3 className="text-lg font-bold">Dirección</h3>
                                            <p className="text-gray-500 dark:text-gray-400">Calle Principal 123, 28001 Madrid, España</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4 rounded-lg border p-6">
                                        <div className="grid gap-2">
                                            <label htmlFor="name" className="text-sm font-medium leading-none">
                                                Nombre
                                            </label>
                                            <input
                                                id="name"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Tu nombre"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <label htmlFor="email" className="text-sm font-medium leading-none">
                                                Email
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="tu@email.com"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <label htmlFor="message" className="text-sm font-medium leading-none">
                                                Mensaje
                                            </label>
                                            <textarea
                                                id="message"
                                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Tu mensaje"
                                            />
                                        </div>
                                        <Button>Enviar mensaje</Button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
                <Footer />
            </div>
        </>
    );
}
