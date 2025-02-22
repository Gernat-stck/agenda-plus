"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Cita {
  id: string;
  title: string;
  start: string;
  end: string;
  estado: string;
}

interface CitaContextProps {
  citas: Cita[];
  agregarCita: (cita: Cita) => void;
  actualizarCita: (cita: Cita) => void;
  eliminarCita: (id: string) => void;
}

const CitaContext = createContext<CitaContextProps | undefined>(undefined);

export const CitaProvider = ({ children }: { children: ReactNode }) => {
  const [citas, setCitas] = useState<Cita[]>([]);

  const agregarCita = (cita: Cita) => setCitas([...citas, cita]);
  const actualizarCita = (citaActualizada: Cita) =>
    setCitas(
      citas.map((cita) =>
        cita.id === citaActualizada.id ? citaActualizada : cita
      )
    );
  const eliminarCita = (id: string) =>
    setCitas(citas.filter((cita) => cita.id !== id));

  return (
    <CitaContext.Provider
      value={{ citas, agregarCita, actualizarCita, eliminarCita }}
    >
      {children}
    </CitaContext.Provider>
  );
};

export const useCitaContext = () => {
  const context = useContext(CitaContext);
  if (context === undefined) {
    throw new Error("useCitaContext must be used within a CitaProvider");
  }
  return context;
};
