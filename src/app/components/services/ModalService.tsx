"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Servicio } from "@/types/ServicesType"

interface ServicioModalProps {
    servicio: Servicio | null
    onClose: () => void
    onSave: (servicio: Servicio) => void
    categorias: string[]
    setCategorias: React.Dispatch<React.SetStateAction<string[]>>
    isCreating: boolean
}

export const ServicioModal: React.FC<ServicioModalProps> = ({
    servicio,
    onClose,
    onSave,
    categorias,
    setCategorias,
    isCreating,
}) => {
    const [editedServicio, setEditedServicio] = useState<Servicio>(
        servicio || {
            id: "",
            titulo: "",
            descripcion: "",
            precio: 0,
            duracion: 30,
            categoria: "",
        },
    )
    const [newCategoria, setNewCategoria] = useState("")

    useEffect(() => {
        setEditedServicio(
            servicio || {
                id: "",
                titulo: "",
                descripcion: "",
                precio: 0,
                duracion: 30,
                categoria: "",
            },
        )
    }, [servicio])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setEditedServicio((prev) => ({
            ...prev,
            [name]: name === "precio" || name === "duracion" ? Number.parseFloat(value) : value,
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(editedServicio)
    }

    const addNewCategoria = () => {
        if (newCategoria && !categorias.includes(newCategoria)) {
            setCategorias([...categorias, newCategoria])
            setEditedServicio((prev) => ({ ...prev, categoria: newCategoria }))
            setNewCategoria("")
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{isCreating ? "Nuevo Servicio" : "Editar Servicio"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                            ID
                        </label>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            value={editedServicio.id}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                            Título
                        </label>
                        <input
                            type="text"
                            id="titulo"
                            name="titulo"
                            value={editedServicio.titulo}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                            Descripción
                        </label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={editedServicio.descripcion}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            rows={3}
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
                            Precio
                        </label>
                        <input
                            type="number"
                            id="precio"
                            name="precio"
                            value={editedServicio.precio}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="duracion" className="block text-sm font-medium text-gray-700">
                            Duración (minutos)
                        </label>
                        <input
                            type="number"
                            id="duracion"
                            name="duracion"
                            value={editedServicio.duracion}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            min="1"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
                            Categoría
                        </label>
                        <div className="flex">
                            <select
                                id="categoria"
                                name="categoria"
                                value={editedServicio.categoria}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                required
                            >
                                <option value="">Seleccionar categoría</option>
                                {categorias.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="newCategoria" className="block text-sm font-medium text-gray-700">
                            Nueva Categoría
                        </label>
                        <div className="flex">
                            <input
                                type="text"
                                id="newCategoria"
                                value={newCategoria}
                                onChange={(e) => setNewCategoria(e.target.value)}
                                className="mt-1 block w-full rounded-l-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                placeholder="Nueva categoría"
                            />
                            <button
                                type="button"
                                onClick={addNewCategoria}
                                className="mt-1 px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Añadir
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {isCreating ? "Crear" : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
