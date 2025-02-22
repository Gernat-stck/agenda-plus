import Image from "next/image";
import React from "react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <Image
        src="/3d-rendering-yeti.jpg"
        alt="No appointments"
        height={256}
        width={256}
        className="mb-6 rounded-2xl"
      />
      <p className="text-gray-500 text-lg">
        No se encontraron registros para esta sección...
      </p>
    </div>
  );
}
