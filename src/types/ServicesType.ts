export interface Servicio {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  duracion: number;
  categoria: string;
}

export const categoriasIniciales = [
  "Corte",
  "Coloración",
  "Tratamiento",
  "Peinado",
  "Manicura",
  "Pedicura",
];

export const serviciosIniciales: Servicio[] = [
  {
    id: "SERV001",
    titulo: "Corte de cabello",
    descripcion: "Corte de cabello profesional para hombres y mujeres",
    precio: 25.0,
    duracion: 30,
    categoria: "Corte",
  },
  {
    id: "SERV002",
    titulo: "Tinte de cabello",
    descripcion: "Tinte de cabello con productos de alta calidad",
    precio: 50.0,
    duracion: 90,
    categoria: "Coloración",
  },
];
