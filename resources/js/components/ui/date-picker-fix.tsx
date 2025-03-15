"use client"

// Este archivo contiene funciones de utilidad para manejar fechas correctamente
// sin problemas de zona horaria

/**
 * Crea una fecha a partir de una cadena YYYY-MM-DD sin problemas de zona horaria
 */
export function createDateFromString(dateStr: string): Date {
    if (!dateStr) return new Date()

    // Asegurarse de que solo usamos la parte de la fecha (YYYY-MM-DD)
    const cleanDateStr = dateStr.substring(0, 10)

    // Crear la fecha usando componentes individuales
    const [year, month, day] = cleanDateStr.split("-").map(Number)

    // Crear la fecha al mediodía para evitar problemas de cambio de día
    // El mes en JavaScript es 0-indexed (enero = 0)
    return new Date(year, month - 1, day, 12, 0, 0)
}

/**
 * Convierte una fecha a string en formato YYYY-MM-DD
 */
export function formatDateToString(date: Date | undefined): string {
    if (!date) return ""

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
}

/**
 * Formatea una fecha para mostrar en la UI sin problemas de zona horaria
 */
export function formatDateForDisplay(dateStr: string, formatStr: string, locale: Locale): string {
    const date = createDateFromString(dateStr)
    return format(date, formatStr, { locale })
}

// Importa estas funciones donde necesites manejar fechas
import { format } from "date-fns"
import type { Locale } from "date-fns"

