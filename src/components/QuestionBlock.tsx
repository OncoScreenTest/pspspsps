import { useState, useEffect, useRef, useMemo } from "react"; // Состояния, эффекты, ref и мемоизация
import { motion, AnimatePresence } from "framer-motion"; // Анимации появления/исчезновения
import { questions, breastQuestions } from "../data/questions"; // Два дерева вопросов: шейка матки и молочная железа
import { recommendationsByPath } from "../data/recommendations"; // Рекомендации по ключу "questionId:optionId"
import type { Answer, Question } from "../types/Question"; // Типы TS для строгой структуры данных
import { StartScreen } from "./StartScreen"; // Стартовый экран выбора теста

type Screen = "start" | "cervical" | "breast"; // Три режима экрана: старт / тест шейки / тест груди

const QuestionBlock = () => {
  const [screen, setScreen] = useState<Screen>("start"); // Текущий экран (start/cervical/breast)
  const [answers, setAnswers] = useState<Answer[]>([]); // История ответов: массив {questionId, optionId}
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("q1"); // ID текущего вопроса (по умолчанию q1)
  const [finalRecommendation, setFinalRecommendation] = useState<string | null>(
    null
  ); // Финальная рекомендация (если ветка закончилась)

  const containerRef = useRef<HTMLDivElement | null>(null); // ref на внешний контейнер (сейчас используется как "якорь")
  const endRef = useRef<HTMLDivElement | null>(null); // ref на нижний якорь для автоскролла вниз

  const activeQuestions = useMemo(() => {
    return screen === "breast" ? breastQuestions : questions; // Если выбран тест груди → берём breastQuestions, иначе → questions
  }, [screen]); // Пересчитываем только при смене screen

  const firstQuestionId = activeQuestions?.[0]?.id ?? "q1"; // Первый вопрос выбранного дерева (fallback: "q1")

  useEffect(() => {
    setAnswers([]); // При смене теста очищаем историю ответов
    setFinalRecommendation(null); // При смене теста убираем финальную рекомендацию
    setCurrentQuestionId(firstQuestionId); // Начинаем выбранный тест с первого вопроса
  }, [screen, firstQuestionId]); // Важно: срабатывает при смене экрана или при смене первого вопроса

  const getQuestionById = (id: string): Question | undefined =>
    activeQuestions.find((q) => q.id === id); // Поиск вопроса по id внутри активного дерева вопросов

  const handleAnswer = (
    questionId: string,
    optionId: string,
    nextId?: string
  ) => {
    const newAnswers = [
      ...answers.filter((a) => a.questionId !== questionId), // Если отвечали на этот вопрос раньше — заменяем ответ
      { questionId, optionId }, // Добавляем выбранный вариант
    ];
    setAnswers(newAnswers); // Сохраняем обновлённую историю

    if (nextId) {
      setCurrentQuestionId(nextId); // Если у ответа есть nextQuestionId → идём к следующему вопросу
    } else {
      const key = `${questionId}:${optionId}`; // Ключ для поиска рекомендации в recommendationsByPath
      const recommendation =
        recommendationsByPath[key] ||
        "Пожалуйста, проконсультируйтесь с врачом."; // Если ключа нет — fallback
      setFinalRecommendation(recommendation); // Пишем финальную рекомендацию
    }
  };

  const handleBack = () => {
    const newAnswers = [...answers]; // Копируем массив ответов
    const last = newAnswers.pop(); // Удаляем последний ответ
    setAnswers(newAnswers); // Обновляем историю ответов (на шаг назад)
    setFinalRecommendation(null); // Если была рекомендация — убираем, потому что продолжаем ветку
    setCurrentQuestionId(last?.questionId || firstQuestionId); // Возвращаемся к последнему вопросу (или к первому)
  };

  const handleRestart = () => {
    setScreen("start"); // Возврат на стартовый экран выбора теста
  };

  const handleResetCurrentTest = () => {
    setAnswers([]); // Сбрасываем ответы текущего теста
    setFinalRecommendation(null); // Сбрасываем рекомендацию
    setCurrentQuestionId(firstQuestionId); // Начинаем текущий тест заново с первого вопроса
  };

  const answeredQuestions = answers
    .map((a) => getQuestionById(a.questionId)) // Преобразуем ответы в список вопросов (в том порядке, как отвечали)
    .filter(Boolean) as Question[]; // Убираем undefined (если вопрос не найден) и приводим тип

  const currentQuestion = getQuestionById(currentQuestionId); // Текущий вопрос по id
  const showCurrentQuestion =
    currentQuestion &&
    !answers.some((a) => a.questionId === currentQuestion.id); // Показываем текущий вопрос, если на него ещё не отвечали

  const questionsToRender = [...answeredQuestions]; // Вопросы, на которые уже ответили
  if (showCurrentQuestion && currentQuestion) {
    questionsToRender.push(currentQuestion); // Добавляем текущий вопрос в конец списка
  }

  const getSelectedOption = (questionId: string) =>
    answers.find((a) => a.questionId === questionId)?.optionId; // Находим выбранный optionId для конкретного вопроса

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); // Автоскролл вниз при добавлении вопроса/рекомендации
  }, [questionsToRender.length, finalRecommendation]); // Триггер: кол-во карточек или появление рекомендации

  return (
    <div className="w-full" ref={containerRef}>
      <div className="w-full rounded-3xl bg-white p-4 md:p-8 shadow-sm border border-blue-100">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-8">
          {screen === "cervical" && "Скрининг на рак шейки матки"}{" "}
          {/* Заголовок для теста ШМ */}
          {screen === "breast" && "Скрининг на рак молочной железы"}{" "}
          {/* Заголовок для теста груди */}
          {screen === "start" && "OncoScreen"}{" "}
          {/* Заголовок на стартовом экране */}
        </h1>

        <div className="pb-8">
          <AnimatePresence mode="wait">
            {screen === "start" ? (
              <motion.div
                key="start" // ключ для корректного переключения AnimatePresence
                initial={{ opacity: 0 }} // анимация появления
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} // анимация исчезновения
                transition={{ duration: 0.25 }} // скорость анимации
              >
                <StartScreen onSelect={(next) => setScreen(next)} />{" "}
                {/* Выбор теста меняет screen */}
              </motion.div>
            ) : (
              <motion.div
                key="test"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div layout className="space-y-4 max-w-4xl mx-auto">
                    {questionsToRender.map((q) => {
                      const selectedOptionId = getSelectedOption(q.id); // Для вопроса q — какой вариант уже выбран

                      return (
                        <motion.div
                          key={q.id} // ключ карточки вопроса
                          className="rounded-2xl bg-white p-4 md:p-6"
                          initial={{ opacity: 0, y: 30 }} // появление снизу
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -30 }} // исчезновение вверх
                          transition={{ duration: 0.4 }}
                          layout // включаем layout-анимации при добавлении/удалении элементов
                        >
                          <p className="font-semibold text-base md:text-lg mb-4 text-black text-center">
                            {q.text} {/* Текст вопроса */}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {q.options.map((opt, index) => {
                              const isSelected = selectedOptionId === opt.id; // выбран ли именно этот вариант
                              const isDisabled = !!selectedOptionId; // если уже выбран любой вариант — блокируем остальные

                              const isLastOdd =
                                q.options.length % 2 === 1 &&
                                index === q.options.length - 1;
                              // Если вариантов нечётное число → последний нужно центрировать (чтобы не висел слева)

                              return (
                                <button
                                  key={opt.id} // ключ кнопки варианта
                                  disabled={isDisabled} // блокируем, если уже выбран ответ
                                  onClick={() =>
                                    handleAnswer(
                                      q.id,
                                      opt.id,
                                      opt.nextQuestionId
                                    )
                                  } // сохраняем ответ и переходим дальше (если нужно)
                                  className={`
                                    px-4 py-3 rounded-2xl border transition-all text-base md:text-lg
                                    break-words text-center whitespace-normal
                                    ${
                                      isLastOdd
                                        ? "sm:col-span-2 sm:justify-self-center sm:w-1/2"
                                        : ""
                                    } 
                                    ${
                                      isSelected
                                        ? "bg-blue-200 border-blue-300 text-blue-950" // стиль выбранного варианта
                                        : "bg-[#f3f6f8] border-transparent text-black" // стиль обычного варианта
                                    }
                                    ${
                                      isDisabled
                                        ? "opacity-70 cursor-not-allowed" // стиль заблокированных вариантов
                                        : "hover:border-blue-400 hover:shadow-md" // hover для доступных вариантов
                                    }
                                  `}
                                >
                                  {opt.label} {/* Текст кнопки */}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      );
                    })}
                    {finalRecommendation && (
                      <motion.div
                        key="recommendation" // ключ блока рекомендации
                        className="rounded-2xl bg-white p-4 md:p-6"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4 }}
                        layout
                      >
                        {/* В твоём файле рекомендация выводится как текст (ниже) */}
                        <p className="text-gray-800 mt-2 text-center">
                          {finalRecommendation}
                        </p>
                      </motion.div>
                    )}
                    <div ref={endRef} /> {/* Якорь для автоскролла */}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-4">
                  {/* Левая кнопка на десктопе, но на мобиле она уходит вниз (order-3) */}
                  <button
                    onClick={handleRestart} // возврат на выбор теста
                    className="rounded-2xl bg-gray-200 text-blue-950 font-medium py-3 px-6 hover:bg-gray-300 order-3 sm:order-1"
                  >
                    ← Вернуться к выбору теста
                  </button>

                  {/* Правый блок кнопок (на мобиле будет первым) */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:justify-end order-1 sm:order-2">
                    <button
                      onClick={handleBack} // шаг назад по истории ответов
                      disabled={answers.length === 0} // нельзя "назад", если нет ответов
                      className="rounded-2xl bg-gray-200 text-blue-950 font-medium py-3 px-6 hover:bg-gray-300 disabled:opacity-50"
                    >
                      Назад
                    </button>

                    <button
                      onClick={handleResetCurrentTest} // перезапуск текущего теста (без выхода на старт)
                      className="rounded-2xl bg-blue-200 text-blue-950 font-medium py-3 px-6 hover:bg-blue-300"
                    >
                      Начать заново
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default QuestionBlock; // Экспорт компонента по умолчанию
