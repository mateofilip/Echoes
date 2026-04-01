import React, { useEffect, useState } from "react";
import type { Quote } from "../types/Quote";
import { supabase } from "../db/supabase";

export default function Welcome() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [reloading, isReloading] = useState(false);
  const [isReloadingButton, setIsReloadingButton] = useState(false);
  const [isNextAnimating, setIsNextAnimating] = useState(false);
  const [isPrevAnimating, setIsPrevAnimating] = useState(false);

  useEffect(() => {
    getQuote();
    const selectedTheme = localStorage.getItem("theme");

    if (selectedTheme) {
      document.body.classList.add(selectedTheme);
      setIsDark(selectedTheme === "dark"); // Sync isDark state
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark");
      setIsDark(true); // Sync isDark state
    } else {
      document.body.classList.add("light");
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        getPreviousQuote();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        getNextQuote();
      } else if (e.key.toLowerCase() === "t") {
        e.preventDefault();
        toggleTheme();
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        getQuote();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [currentIndex, quotes, isDark]);

  const getQuote = async () => {
    try {
      isReloading(true);
      setIsReloadingButton(true);

      const { data, error } = await supabase
        .rpc("get_random_quote")
        .single<{ quote: string; author: string }>();

      if (!data) throw new Error(error?.message || "Unknown error");

      // Check for duplicate
      const isDuplicate = quotes.some(
        (q) => q.quote === data.quote && q.author === data.author,
      );

      if (isDuplicate) {
        return getQuote();
      }

      setTimeout(() => {
        setQuotes([{ quote: data.quote, author: data.author }, ...quotes]);
        setCurrentIndex(0);
        isReloading(false);
        setIsReloadingButton(false);
      }, 500);
      console.log(quotes);
    } catch (error) {
      console.error(error);
      setQuotes([
        { quote: "Oops... Something went wrong.", author: "Unknown" },
      ]);
      isReloading(false);
      setIsReloadingButton(false);
    }
  };

  const toggleTheme = () => {
    const currentTheme = localStorage.getItem("theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    setIsDark(newTheme === "dark"); // Update state immediately
    localStorage.setItem("theme", newTheme);
    document.body.classList.toggle("dark");
  };

  const getPreviousQuote = () => {
    if (currentIndex < quotes.length - 1) {
      isReloading(true);
      setIsPrevAnimating(true); // Trigger previous button animation
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        isReloading(false);
        setIsPrevAnimating(false); // Stop previous button animation
      }, 500);
    }
  };

  const getNextQuote = () => {
    if (currentIndex > 0) {
      isReloading(true);
      setIsNextAnimating(true); // Trigger next button animation
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        isReloading(false);
        setIsNextAnimating(false); // Stop next button animation
      }, 500);
    }
  };

  return (
    <>
      <h1 className="Redaction fixed top-0 right-0 left-0 mt-15 text-center text-4xl font-bold">
        Echoes
      </h1>

      <main className="flex h-dvh w-dvw flex-col justify-center px-5 sm:px-16 md:px-28 lg:px-52 xl:px-96 2xl:px-120">
        <div className="flex h-dvh flex-col justify-center gap-30">
          <div className="flex flex-col justify-between gap-20">
            <p
              className={`variableSize text-center transition-all duration-200 ease-out ${reloading ? "opacity-0" : "opacity-100"}`}
            >
              <span>«&nbsp;</span>
              {quotes[currentIndex]?.quote
                ? `${quotes[currentIndex].quote}`
                : "Loading..."}
              <span>&nbsp;»</span>
            </p>
            <h2
              className={`text-right text-xl transition-all duration-200 ease-out md:text-2xl ${reloading ? "opacity-0" : "opacity-100"}`}
            >
              — {quotes[currentIndex]?.author || "Loading..."}
            </h2>
          </div>
        </div>
        <div className="fixed right-0 bottom-0 left-0 mb-30 flex justify-center gap-2">
          <button
            onClick={getQuote}
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
            className="group relative w-fit cursor-pointer rounded-lg border-2 border-gray-700 p-3 shadow-none transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg dark:border-orange-200"
            onClick={toggleTheme}
          >
            <span className="relative block h-5 w-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                className={`absolute top-0 left-0 transition-all duration-200 ${
                  isDark
                    ? "scale-75 rotate-90 opacity-0"
                    : "scale-100 rotate-0 opacity-100"
                }`}
                viewBox="0 0 15 15"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M7.5 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5M2.197 2.197a.5.5 0 0 1 .707 0L4.318 3.61a.5.5 0 0 1-.707.707L2.197 2.904a.5.5 0 0 1 0-.707M.5 7a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm1.697 5.803a.5.5 0 0 1 0-.707l1.414-1.414a.5.5 0 1 1 .707.707l-1.414 1.414a.5.5 0 0 1-.707 0M12.5 7a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm-1.818-2.682a.5.5 0 0 1 0-.707l1.414-1.414a.5.5 0 1 1 .707.707L11.39 4.318a.5.5 0 0 1-.707 0M8 12.5a.5.5 0 0 0-1 0v2a.5.5 0 0 0 1 0zm2.682-1.818a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 1 1-.707.707l-1.414-1.414a.5.5 0 0 1 0-.707M5.5 7.5a2 2 0 1 1 4 0 2 2 0 0 1-4 0m2-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6"
                  clipRule="evenodd"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                className={`absolute top-0 left-0 transition-all duration-200 ${
                  isDark
                    ? "scale-100 rotate-0 opacity-100"
                    : "scale-75 -rotate-90 opacity-0"
                }`}
                viewBox="0 0 15 15"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M2.9.5a.4.4 0 0 0-.8 0v.6h-.6a.4.4 0 1 0 0 .8h.6v.6a.4.4 0 1 0 .8 0v-.6h.6a.4.4 0 0 0 0-.8h-.6zm3 3a.4.4 0 1 0-.8 0v.6h-.6a.4.4 0 1 0 0 .8h.6v.6a.4.4 0 1 0 .8 0v-.6h.6a.4.4 0 0 0 0-.8h-.6zm-4 3a.4.4 0 1 0-.8 0v.6H.5a.4.4 0 1 0 0 .8h.6v.6a.4.4 0 0 0 .8 0v-.6h.6a.4.4 0 0 0 0-.8h-.6zM8.544.982l-.298-.04c-.213-.024-.34.224-.217.4q.211.305.389.632A6.602 6.602 0 0 1 2.96 11.69c-.215.012-.334.264-.184.417q.103.105.21.206l.072.066.26.226.188.148.121.09.187.131.176.115q.18.115.37.217l.264.135.26.12.303.122.244.086a6.6 6.6 0 0 0 1.103.26l.317.04.267.02q.19.011.384.011a6.6 6.6 0 0 0 6.56-7.339l-.038-.277a6.6 6.6 0 0 0-.384-1.415l-.113-.268-.077-.166-.074-.148a6.6 6.6 0 0 0-.546-.883l-.153-.2-.199-.24-.163-.18-.12-.124-.16-.158-.223-.2-.32-.26-.245-.177-.292-.19-.321-.186-.328-.165-.113-.052-.24-.101-.276-.104-.252-.082-.325-.09-.265-.06zm1.86 4.318a7.6 7.6 0 0 0-.572-2.894 5.601 5.601 0 1 1-4.748 10.146 7.6 7.6 0 0 0 3.66-2.51.749.749 0 0 0 1.355-.442.75.75 0 0 0-.584-.732q.093-.174.178-.355A1.25 1.25 0 1 0 10.35 6.2q.052-.442.052-.9"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span className="Alte absolute -top-15 left-1/2 z-10 -translate-x-1/2 translate-y-2 rounded-2xl border border-stone-700/60 bg-stone-900/95 p-3 text-xs whitespace-nowrap text-orange-50 opacity-0 shadow-2xl ring-1 ring-stone-600/40 backdrop-blur-md transition-all duration-200 ease-out group-hover:-translate-y-0 group-hover:opacity-100 group-hover:delay-300 group-focus-visible:-translate-y-0 group-focus-visible:opacity-100 group-focus-visible:delay-300">
              <span className="mr-2">Toggle Theme</span>
              <span className="inline-flex min-w-6 items-center justify-center rounded-md border-1 border-stone-600 bg-stone-800 px-2 py-1 font-mono text-[10px] text-orange-50">
                T
              </span>
              <span className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-b-0 border-x-transparent border-t-stone-900"></span>
            </span>
          </button>

          <button
            onClick={getPreviousQuote}
            className="group relative w-fit cursor-pointer rounded-lg border-2 border-gray-700 p-3 shadow-none transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:border-gray-400 disabled:text-gray-400 disabled:hover:scale-none disabled:hover:shadow-none dark:border-orange-200"
            disabled={currentIndex === quotes.length - 1}
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
            onClick={getNextQuote}
            className="group relative w-fit cursor-pointer rounded-lg border-2 border-gray-700 p-3 shadow-none transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:border-gray-400 disabled:text-gray-400 disabled:hover:scale-none disabled:hover:shadow-none dark:border-orange-200"
            disabled={currentIndex === 0}
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
      </main>
    </>
  );
}
