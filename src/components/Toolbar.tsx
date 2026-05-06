import { useState } from "react";

interface QuoteToolbarProps {
  onNewQuote: () => void;
  onPreviousQuote: () => void;
  onNextQuote: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export default function QuoteToolbar({
  onNewQuote,
  onPreviousQuote,
  onNextQuote,
  canGoPrevious,
  canGoNext,
}: QuoteToolbarProps) {
  const [isReloadingButton, setIsReloadingButton] = useState(false);
  const [isPrevAnimating, setIsPrevAnimating] = useState(false);
  const [isNextAnimating, setIsNextAnimating] = useState(false);

  const handleNewQuote = () => {
    setIsReloadingButton(true);
    onNewQuote();
    setTimeout(() => setIsReloadingButton(false), 500);
  };

  const handlePreviousQuote = () => {
    if (canGoPrevious) {
      setIsPrevAnimating(true);
      onPreviousQuote();
      setTimeout(() => setIsPrevAnimating(false), 500);
    }
  };

  const handleNextQuote = () => {
    if (canGoNext) {
      setIsNextAnimating(true);
      onNextQuote();
      setTimeout(() => setIsNextAnimating(false), 500);
    }
  };

  return (
    <div className="absolute right-1/2 bottom-4 left-1/2 flex justify-center gap-2">
      <button
        onClick={handleNewQuote}
        className="group relative w-fit cursor-pointer rounded-lg border-2 border-gray-700 p-3 shadow-none transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg dark:border-orange-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          className={`${isReloadingButton ? "rotate-240" : ""} transition-all duration-200`}
          viewBox="0 0 15 15"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M1.85 7.5c0-2.835 2.21-5.65 5.65-5.65 2.778 0 4.152 2.056 4.737 3.15H10.5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-1 0v1.813C12.296 3.071 10.666.85 7.5.85 3.437.85.85 4.185.85 7.5s2.587 6.65 6.65 6.65c1.944 0 3.562-.77 4.714-1.942a6.8 6.8 0 0 0 1.428-2.167.5.5 0 1 0-.925-.38 5.8 5.8 0 0 1-1.216 1.846c-.971.99-2.336 1.643-4.001 1.643-3.44 0-5.65-2.815-5.65-5.65"
            clipRule="evenodd"
          />
        </svg>
        <span className="Alte absolute -top-15 left-1/2 z-10 -translate-x-1/2 translate-y-2 rounded-2xl border border-stone-700/60 bg-stone-900/95 p-3 text-xs whitespace-nowrap text-orange-50 opacity-0 shadow-2xl ring-1 ring-stone-600/40 backdrop-blur-md transition-all duration-200 ease-out group-hover:-translate-y-0 group-hover:opacity-100 group-hover:delay-300 group-focus-visible:-translate-y-0 group-focus-visible:opacity-100 group-focus-visible:delay-300">
          <span className="mr-2">New Quote</span>
          <span className="inline-flex min-w-6 items-center justify-center rounded-md border-1 border-stone-600 bg-stone-800 px-2 py-1 font-mono text-[10px] text-orange-50">
            R
          </span>
          <span className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-b-0 border-x-transparent border-t-stone-900"></span>
        </span>
      </button>

      <button
        onClick={handlePreviousQuote}
        className="group relative w-fit cursor-pointer rounded-lg border-2 border-gray-700 p-3 shadow-none transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:border-gray-400 disabled:text-gray-400 disabled:hover:scale-none disabled:hover:shadow-none dark:border-orange-200"
        disabled={!canGoPrevious}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          className={`transition-transform duration-200 ${isPrevAnimating ? "scale-125" : "scale-100"}`}
          viewBox="0 0 15 15"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M4.854 2.146a.5.5 0 0 1 0 .708L3.707 4H9a4.5 4.5 0 1 1 0 9H5a.5.5 0 0 1 0-1h4a3.5 3.5 0 1 0 0-7H3.707l1.147 1.146a.5.5 0 1 1-.708.708l-2-2a.5.5 0 0 1 0-.708l2-2a.5.5 0 0 1 .708 0"
            clipRule="evenodd"
          />
        </svg>
        <span className="Alte absolute -top-15 left-1/2 z-10 -translate-x-1/2 translate-y-2 rounded-2xl border border-stone-700/60 bg-stone-900/95 p-3 text-xs whitespace-nowrap text-orange-50 opacity-0 shadow-2xl ring-1 ring-stone-600/40 backdrop-blur-md transition-all duration-200 ease-out group-hover:-translate-y-0 group-hover:opacity-100 group-hover:delay-300 group-focus-visible:-translate-y-0 group-focus-visible:opacity-100 group-focus-visible:delay-300">
          <span className="mr-2">Previous Quote</span>
          <span className="inline-flex min-w-6 items-center justify-center rounded-md border-1 border-stone-600 bg-stone-800 px-2 py-1 font-mono text-[10px] text-orange-50">
            ←
          </span>
          <span className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-b-0 border-x-transparent border-t-stone-900"></span>
        </span>
      </button>

      <button
        onClick={handleNextQuote}
        className="group relative w-fit cursor-pointer rounded-lg border-2 border-gray-700 p-3 shadow-none transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:border-gray-400 disabled:text-gray-400 disabled:hover:scale-none disabled:hover:shadow-none dark:border-orange-200"
        disabled={!canGoNext}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          className={`transition-transform duration-200 ${isNextAnimating ? "scale-125" : "scale-100"}`}
          viewBox="0 0 15 15"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M8.146 3.146a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L11.293 8H2.5a.5.5 0 0 1 0-1h8.793L8.146 3.854a.5.5 0 0 1 0-.708"
            clipRule="evenodd"
          />
        </svg>

        <span className="Alte absolute -top-15 left-1/2 z-10 -translate-x-1/2 translate-y-2 rounded-2xl border border-stone-700/60 bg-stone-900/95 p-3 text-xs whitespace-nowrap text-orange-50 opacity-0 shadow-2xl ring-1 ring-stone-600/40 backdrop-blur-md transition-all duration-200 ease-out group-hover:-translate-y-0 group-hover:opacity-100 group-hover:delay-300 group-focus-visible:-translate-y-0 group-focus-visible:opacity-100 group-focus-visible:delay-300">
          <span className="mr-2">Next Quote</span>
          <span className="inline-flex min-w-6 items-center justify-center rounded-md border-1 border-stone-600 bg-stone-800 px-2 py-1 font-mono text-[10px] text-orange-50">
            →
          </span>
          <span className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-b-0 border-x-transparent border-t-stone-900"></span>
        </span>
      </button>
    </div>
  );
}
