"use client";

import React from "react";
import Header from "@/app/components/Header";
import GestionServicios from "@/app/components/services/GestionServicios";

export default function Servicios() {
  return (
    <div className="h-screen overflow-hidden p-2 ">
      <div className="max-w-7xl mx-auto p-6">
        {/*<!-- Header -->*/}
        <Header
          title="Servicios"
          subtitle="Agenda+"
          userName="Usuario"
          userRole="Emprendedor"
        />
        {/*<!-- Main Content -->*/}
        <main className="flex-grow flex items-stretch">
          <div className="w-full flex items-center justify-center">
            <div className="w-full -mt-6 mr-8">
              <GestionServicios />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
