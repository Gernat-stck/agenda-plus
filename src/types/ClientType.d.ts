export interface Cliente {
  id: string;
  nombre: string;
  contacto: number;
  correo: string;
  fechaCita: string;
  estadoCita: string;
  paymentMethod?: "efectivo" | "tarjeta";
}
