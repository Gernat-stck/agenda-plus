export interface Servicio {
    [key: string]: any;
    service_id: string;
    user_id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    category: string;
}

export const categoriasIniciales = ['Corte', 'Coloración', 'Tratamiento', 'Peinado', 'Manicura', 'Pedicura'];

export const serviciosIniciales: Servicio[] = [
    {
        service_id: '1',
        user_id: '100',
        name: 'Corte de Cabello',
        description: 'Corte de cabello para hombre o mujer',
        duration: 30,
        price: 15,
        category: 'Corte',
    },
    {
        service_id: '2',
        user_id: '101',
        name: 'Coloración',
        description: 'Tinte completo o retoque de raíces',
        duration: 90,
        price: 50,
        category: 'Coloración',
    },
    {
        service_id: '3',
        user_id: '102',
        name: 'Tratamiento Capilar',
        description: 'Tratamiento de hidratación y reparación capilar',
        duration: 60,
        price: 40,
        category: 'Tratamiento',
    },
    {
        service_id: '4',
        user_id: '103',
        name: 'Peinado',
        description: 'Peinado para eventos especiales',
        duration: 45,
        price: 30,
        category: 'Peinado',
    },
];
