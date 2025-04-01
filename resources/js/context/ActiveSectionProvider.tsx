import React, { createContext, useState, useContext, useEffect } from 'react';

type ActiveSectionContextType = {
    activeSection: string;
    setActiveSection: React.Dispatch<React.SetStateAction<string>>;
};

const ActiveSectionContext = createContext<ActiveSectionContextType | null>(null);

export const ActiveSectionProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeSection, setActiveSection] = useState<string>('');

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPosition = window.scrollY + 100; // Ajuste para tener en cuenta la barra de navegación

            sections.forEach((section) => {
                // Convertir el elemento a HTMLElement para acceder a offsetTop y offsetHeight
                const htmlSection = section as HTMLElement;
                const sectionTop = htmlSection.offsetTop;
                const sectionHeight = htmlSection.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    setActiveSection(sectionId || '');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        // Ejecutar una vez para establecer la sección activa inicial
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <ActiveSectionContext.Provider value={{ activeSection, setActiveSection }}>
            {children}
        </ActiveSectionContext.Provider>
    );
};

export const useActiveSection = () => {
    const context = useContext(ActiveSectionContext);
    if (!context) {
        throw new Error('useActiveSection must be used within an ActiveSectionProvider');
    }
    return context;
};
