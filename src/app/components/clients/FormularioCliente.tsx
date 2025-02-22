// components/FormularioCliente.tsx
import React, { useState, useContext, ChangeEvent, FormEvent } from "react";
import { ClienteContext, Cliente } from "@/contexts/ClienteContext";
import { CitaContext, Cita } from "@/contexts/CitasContext";

const FormularioCliente: React.FC = () => {
    const { agregarCliente } = useContext(ClienteContext);
    const { agregarCita } = useContext(CitaContext);

    const [nuevoCliente, setNuevoCliente] = useState<Omit<Cliente, "id">>({
        nombre: "",
        contacto: "",
        correo: "",
        fechaCita: "",
        estadoCita: "Pendiente",
    });

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const clienteConID: Cliente = {
            ...nuevoCliente,
            id: Date.now().toString(),
        };
        agregarCliente(clienteConID);

        if (clienteConID.fechaCita) {
            const nuevaCita: Cita = {
                id: clienteConID.id,
                title: clienteConID.nombre,
                start: new Date(clienteConID.fechaCita),
                end: new Date(
                    new Date(clienteConID.fechaCita).getTime() + 30 * 60000
                ), // Duración de 30 minutos
                estado: clienteConID.estadoCita,
            };
            agregarCita(nuevaCita);
        }

        // Opcional: Resetear el formulario
        setNuevoCliente({
            nombre: "",
            contacto: "",
            correo: "",
            fechaCita: "",
            estadoCita: "Pendiente",
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                name="nombre"
                value={nuevoCliente.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className="input"
                required
            />
            <input
                type="tel"
                name="contacto"
                value={nuevoCliente.contacto}
                onChange={handleChange}
                placeholder="Número de Contacto"
                className="input"
                required
            />
            <input
                type="email"
                name="correo"
                value={nuevoCliente.correo}
                onChange={handleChange}
                placeholder="Correo Electrónico"
                className="input"
                required
            />
            <input
                type="datetime-local"
                name="fechaCita"
                value={nuevoCliente.fechaCita}
                onChange={handleChange}
                className="input"
            />
            <select
                name="estadoCita"
                value={nuevoCliente.estadoCita}
                onChange={handleChange}
                className="input"
            >
                <option value="Pendiente">Pendiente</option>
                <option value="Confirmada">Confirmada</option>
                <option value="En Curso">En Curso</option>
                <option value="Cancelada">Cancelada</option>
            </select>
            <button type="submit" className="btn">
                Agregar Cliente y Cita
            </button>
        </form>
    );
};

export default FormularioCliente;
