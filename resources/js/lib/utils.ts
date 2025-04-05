import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Valida si un número de teléfono está en formato E.164
 * @param phoneNumber Número de teléfono a validar
 * @returns true si el formato es válido, false en caso contrario
 */
export function isValidE164(phoneNumber: string): boolean {
    // Formato E.164: + seguido de 1 a 15 dígitos
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phoneNumber);
}

/**
 * Formatea un número a formato E.164
 * @param phoneNumber Número a formatear
 * @returns Número en formato E.164 o string vacío si es inválido
 */
export function formatToE164(phoneNumber: string): string {
    // Eliminar todos los caracteres excepto dígitos y +
    const cleaned = phoneNumber.replace(/[^0-9+]/g, '');

    // Si ya tiene formato E.164 válido, devolverlo
    if (isValidE164(cleaned)) {
        return cleaned;
    }

    // Si no tiene + al inicio, agregarlo
    if (!cleaned.startsWith('+')) {
        return '+' + cleaned;
    }

    return cleaned;
}
