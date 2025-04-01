import { EntityFormField } from "../shared/clients/entity-form";

/**
 * Campos del formulario para la entidad Cliente
 */
export const ClienteFormFields = (): EntityFormField[] => [
    {
        id: "client_id",
        name: "client_id",
        label: "ID",
        type: "readonly",
    },
    {
        id: "name",
        name: "name",
        label: "Nombre",
        type: "text",
        required: true,
        placeholder: "Nombre completo"
    },
    {
        id: "contact_number",
        name: "contact_number",
        label: "Contacto",
        type: "text",
        required: true,
        placeholder: "Número de teléfono"
    },
    {
        id: "email",
        name: "email",
        label: "Correo",
        type: "email",
        required: true,
        placeholder: "correo@ejemplo.com"
    }
];