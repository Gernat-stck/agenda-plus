// app/contexts/ClienteContext.tsx
"use client";

import React, { createContext, useState, ReactNode } from "react";

export interface Cliente {
  id: string;
  nombre: string;
  contacto: string;
  correo: string;
  fechaCita: string;
  estadoCita: string;
}

interface ClienteContextProps {
  clientes: Cliente[];
  agregarCliente: (cliente: Cliente) => void;
  actualizarCliente: (clienteActualizado: Cliente) => void;
  eliminarCliente: (id: string) => void;
}

export const ClienteContext = createContext<ClienteContextProps | null>(null);

export const ClienteProvider = ({ children }: { children: ReactNode }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const agregarCliente = (cliente: Cliente) => {
    setClientes((prevClientes) => [...prevClientes, cliente]);
  };

  const actualizarCliente = (clienteActualizado: Cliente) => {
    setClientes((prevClientes) =>
      prevClientes.map((cliente) =>
        cliente.id === clienteActualizado.id ? clienteActualizado : cliente
      )
    );
  };

  const eliminarCliente = (id: string) => {
    setClientes((prevClientes) =>
      prevClientes.filter((cliente) => cliente.id !== id)
    );
  };

  return (
    <ClienteContext.Provider
      value={{ clientes, agregarCliente, actualizarCliente, eliminarCliente }}
    >
      {children}
    </ClienteContext.Provider>
  );
};
