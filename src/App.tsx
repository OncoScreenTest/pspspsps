import "./App.css"; // Подключаем глобальные стили + tailwind директивы (через @import в App.css)
import QuestionBlock from "./components/QuestionBlock"; // Главный компонент приложения (вся логика тестов внутри)

function App() {
  return (
    <main className="w-full text-black">
      {/* Центральный контейнер: ограничиваем ширину и выравниваем содержимое */}
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-start gap-8">
        <QuestionBlock /> {/* Рендерим главный модуль вопросов/ответов */}
      </div>
    </main>
  );
}

export default App; // Экспортируем App как корневой компонент React
