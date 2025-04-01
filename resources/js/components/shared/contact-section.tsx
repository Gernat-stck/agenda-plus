import React, { useState } from 'react';
import { Button } from '../ui/button';
import axios from 'axios';
import { toast } from 'sonner';

export default function ContactSection() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(route('contact.send'), formData);
            toast.success('¡Mensaje enviado con éxito!');
            // Limpiar el formulario después del envío exitoso
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            toast.error('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
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
                            <p className="text-gray-500 dark:text-gray-400">appcitassv@gmail.com</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <h3 className="text-lg font-bold">Teléfono</h3>
                            <p className="text-gray-500 dark:text-gray-400">+503 7796 0873</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <h3 className="text-lg font-bold">Dirección</h3>
                            <p className="text-gray-500 dark:text-gray-400">Lourdes Colón, El Salvador, SV</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border p-6">
                        <div className="grid gap-2">
                            <label htmlFor="name" className="text-sm leading-none font-medium">
                                Nombre
                            </label>
                            <input
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Tu nombre"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="email" className="text-sm leading-none font-medium">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="message" className="text-sm leading-none font-medium">
                                Mensaje
                            </label>
                            <textarea
                                id="message"
                                value={formData.message}
                                onChange={handleChange}
                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[120px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Tu mensaje"
                                required
                            />
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar mensaje'}
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
}
