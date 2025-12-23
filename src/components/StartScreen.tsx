import { motion } from "framer-motion"; // Используем motion.div для плавного появления

type Props = {
  onSelect: (screen: "cervical" | "breast") => void; // Колбэк: какой тест выбрать (меняет screen в QuestionBlock)
};

export function StartScreen({ onSelect }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }} // стартовая прозрачность
      animate={{ opacity: 1 }} // появление
      exit={{ opacity: 0 }} // исчезновение
      transition={{ duration: 0.25 }} // скорость анимации
      className="w-full" // растягиваемся на ширину контейнера
    >
      <div className="flex flex-col gap-4">
        <button
          onClick={() => onSelect("cervical")} // выбираем тест шейки матки
          className={`
            px-4 py-4 rounded-2xl border transition-all text-base md:text-lg
            break-words text-center whitespace-normal
            bg-[#f3f6f8] border-transparent text-black
            hover:border-blue-400 hover:shadow-md
          `}
        >
          Скрининг на рак шейки матки
        </button>

        <button
          onClick={() => onSelect("breast")} // выбираем тест молочной железы
          className={`
            px-4 py-4 rounded-2xl border transition-all text-base md:text-lg
            break-words text-center whitespace-normal
            bg-[#f3f6f8] border-transparent text-black
            hover:border-blue-400 hover:shadow-md
          `}
        >
          Скрининг на рак молочной железы
        </button>
      </div>
    </motion.div>
  );
}
