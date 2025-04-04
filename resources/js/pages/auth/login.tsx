import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/shared/input-error';
import TextLink from '@/components/shared/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Ingresa a tu cuenta" description="Ingresa tu contraseña debajo para iniciar sesión">
            <Head title="Log in" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            className="border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 dark:border-purple-400/50  dark:hover:text-purple-300"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Contraseña</Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                    Olvidó su contraseña?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            className="border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 dark:border-purple-400/50  dark:hover:text-purple-300"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Escriba su contraseña"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox id="remember" name="remember" checked={data.remember} onClick={() => setData('remember', !data.remember)} tabIndex={3} className={`${data.remember ? 'bg-gradient-to-r from-purple-500 to-pink-500 ' : ''}`} />
                        <Label htmlFor="remember">Recuérdame</Label>
                    </div>

                    <Button type="submit" variant='outline' className="border-purple-500/50 text-purple-500 hover:bg-purple-500/10 hover:text-purple-400 transition-all duration-300 dark:border-purple-400/50 dark:text-purple-400 dark:hover:text-purple-300"
                        tabIndex={4} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Ingresar Sesión
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Aún no tienes cuenta?{' '}
                    <TextLink href={route('register')} tabIndex={5}>
                        Regístrate
                    </TextLink>
                </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
