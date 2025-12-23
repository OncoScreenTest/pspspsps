import { StrictMode } from "react"; // StrictMode помогает ловить потенциальные проблемы в dev-режиме
import { createRoot } from "react-dom/client"; // Новый API React 18 для рендера
import "./index.css"; // Глобальные базовые стили (фон, body и т.п.)
import App from "./App.tsx"; // Корневой компонент приложения

// Создаём корень React в div#root (из index.html) и рендерим приложение
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App /> {/* Запуск всего приложения */}
  </StrictMode>
);
