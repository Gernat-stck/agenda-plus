import AppLogoIcon from '@/components/app-logo-icon';
import { type PropsWithChildren } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative bg-background flex min-h-svh flex-col items-center justify-center gap-8 p-6 md:p-10">
            <div className="absolute top-6 left-6">
                <Link href={route('home')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                    <ArrowLeft className="w-6 h-6" />
                    <span className='text-xl'> Regresar</span>
                </Link>
            </div>
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2">
                            <AppLogoIcon iconClassName='w-14 h-14' />
                        </div>
                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-muted-foreground text-center text-sm">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}