// contexts/ClienteContext.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";

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

interface ClienteProviderProps {
  children: ReactNode;
}

const ClienteContext = createContext<ClienteContextProps>({
  clientes: [],
  agregarCliente: () => {},
  actualizarCliente: () => {},
  eliminarCliente: () => {},
});

export const ClienteProvider: React.FC<ClienteProviderProps> = ({
  children,
}) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const agregarCliente = (cliente: Cliente) => {
    setClientes([...clientes, cliente]);
  };

  const actualizarCliente = (clienteActualizado: Cliente) => {
    setClientes(
      clientes.map((cliente) =>
        cliente.id === clienteActualizado.id ? clienteActualizado : cliente
      )
    );
  };

  const eliminarCliente = (id: string) => {
    setClientes(clientes.filter((cliente) => cliente.id !== id));
  };

  return (
    <ClienteContext.Provider
      value={{ clientes, agregarCliente, actualizarCliente, eliminarCliente }}
    >
      {children}
    </ClienteContext.Provider>
  );
};

export const useCliente = () => useContext(ClienteContext);
