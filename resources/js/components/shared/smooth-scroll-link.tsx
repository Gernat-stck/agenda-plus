import React from 'react';
import { Link } from '@inertiajs/react';
import { useActiveSection } from '@/context/ActiveSectionProvider';

interface SmoothScrollLinkProps {
    to: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    activeClassName?: string;
}

export function SmoothScrollLink({
    to,
    children,
    className = "",
    onClick,
    activeClassName = "text-purple-500 dark:text-purple-400"
}: SmoothScrollLinkProps) {
    // Obtener la sección activa del contexto
    const { activeSection } = useActiveSection();

    // Determinar si este enlace está activo
    const sectionId = to.startsWith('#') ? to.substring(1) : '';
    const isActive = sectionId && activeSection === sectionId;

    // Clase final que incluye activeClassName si el enlace está activo
    const finalClassName = isActive ? `${className} ${activeClassName}` : className;

    const handleClick = (e: React.MouseEvent) => {
        // Si es un enlace interno con # y no una ruta externa
        if (to.startsWith('#')) {
            e.preventDefault();

            const targetId = to.substring(1);
            const element = document.getElementById(targetId);

            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Actualizar la URL sin recargar
                window.history.pushState(null, "", to);
            }
        }

        // Llamar a la función onClick si existe
        if (onClick) {
            onClick();
        }
    };

    // Si es un enlace interno, usar <a>
    if (to.startsWith('#')) {
        return (
            <a href={to} onClick={handleClick} className={finalClassName}>
                {children}
            </a>
        );
    }

    // Si es una ruta externa, usar el componente Link de Inertia
    return (
        <Link href={to} onClick={onClick} className={finalClassName}>
            {children}
        </Link>
    );
}
