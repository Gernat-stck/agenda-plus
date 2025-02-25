"use client"
import Header from "@/app/components/Header";
import React from "react";
import ListaClientes from "@/app/components/clients/ListaClientes";

export default function CitasPage() {
  return (
    <div className="h-screen overflow-hidden p-2 ">
      <div className="max-w-7xl mx-auto p-6">
        {/*<!-- Header -->*/}
        <Header
          title="Citas"
          subtitle="Agenda+"
          userName="Usuario"
          userRole="Emprendedor"
        />
        {/*<!-- Main Content -->*/}
        <main className="flex-grow flex items-stretch">
          <div className="w-full flex items-center justify-center">
            <div className="w-full -mt-6 mr-8">
              <ListaClientes />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}