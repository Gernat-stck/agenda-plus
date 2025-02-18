import { Config } from "tailwindcss";
import { PluginAPI } from "tailwindcss/types/config";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "custom-scrollbar": "#a855f7", // Color del scrollbar
        "custom-thumb": "#a855f7", // Color del thumb
        "custom-thumb-hover": "#a855f7", // Color del thumb al hover
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  variants: {
    extend: {
      scrollbar: ["rounded"], // Para agregar bordes redondeados al scrollbar
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }: PluginAPI) {
      addUtilities({
        /* Scrollbar container */
        ".scrollbar::-webkit-scrollbar": {
          width: "9px",
          height: "12px",
        },
        /* Scrollbar track */
        ".scrollbar::-webkit-scrollbar-track": {
          background: "#2c3e50",
        },
        /* Scrollbar thumb */
        ".scrollbar::-webkit-scrollbar-thumb": {
          background: "#a855f7",
          borderRadius: "8px",
        },
        /* Scrollbar thumb hover */
        ".scrollbar::-webkit-scrollbar-thumb:hover": {
          background: "#7d3eb9",
        },
      });
    },
  ],
} satisfies Config;
