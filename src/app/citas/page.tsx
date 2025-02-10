"use client";

import React, { useState } from "react";
import Calendar from "@/components/Calendar";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { CalendarPlus, PlusCircle } from "lucide-react";

export default function Citas() {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleShowCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto p-6">
        {/*<!-- Header -->*/}
        <Header
          title="Citas"
          subtitle="Agenda+"
          userName="Usuario"
          userRole="Emprendedor"
        />

        {/*<!-- Main Content -->*/}
        <main>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800">
              Citas Agendadas
            </h2>
            <div className="flex gap-4">
              <Button
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                onClick={handleShowCalendar}
              >
                <CalendarPlus size={20} />
                {showCalendar ? "Ocultar Calendario" : "Calendario"}
              </Button>
              <Button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Crear Cita
                <PlusCircle size={20} />
              </Button>
            </div>
          </div>
          <div className="flex-grow flex items-stretch">
            {showCalendar ? (
              <div className="w-full flex items-center justify-center">
                <div className="w-full max-w-6xl -mt-6 mr-8">
                  <Calendar />
                </div>
              </div>
            ) : (
              <div className="w-full flex items-center justify-center">
                <EmptyState />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
