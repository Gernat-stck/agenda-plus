import { formatToE164, isValidE164 } from '@/lib/utils';
import { EntityFormField } from '../shared/clients/entity-form';
import { PhoneInput } from '../shared/phone-input';

/**
 * Campos del formulario para la entidad Cliente
 */
export const ClienteFormFields = (): EntityFormField[] => [
    {
        id: 'client_id',
        name: 'client_id',
        label: 'ID',
        type: 'readonly',
    },
    {
        id: 'name',
        name: 'name',
        label: 'Nombre',
        type: 'text',
        required: true,
        placeholder: 'Nombre completo',
    },
    {
        id: 'contact_number',
        name: 'contact_number',
        label: 'Contacto',
        type: 'custom',
        required: true,
        placeholder: 'Número de teléfono',
        renderCustom: (value, onChange) => {
            // Aseguramos que al renderizar se mantenga el formato E.164 si el valor existe
            const phoneValue = value ? (isValidE164(value) ? value : formatToE164(value)) : '';

            // Esta función se ejecuta cuando cambia el valor del teléfono
            const handlePhoneChange = (newValue: string | undefined) => {
                // Si es undefined o vacío, devolvemos string vacío
                if (!newValue) {
                    onChange('');
                    return;
                }

                // Si no está en formato E.164, lo convertimos
                const formattedValue = isValidE164(newValue) ? newValue : formatToE164(newValue);
                onChange(formattedValue);
            };

            return <PhoneInput value={phoneValue} onChange={handlePhoneChange} placeholder="Ingrese número telefónico" defaultCountry="SV" />;
        },
    },
    {
        id: 'email',
        name: 'email',
        label: 'Correo',
        type: 'email',
        required: true,
        placeholder: 'correo@ejemplo.com',
    },
];
