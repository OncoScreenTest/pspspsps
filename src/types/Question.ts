// Тут указаны типы для вопроса (TypeScript) — чтобы questions.ts и QuestionBlock.tsx имели строгую структуру

export type QuestionOption = {
  id: string; // ID варианта ответа (например "o1")
  label: string; // Текст кнопки/варианта ответа
  nextQuestionId?: string; // ID следующего вопроса (если ветка продолжается)
};

export type Question = {
  id: string; // ID вопроса (например "q1.2MYASC-H")
  text: string; // Текст вопроса, который видит пользователь
  options: QuestionOption[]; // Список вариантов ответа
};

export type Answer = {
  questionId: string; // На какой вопрос ответили
  optionId: string; // Какой вариант выбрали
};
