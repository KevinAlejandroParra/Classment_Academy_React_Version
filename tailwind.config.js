import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Incluye el archivo HTML principal
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Activar modo oscuro con la clase "dark"
  theme: {
    extend: {
     
      colors: {
        light: {
          background: '#F7F9FC', // Fondo claro suave
          text: '#1C1E26', // Texto gris oscuro para buena legibilidad
          primary: '#F6C23E', // Amarillo oscuro (color yellow-600)
          secondary: '#000000', // Negro intenso para acentos
          accent: '#000000', // Negro brillante (para botones, detalles)
          success: '#06D6A0', // Verde neón suave
          warning: '#FFAD4D', // Naranja pastel
          error: '#EF476F', // Rojo rosado brillante
          shadow: '#E0E0E0', // Sombras sutiles
          card: '#FFFFFF', // Fondo blanco para tarjetas
          border: '#D1D9E6', // Bordes suaves
        },
        dark: {
          background: '#0D0D0D', // Negro profundo para el fondo
          text: '#F1F1F1', // Texto claro
          primary: '#F7DC6F', // Amarillo neón
          secondary: '#FFFFFF', // Blanco intenso
          accent: '#FFD166', // Amarillo brillante
          success: '#06D6A0', // Verde neón
          warning: '#FFBE0B', // Amarillo neón cálido
          error: '#FF2E63', // Rojo neón
          shadow: '#1A1A1A', // Sombras suaves
          card: '#0B0B0B', // Fondo oscuro para tarjetas
          border: '#181818', // Bordes sutiles
        },
      },
    },
  },
  plugins: [nextui()], // Plugin de NextUI para integración
};