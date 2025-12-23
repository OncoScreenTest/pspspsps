import js from "@eslint/js"; // базовые ESLint-рекомендации для JS
import globals from "globals"; // наборы глобальных переменных (browser, node и т.д.)
import reactHooks from "eslint-plugin-react-hooks"; // правила для React Hooks
import reactRefresh from "eslint-plugin-react-refresh"; // правила для корректной работы Fast Refresh в Vite
import tseslint from "typescript-eslint"; // ESLint-конфиг + правила для TypeScript
import { globalIgnores } from "eslint/config"; // удобный способ игнорировать пути глобально

export default tseslint.config([
  globalIgnores(["dist"]), // игнорируем папку сборки, чтобы линтер её не проверял
  {
    files: ["**/*.{ts,tsx}"], // применяем этот блок только к TS/TSX файлам
    extends: [
      js.configs.recommended, // базовые рекомендации ESLint
      tseslint.configs.recommended, // рекомендации для TypeScript
      reactHooks.configs["recommended-latest"], // актуальные правила React Hooks
      reactRefresh.configs.vite, // настройки под Vite + React Refresh
    ],
    languageOptions: {
      ecmaVersion: 2020, // версия JS-синтаксиса
      globals: globals.browser, // считаем глобальные переменные браузера (window, document и т.д.) допустимыми
    },
  },
]);
