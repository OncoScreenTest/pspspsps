import { defineConfig } from "vite"; // Конфиг Vite
import react from "@vitejs/plugin-react"; // Плагин React для Vite
import tailwindcss from "@tailwindcss/vite"; // Плагин Tailwind для Vite

// https://vite.dev/config/
export default defineConfig({
  base: "/medical-test/", // Базовый путь для GitHub Pages (важно: должен совпадать с названием репозитория/папки)
  plugins: [tailwindcss(), react()], // Подключаем Tailwind и React плагины
});
