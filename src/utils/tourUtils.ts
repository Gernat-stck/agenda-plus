import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const startTour = () => {
  const driverObj = driver({
    popoverClass: "driverjs-theme",
    nextBtnText: "Siguiente",
    prevBtnText: "Anterior",
    doneBtnText: "Cerrar",
    showProgress: true,
    animate: true,
    steps: [
      {
        element: ".rbc-calendar",
        popover: {
          title: "Calendario",
          description:
            "Este es tu calendario de citas. Puedes ver todas tus citas aqui.",
        },
      },
      {
        element: ".rbc-month-view",
        popover: {
          title: "Vista Mensual",
          description: "Clickea en cualquier dia para crear una nueva cita.",
        },
      },
      {
        element: ".rbc-toolbar button:first-child",
        popover: {
          title: "Navegacion",
          description: "Usa los botones para navegar entre los meses.",
        },
      },
      {
        element: ".rbc-toolbar button:nth-child(4)",
        popover: {
          title: "Ver opciones",
          description:
            "Puedes alternar entre dias, meses y semanas o visualizar tu agenda.",
        },
      },
      {
        element: "#tour-button",
        popover: {
          title: "Tour guiado",
          description:
            "Puedes presionar este boton para volver a ver el tour guiado.",
        },
      },
    ],
  });
  driverObj.drive();
  localStorage.setItem("tourShown", "true");
};
