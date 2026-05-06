import React, { useEffect, useState } from "react";
import type { Quote } from "../types/Quote";
import { supabase } from "../db/supabase";
import StackInfo from "./StackInfo.tsx";
import Toolbar from "./Toolbar.tsx";
import Dostoevsky from "../assets/dostoevsky.jpg?url";

export default function Welcome() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [reloading, isReloading] = useState(false);

  useEffect(() => {
    getQuote();
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

      const { data, error } = await supabase
        .rpc("get_random_quote")
        .single<{ quote: string; author: string }>();

      if (!data) throw new Error(error?.message || "Unknown error");

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
      }, 500);
    } catch (error) {
      console.error(error);
      setQuotes([
        { quote: "Oops... Something went wrong.", author: "Unknown" },
      ]);
      isReloading(false);
    }
  };

  const getPreviousQuote = () => {
    if (currentIndex < quotes.length - 1) {
      isReloading(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        isReloading(false);
      }, 500);
    }
  };

  const getNextQuote = () => {
    if (currentIndex > 0) {
      isReloading(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        isReloading(false);
      }, 500);
    }
  };

  return (
    <>
      <h1 className="Redaction fixed top-0 right-0 left-0 mt-15 text-center text-4xl font-bold">
        Echoes
      </h1>

      <main className="flex h-dvh w-dvw flex-col justify-center px-5 sm:px-16 md:px-28 lg:px-52 xl:px-96 2xl:px-120">
        <div className="relative flex h-2/3 flex-col justify-center gap-20 p-10">
          <img
            src={Dostoevsky}
            alt="Dostoevsky"
            className="absolute inset-0 -z-10 h-full w-full rounded-md object-cover blur-md"
          />

          <p
            className={`variableSize text-center transition-all duration-200 ease-out text-shadow-lg/30 ${reloading ? "opacity-0" : "opacity-100"}`}
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
            —{" "}
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(quotes[currentIndex]?.author || "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {quotes[currentIndex]?.author || "Loading..."}
            </a>
          </h2>
        </div>

        <Toolbar
          onNewQuote={getQuote}
          onPreviousQuote={getPreviousQuote}
          onNextQuote={getNextQuote}
          canGoPrevious={currentIndex < quotes.length - 1}
          canGoNext={currentIndex > 0}
        />
      </main>

      <StackInfo />
    </>
  );
}
