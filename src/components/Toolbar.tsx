import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { motion } from "motion/react";

interface QuoteToolbarProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  onNewQuote?: () => void;
  onPreviousQuote?: () => void;
  onNextQuote?: () => void;
  onToggleSaveQuote?: () => void;
  isSaved?: boolean;
}

interface ToolbarRef {
  triggerReload: () => void;
  triggerPrev: () => void;
  triggerNext: () => void;
  triggerSave: () => void;
}

const QuoteToolbar = forwardRef<ToolbarRef, QuoteToolbarProps>(
  (
    {
      canGoPrevious,
      canGoNext,
      onNewQuote,
      onPreviousQuote,
      onNextQuote,
      onToggleSaveQuote,
      isSaved,
    },
    ref,
  ) => {
    const [activeButton, setActiveButton] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      triggerReload: () => setActiveButton("reload"),
      triggerPrev: () => canGoPrevious && setActiveButton("prev"),
      triggerNext: () => canGoNext && setActiveButton("next"),
      triggerSave: () => setActiveButton("save"),
    }), [canGoPrevious, canGoNext]);

    useEffect(() => {
      if (!activeButton) return;
      if (activeButton === "reload") onNewQuote?.();
      else if (activeButton === "prev") onPreviousQuote?.();
      else if (activeButton === "next") onNextQuote?.();
      else if (activeButton === "save") onToggleSaveQuote?.();
      const timeout = setTimeout(() => setActiveButton(null), 500);
      return () => clearTimeout(timeout);
    }, [activeButton]);

    return (
      <div className="absolute right-1/2 bottom-4 left-1/2 flex justify-center gap-2 text-xs">
        <motion.button
          onClick={() => setActiveButton("reload")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-stone-800 bg-stone-900 p-3 text-white shadow-lg transition-all hover:scale-110 hover:bg-stone-800 focus:outline-none active:scale-95`}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            animate={{
              rotate: activeButton === "reload" ? 240 : 0,
              scale: activeButton === "reload" ? 1.25 : 1,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            viewBox="0 0 15 15"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M1.85 7.5c0-2.835 2.21-5.65 5.65-5.65 2.778 0 4.152 2.056 4.737 3.15H10.5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-1 0v1.813C12.296 3.071 10.666.85 7.5.85 3.437.85.85 4.185.85 7.5s2.587 6.65 6.65 6.65c1.944 0 3.562-.77 4.714-1.942a6.8 6.8 0 0 0 1.428-2.167.5.5 0 1 0-.925-.38 5.8 5.8 0 0 1-1.216 1.846c-.971.99-2.336 1.643-4.001 1.643-3.44 0-5.65-2.815-5.65-5.65"
              clipRule="evenodd"
            />
          </motion.svg>
          <div className="Geist invisible absolute bottom-10 flex translate-y-2 flex-col items-center opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-300">
            <div className="flex items-center gap-2 rounded-full border border-stone-800 bg-stone-950 px-3 py-2 text-[10px] whitespace-nowrap text-white">
              New Quote
              <span className="inline-grid w-fit place-items-center rounded-lg border border-stone-700 bg-stone-800 px-2 py-1 font-mono">
                R
              </span>
            </div>
            <div className="h-2 w-2 -translate-y-1 rotate-45 rounded-br-sm border-r border-b border-stone-800 bg-stone-950 shadow-lg"></div>
          </div>
        </motion.button>

        <motion.button
          onClick={() => canGoPrevious && setActiveButton("prev")}
          whileHover={canGoPrevious ? { scale: 1.05 } : undefined}
          whileTap={canGoPrevious ? { scale: 0.95 } : undefined}
          className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-stone-800 bg-stone-900 p-3 text-white shadow-lg transition-all hover:scale-110 hover:bg-stone-800 focus:outline-none active:scale-95 disabled:pointer-events-none disabled:border-stone-700 disabled:text-stone-600"
          disabled={!canGoPrevious}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            animate={{
              scale: activeButton === "prev" ? 1.25 : 1,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            viewBox="0 0 15 15"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M4.854 2.146a.5.5 0 0 1 0 .708L3.707 4H9a4.5 4.5 0 1 1 0 9H5a.5.5 0 0 1 0-1h4a3.5 3.5 0 1 0 0-7H3.707l1.147 1.146a.5.5 0 1 1-.708.708l-2-2a.5.5 0 0 1 0-.708l2-2a.5.5 0 0 1 .708 0"
              clipRule="evenodd"
            />
          </motion.svg>

          <div className="Geist invisible absolute bottom-10 flex translate-y-2 flex-col items-center opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-300">
            <div className="flex items-center gap-2 rounded-full border border-stone-800 bg-stone-950 px-3 py-2 text-[10px] whitespace-nowrap text-white">
              Previous Quote
              <span className="inline-grid w-fit place-items-center rounded-lg border border-stone-700 bg-stone-800 px-2 py-1 font-mono">
                ←
              </span>
            </div>
            <div className="h-2 w-2 -translate-y-1 rotate-45 rounded-br-sm border-r border-b border-stone-800 bg-stone-950 shadow-lg"></div>
          </div>
        </motion.button>

        <motion.button
          onClick={() => canGoNext && setActiveButton("next")}
          whileHover={canGoNext ? { scale: 1.05 } : undefined}
          whileTap={canGoNext ? { scale: 0.95 } : undefined}
          className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-stone-800 bg-stone-900 p-3 text-white shadow-lg transition-all hover:scale-110 hover:bg-stone-800 focus:outline-none active:scale-95 disabled:pointer-events-none disabled:text-stone-600"
          disabled={!canGoNext}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            animate={{ scale: activeButton === "next" ? 1.25 : 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            viewBox="0 0 15 15"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M8.146 3.146a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L11.293 8H2.5a.5.5 0 0 1 0-1h8.793L8.146 3.854a.5.5 0 0 1 0-.708"
              clipRule="evenodd"
            />
          </motion.svg>

          <div className="Geist invisible absolute bottom-10 flex translate-y-2 flex-col items-center opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-300">
            <div className="flex items-center gap-2 rounded-full border border-stone-800 bg-stone-950 px-3 py-2 text-[10px] whitespace-nowrap text-white">
              Next Quote
              <span className="inline-grid w-fit place-items-center rounded-lg border border-stone-700 bg-stone-800 px-2 py-1 font-mono">
                →
              </span>
            </div>
            <div className="h-2 w-2 -translate-y-1 rotate-45 rounded-br-sm border-r border-b border-stone-800 bg-stone-950 shadow-lg"></div>
          </div>
        </motion.button>

        <motion.button
          onClick={() => setActiveButton("save")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-stone-800 bg-stone-900 p-3 text-white shadow-lg transition-all hover:scale-110 hover:bg-stone-800 focus:outline-none active:scale-95"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            animate={{
              scale: activeButton === "save" ? 1.25 : 1,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            viewBox="0 0 15 15"
          >
            {isSaved ? (
              <path
                d="M3.5 2C3.22386 2 3 2.22386 3 2.5V13.5C3 13.6818 3.09864 13.8492 3.25762 13.9373C3.41659 14.0254 3.61087 14.0203 3.765 13.924L7.5 11.5896L11.235 13.924C11.3891 14.0203 11.5834 14.0254 11.7424 13.9373C11.9014 13.8492 12 13.6818 12 13.5V2.5C12 2.22386 11.7761 2 11.5 2H3.5Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            ) : (
              <path
                d="M3 2.5C3 2.22386 3.22386 2 3.5 2H11.5C11.7761 2 12 2.22386 12 2.5V13.5C12 13.6818 11.9014 13.8492 11.7424 13.9373C11.5834 14.0254 11.3891 14.0203 11.235 13.924L7.5 11.5896L3.765 13.924C3.61087 14.0203 3.41659 14.0254 3.25762 13.9373C3.09864 13.8492 3 13.6818 3 13.5V2.5ZM4 3V12.5979L6.97 10.7416C7.29427 10.539 7.70573 10.539 8.03 10.7416L11 12.5979V3H4Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            )}
          </motion.svg>
          <div className="Geist invisible absolute bottom-10 flex translate-y-2 flex-col items-center opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-300">
            <div className="flex items-center gap-2 rounded-full border border-stone-800 bg-stone-950 px-3 py-2 text-[10px] whitespace-nowrap text-white">
              {isSaved ? "Remove from Favorites" : "Save Quote"}
              <span className="inline-grid w-fit place-items-center rounded-lg border border-stone-700 bg-stone-800 px-2 py-1 font-mono">
                S
              </span>
            </div>
            <div className="h-2 w-2 -translate-y-1 rotate-45 rounded-br-sm border-r border-b border-stone-800 bg-stone-950 shadow-lg"></div>
          </div>
        </motion.button>
      </div>
    );
  },
);

export type { ToolbarRef };

export default QuoteToolbar;
