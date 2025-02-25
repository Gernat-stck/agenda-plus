"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { type Servicio, categoriasIniciales, serviciosIniciales } from "@/types/ServicesType"
import { ServicioModal } from "./ModalService"
import { TablaServicios } from "./TablaServicios"
import EmptyState from "@/app/components/EmptyState"

export default function GestionServicios() {
    const [servicios, setServicios] = useState<Servicio[]>(serviciosIniciales)
    const [categorias, setCategorias] = useState<string[]>(categoriasIniciales)
    const [editingServicio, setEditingServicio] = useState<Servicio | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterCategoria, setFilterCategoria] = useState<string>("")
    const [isCreating, setIsCreating] = useState(false)

    const filteredServicios = servicios.filter(
        (servicio) =>
            (servicio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                servicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (filterCategoria === "" || servicio.categoria === filterCategoria),
    )

    const openModal = (servicio?: Servicio) => {
        if (servicio) {
            setEditingServicio(servicio)
            setIsCreating(false)
        } else {
            setEditingServicio({
                id: `SERV${(servicios.length + 1).toString().padStart(3, "0")}`,
                titulo: "",
                descripcion: "",
                precio: 0,
                duracion: 30,
                categoria: "",
            })
            setIsCreating(true)
        }
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingServicio(null)
        setIsCreating(false)
    }

    const handleSave = (servicio: Servicio) => {
        if (isCreating) {
            setServicios([...servicios, servicio])
        } else {
            setServicios(servicios.map((s) => (s.id === servicio.id ? servicio : s)))
        }
        closeModal()
    }

    const handleDelete = (id: string) => {
        setServicios(servicios.filter((s) => s.id !== id))
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Gestión de Servicios</h1>
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => openModal()}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                    <Plus size={20} className="inline-block mr-2" />
                    Nuevo Servicio
                </button>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar servicios..."
                            className="pl-10 pr-4 py-2 border rounded-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    </div>
                    <select
                        value={filterCategoria}
                        onChange={(e) => setFilterCategoria(e.target.value)}
                        className="border rounded-md px-2 py-2"
                    >
                        <option value="">Todas las categorías</option>
                        {categorias.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {servicios.length === 0 ? (
                <EmptyState />
            ) : (
                <TablaServicios servicios={filteredServicios} onEdit={openModal} onDelete={handleDelete} />
            )}
            {isModalOpen && (
                <ServicioModal
                    servicio={editingServicio}
                    onClose={closeModal}
                    onSave={handleSave}
                    categorias={categorias}
                    setCategorias={setCategorias}
                    isCreating={isCreating}
                />
            )}
        </div>
    )
}
