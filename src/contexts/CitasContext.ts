// contexts/CitaContext.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";

export interface Cita {
  id: string;
  title: string;
  start: Date;
  end: Date;
  estado: string;
}

interface CitaContextProps {
  citas: Cita[];
  agregarCita: (cita: Cita) => void;
  actualizarCita: (citaActualizada: Cita) => void;
  eliminarCita: (id: string) => void;
}

interface CitaProviderProps {
  children: ReactNode;
}

const CitasContext = createContext<CitaContextProps>({
  citas: [],
  agregarCita: () => {},
  actualizarCita: () => {},
  eliminarCita: () => {},
});

export const CitasProvider: React.FC<CitaProviderProps> = ({ children }) => {
  const [citas, setCitas] = useState<Cita[]>([]);

  const agregarCita = (cita: Cita) => {
    setCitas([...citas, cita]);
  };

  const actualizarCita = (citaActualizada: Cita) => {
    setCitas(
      citas.map((cita) =>
        cita.id === citaActualizada.id ? citaActualizada : cita
      )
    );
  };

  const eliminarCita = (id: string) => {
    setCitas(citas.filter((cita) => cita.id !== id));
  };

  return (
    <CitasContext.Provider
      value={{ citas, agregarCita, actualizarCita, eliminarCita }}
    >
      {children}
    </CitasContext.Provider>
  );
};

export const useCita = () => useContext(CitasContext);
