import React, { useEffect, useState } from "react";
import type { Quote } from "../types/Quote";
import { supabase } from "../db/supabase";
import StackInfo from "./StackInfo.tsx";
import Toolbar from "./Toolbar.tsx";

const authorImages: Record<string, string> = {
  dostoevsky: "dostoevsky.jpg",
  nietzsche: "nietzsche.jpg",
  shakespeare: "shakespeare.jpg",
  aristotle: "aristotle.jpg",
  confucius: "confucius.jpg",
  einstein: "einstein.jpg",
  huxley: "huxley.jpg",
  orwell: "orwell.jpg",
  plato: "plato.jpg",
  socrates: "socrates.jpg",
  tolstoy: "tolstoy.jpg",
};

const getAuthorImage = (author: string | undefined) => {
  const authorLower = author?.toLowerCase() || "";
  const matched = Object.keys(authorImages).find((name) =>
    authorLower.includes(name),
  );
  return matched ? `/${authorImages[matched]}` : "/unknown.jpg";
};

export default function Welcome() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [reloading, isReloading] = useState(false);
  const [isAuthorHovered, setIsAuthorHovered] = useState(false);

  const currentAuthorImage = getAuthorImage(quotes[currentIndex]?.author);

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
        <div className="relative flex h-2/3 flex-col justify-center gap-10 p-10">
          <img
            src={currentAuthorImage}
            alt={quotes[currentIndex]?.author || "Author"}
            className={`absolute inset-0 -z-10 h-full w-full rounded-2xl object-cover transition-all duration-300 ${isAuthorHovered ? "blur-none" : "blur-3xl"}`}
          />

          <p
            className={`variableSize text-center transition-all duration-200 ease-out text-shadow-lg/30 ${reloading || isAuthorHovered ? "opacity-0" : "opacity-100"}`}
          >
            <span>«&nbsp;</span>
            {quotes[currentIndex]?.quote
              ? `${quotes[currentIndex].quote}`
              : "Loading..."}
            <span>&nbsp;»</span>
          </p>
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(quotes[currentIndex]?.quote || "")}`}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsAuthorHovered(true)}
            onMouseLeave={() => setIsAuthorHovered(false)}
            className={`ml-auto w-fit rounded-lg px-3 py-2 text-xl transition-all duration-200 ease-out text-shadow-lg/30 hover:backdrop-blur-xs md:text-2xl ${reloading ? "opacity-0" : "opacity-100"}`}
          >
            —{" "}
            <span className="underline">
              {quotes[currentIndex]?.author || "Loading..."}
            </span>
          </a>
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
