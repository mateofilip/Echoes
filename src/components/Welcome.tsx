import React, { useEffect, useRef, useState } from "react";
import type { Quote } from "../types/Quote";
import { supabase } from "../db/supabase";
import StackInfo from "./StackInfo.tsx";
import QuoteToolbar, { type ToolbarRef } from "./Toolbar.tsx";

export default function Welcome() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorHovered, setIsAuthorHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const maskFlips = [
    { mask: "", img: "" },
    { mask: "scale-x-[-1]", img: "scale-x-[-1]" },
    { mask: "scale-y-[-1]", img: "scale-y-[-1]" },
    { mask: "scale-x-[-1] scale-y-[-1]", img: "scale-x-[-1] scale-y-[-1]" },
  ];
  const [flipIndex, setFlipIndex] = useState(0);
  const toolbarRef = useRef<ToolbarRef>(null);

  useEffect(() => {
    getQuote();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        toolbarRef.current?.triggerPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        toolbarRef.current?.triggerNext();
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        toolbarRef.current?.triggerReload();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const getQuote = async () => {
    try {
      setIsLoading(true);
      setIsTransitioning(true);

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

      setQuotes([{ quote: data.quote, author: data.author }, ...quotes]);
      setCurrentIndex(0);
      setIsTransitioning(false);
      setTimeout(() => setIsLoading(false), 450);
    } catch (error) {
      console.error(error);
      setQuotes([
        { quote: "Oops... Something went wrong.", author: "Unknown" },
      ]);
      setIsLoading(false);
    }
  };

  const getPreviousQuote = () => {
    if (currentIndex < quotes.length - 1) {
      setIsLoading(true);
      setIsTransitioning(true);
      setCurrentIndex(currentIndex + 1);
      setTimeout(() => setIsTransitioning(false), 200);
      setIsLoading(false);
    }
  };

  const getNextQuote = () => {
    if (currentIndex > 0) {
      setIsLoading(true);
      setIsTransitioning(true);
      setCurrentIndex(currentIndex - 1);
      setTimeout(() => setIsTransitioning(false), 200);
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="Redaction fixed top-0 right-0 left-0 mt-15 text-center text-4xl font-bold">
        Echoes
      </h1>

      <main className="flex h-dvh w-dvw flex-col justify-center px-5 sm:px-16 md:px-28 lg:px-52 xl:px-96 2xl:px-120">
        <div className="relative flex h-2/3 flex-col justify-center gap-10 p-10">
          <div
            className={`absolute inset-0 -z-10 overflow-hidden rounded-3xl p-4 transition-all duration-300 ${isAuthorHovered || isTransitioning ? "blur-none" : "blur-3xl"}`}
          >
            <div
              className={`absolute inset-0 h-full mask-[url(/mask.avif)] mask-contain mask-center mask-no-repeat ${maskFlips[flipIndex].mask}`}
            >
              <img
                src={`/authors/${quotes[currentIndex]?.author?.toLowerCase().replace(/\s+/g, "-")}-placeholder.avif`}
                onLoad={(e) => {
                  e.currentTarget.src = `/authors/${quotes[currentIndex]?.author?.toLowerCase().replace(/\s+/g, "-")}.avif`;
                }}
                alt={quotes[currentIndex]?.author || "Author"}
                className={`h-full w-full object-cover transition-opacity duration-200 ${isTransitioning ? "opacity-0" : "opacity-100"} ${maskFlips[flipIndex].img}`}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>

          <p
            className={`variableSize text-center transition-all duration-200 ease-out text-shadow-lg/30 ${isLoading || isAuthorHovered ? "opacity-0" : "opacity-100"}`}
          >
            <span>«&nbsp;</span>
            {quotes[currentIndex]?.quote
              ? `${quotes[currentIndex].quote}`
              : "Loading..."}
            <span>&nbsp;»</span>
          </p>
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(quotes[currentIndex]?.author || "")}`}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsAuthorHovered(true)}
            onMouseLeave={() => setIsAuthorHovered(false)}
            className={`ml-auto w-fit rounded-lg px-3 py-2 text-xl transition-all duration-200 ease-out text-shadow-lg/30 hover:backdrop-blur-xs md:text-2xl ${isLoading ? "opacity-0" : "opacity-100"}`}
          >
            —{" "}
            <span className="underline decoration-1">
              {quotes[currentIndex]?.author || "Loading..."}
            </span>
          </a>
        </div>

        <QuoteToolbar
          ref={toolbarRef}
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
