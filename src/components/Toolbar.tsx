import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { motion } from "motion/react";

interface QuoteToolbarProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  onNewQuote?: () => void;
  onPreviousQuote?: () => void;
  onNextQuote?: () => void;
}

interface ToolbarRef {
  triggerReload: () => void;
  triggerPrev: () => void;
  triggerNext: () => void;
}

const QuoteToolbar = forwardRef<ToolbarRef, QuoteToolbarProps>(
  (
    { canGoPrevious, canGoNext, onNewQuote, onPreviousQuote, onNextQuote },
    ref,
  ) => {
    const [isReloadingButton, setIsReloadingButton] = useState(false);
    const [isPrevAnimating, setIsPrevAnimating] = useState(false);
    const [isNextAnimating, setIsNextAnimating] = useState(false);

    useImperativeHandle(ref, () => ({
      triggerReload: () => setIsReloadingButton(true),
      triggerPrev: () => canGoPrevious && setIsPrevAnimating(true),
      triggerNext: () => canGoNext && setIsNextAnimating(true),
    }));

    useEffect(() => {
      if (isReloadingButton) {
        onNewQuote?.();
        setTimeout(() => setIsReloadingButton(false), 500);
      }
    }, [isReloadingButton]);

    useEffect(() => {
      if (isPrevAnimating) {
        onPreviousQuote?.();
        setTimeout(() => setIsPrevAnimating(false), 500);
      }
    }, [isPrevAnimating]);

    useEffect(() => {
      if (isNextAnimating) {
        onNextQuote?.();
        setTimeout(() => setIsNextAnimating(false), 500);
      }
    }, [isNextAnimating]);

    return (
      <div className="absolute right-1/2 bottom-4 left-1/2 flex justify-center gap-2">
        <motion.button
          onClick={() => setIsReloadingButton(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`group relative w-fit cursor-pointer rounded-lg border border-stone-800 bg-stone-900 p-3`}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            animate={{
              rotate: isReloadingButton ? 240 : 0,
              scale: isReloadingButton ? 1.25 : 1,
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
          <div className="Alte invisible absolute -top-16 left-1/2 -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-300">
            <div className="flex items-center gap-2 rounded-2xl bg-stone-900 p-3 text-xs whitespace-nowrap text-orange-200 shadow-2xl">
              New Quote
              <span className="inline-flex min-w-6 items-center justify-center rounded-md border border-stone-700 bg-stone-800 px-2 py-1 font-mono text-[10px]">
                R
              </span>
            </div>
            <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 rounded-br-sm bg-stone-900 shadow-xl"></div>
          </div>
        </motion.button>

        <motion.button
          onClick={() => canGoPrevious && setIsPrevAnimating(true)}
          whileHover={canGoPrevious ? { scale: 1.05 } : undefined}
          whileTap={canGoPrevious ? { scale: 0.95 } : undefined}
          className="group relative w-fit cursor-pointer rounded-lg border border-stone-800 bg-stone-900 p-3 disabled:cursor-not-allowed disabled:border-stone-700 disabled:text-stone-600"
          disabled={!canGoPrevious}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            animate={{
              scale: isPrevAnimating ? 1.25 : 1,
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
          <div className="Alte invisible absolute -top-16 left-1/2 -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-300">
            <div className="flex items-center gap-2 rounded-2xl bg-stone-900 p-3 text-xs whitespace-nowrap text-orange-200 shadow-2xl">
              Previous Quote
              <span className="inline-flex min-w-6 items-center justify-center rounded-md border border-stone-700 bg-stone-800 px-2 py-1 font-mono text-[10px]">
                ←
              </span>
            </div>
            <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 rounded-br-sm bg-stone-900 shadow-xl"></div>
          </div>
        </motion.button>

        <motion.button
          onClick={() => canGoNext && setIsNextAnimating(true)}
          whileHover={canGoNext ? { scale: 1.05 } : undefined}
          whileTap={canGoNext ? { scale: 0.95 } : undefined}
          className="group relative w-fit cursor-pointer rounded-lg border border-stone-800 bg-stone-900 p-3 disabled:cursor-not-allowed disabled:border-stone-700 disabled:text-stone-600"
          disabled={!canGoNext}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            animate={{ scale: isNextAnimating ? 1.25 : 1 }}
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

          <div className="Alte invisible absolute -top-16 left-1/2 -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-300">
            <div className="flex items-center gap-2 rounded-2xl bg-stone-900 p-3 text-xs whitespace-nowrap text-orange-200 shadow-2xl">
              Next Quote
              <span className="inline-flex min-w-6 items-center justify-center rounded-md border border-stone-700 bg-stone-800 px-2 py-1 font-mono text-[10px]">
                →
              </span>
            </div>
            <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 rounded-br-sm bg-stone-900 shadow-xl"></div>
          </div>
        </motion.button>
      </div>
    );
  },
);

export type { ToolbarRef };

export default QuoteToolbar;
