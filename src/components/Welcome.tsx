import { useEffect, useMemo, useRef, useState } from "react";
import type { Quote } from "../types/Quote";
import { supabase } from "../db/supabase";
import StackInfo from "./StackInfo.tsx";
import QuoteToolbar, { type ToolbarRef } from "./Toolbar.tsx";
import VaulDrawer from "./Drawer.tsx";
import FirefoxNotice from "./FirefoxNotice.tsx";

import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

const STORAGE_KEY = "echoes-saved-quotes";

export default function Welcome() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAuthorHovered, setIsAuthorHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const toggleSaveQuote = () => {
    const currentQuote = quotes[currentIndex];
    if (!currentQuote) return;
    setSavedQuotes((prev) => {
      const isAlreadySaved = prev.some((q) => q.quote === currentQuote.quote && q.author === currentQuote.author);
      const newSaved = isAlreadySaved
        ? prev.filter((q) => !(q.quote === currentQuote.quote && q.author === currentQuote.author))
        : [...prev, currentQuote];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaved));
      return newSaved;
    });
  };

  const removeQuote = (quote: Quote) => {
    setSavedQuotes((prev) => {
      const newSaved = prev.filter((q) => !(q.quote === quote.quote && q.author === quote.author));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaved));
      return newSaved;
    });
  };

  const isCurrentQuoteSaved = quotes[currentIndex]
    ? savedQuotes.some(
        (q) =>
          q.quote === quotes[currentIndex].quote &&
          q.author === quotes[currentIndex].author,
      )
    : false;

  const maskFlips = useMemo(
    () => [
      { mask: "", img: "" },
      { mask: "scale-x-[-1]", img: "scale-x-[-1]" },
      { mask: "scale-y-[-1]", img: "scale-y-[-1]" },
      { mask: "scale-x-[-1] scale-y-[-1]", img: "scale-x-[-1] scale-y-[-1]" },
    ],
    [],
  );
  const [flipIndex, setFlipIndex] = useState(0);
  const toolbarRef = useRef<ToolbarRef>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStackOpen, setIsStackOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Apple: 1:1 tracking — parallax follows pointer, decomposed X/Y springs
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 90, damping: 22, mass: 0.6 });
  const springY = useSpring(my, { stiffness: 90, damping: 22, mass: 0.6 });
  const imageX = useTransform(springX, (v) => v * 14);
  const imageY = useTransform(springY, (v) => v * 10);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (prefersReducedMotion || isTransitioning) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(nx);
    my.set(ny);
  };
  const handlePointerLeaveCard = () => {
    mx.set(0);
    my.set(0);
  };

  const scheduleTransitionEnd = () => {
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    transitionTimeoutRef.current = setTimeout(
      () => {
        setIsTransitioning(false);
        transitionTimeoutRef.current = null;
      },
      prefersReducedMotion ? 0 : 200,
    );
  };

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    getQuote();
  }, []);

  useEffect(() => {
    if (quotes[currentIndex]?.author) setFlipIndex(Math.floor(Math.random() * 4));
  }, [quotes[currentIndex]?.author]);

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
      } else if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        toolbarRef.current?.triggerSave();
      } else if (e.key.toLowerCase() === "d") {
        e.preventDefault();
        setIsDrawerOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === "i") {
        e.preventDefault();
        setIsStackOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const getQuote = async () => {
    try {
      setIsTransitioning(true);
      const { data, error } = await supabase.rpc("get_random_quote").single<{ quote: string; author: string }>();
      if (!data) throw new Error(error?.message || "Unknown error");
      const isDuplicate = quotes.some((q) => q.quote === data.quote && q.author === data.author);
      if (isDuplicate) return getQuote();
      setQuotes((prev) => [{ quote: data.quote, author: data.author }, ...prev]);
      setCurrentIndex(0);
      scheduleTransitionEnd();
    } catch (error) {
      console.error(error);
      setQuotes([{ quote: "Oops... Something went wrong.", author: "Unknown" }]);
      setIsTransitioning(false);
    }
  };

  const getPreviousQuote = () => {
    if (currentIndex < quotes.length - 1) {
      setIsTransitioning(true);
      setCurrentIndex(currentIndex + 1);
      scheduleTransitionEnd();
    }
  };
  const getNextQuote = () => {
    if (currentIndex > 0) {
      setIsTransitioning(true);
      setCurrentIndex(currentIndex - 1);
      scheduleTransitionEnd();
    }
  };

  // Apple: critically damped springs, interruptible from presentation value
  const bgSpring = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, bounce: 0, duration: 0.5 };
  const textSpring = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, bounce: 0, duration: 0.5 };

  return (
    <>
      <h1 className="font-redaction fixed top-0 right-0 left-0 mt-15 text-center text-4xl font-bold tracking-[-0.02em] leading-none">
        Echoes
      </h1>

      <main className="flex h-dvh w-dvw flex-col justify-center px-5 sm:px-16 md:px-28 lg:px-52 xl:px-96 2xl:px-120">
        {/* Reading this as: editorial quote experience for reflective readers, with a calm editorial language, leaning toward Tailwind + motion */}
        <div
          ref={cardRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeaveCard}
          className="relative flex h-2/3 items-center justify-center p-10"
        >
          {/* Background image — 3xl blur, materialize — no p-4 to avoid blur fringing at rounded edge */}
          <div className="absolute inset-0 -z-10">
            <motion.div
              animate={{
                filter: isAuthorHovered ? "blur(0px)" : "blur(64px)",
                scale: isAuthorHovered ? 1.04 : 1,
                opacity: isTransitioning ? 0.55 : 1,
              }}
              transition={bgSpring}
              className="absolute inset-0 origin-center will-change-transform"
            >
              <motion.div style={{ x: imageX, y: imageY }} className="absolute inset-0 will-change-transform">
              <div
                className={`absolute inset-0 h-full mask-[url(/mask.avif)] mask-contain mask-center mask-no-repeat ${maskFlips[flipIndex].mask}`}
              >
                <motion.img
                  key={`${quotes[currentIndex]?.quote}-${quotes[currentIndex]?.author}`}
                  src={`/authors/${quotes[currentIndex]?.author?.toLowerCase().replace(/\s+/g, "-")}-placeholder.avif`}
                  onLoad={(e) => {
                    e.currentTarget.src = `/authors/${quotes[currentIndex]?.author?.toLowerCase().replace(/\s+/g, "-")}.avif`;
                  }}
                  alt={quotes[currentIndex]?.author || "Author"}
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: isTransitioning ? 0 : 1 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className={`h-full w-full object-cover will-change-transform ${maskFlips[flipIndex].img}`}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </motion.div>
          </motion.div>
          </div>

          <div className="relative flex w-full max-w-3xl flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={quotes[currentIndex]?.quote}
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, y: 16, filter: "blur(10px)", scale: 0.97 }
                }
                animate={{
                  opacity: isTransitioning || isAuthorHovered ? 0 : 1,
                  y: isTransitioning || isAuthorHovered ? -10 : 0,
                  filter: isTransitioning || isAuthorHovered ? "blur(10px)" : "blur(0px)",
                  scale: isTransitioning || isAuthorHovered ? 0.97 : 1,
                }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -12, filter: "blur(10px)", scale: 0.97 }
                }
                transition={textSpring}
                className="text-quote max-w-[22ch] text-center text-[clamp(1.1rem,2vw+0.9rem,2.1rem)] leading-[1.25] font-[450] tracking-[-0.015em] will-change-transform [text-wrap:balance] text-shadow-lg/30"
                style={{ fontOpticalSizing: "auto" } as any}
              >
                <span className="mr-1 align-super text-lg font-normal tracking-normal opacity-60">“</span>
                {quotes[currentIndex]?.quote || "Loading..."}
                <span className="ml-1 align-super text-lg font-normal tracking-normal opacity-60">”</span>
              </motion.p>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.a
                key={`${quotes[currentIndex]?.quote}-${quotes[currentIndex]?.author}`}
                href={`https://www.google.com/search?q=${encodeURIComponent(quotes[currentIndex]?.author || "")}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={prefersReducedMotion ? false : { opacity: 0, x: 12, filter: "blur(8px)" }}
                animate={{ opacity: isTransitioning ? 0 : 1, x: 0, filter: "blur(0px)" }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -12, filter: "blur(8px)" }}
                transition={textSpring}
                onPointerEnter={() => setIsAuthorHovered(true)}
                onPointerLeave={() => setIsAuthorHovered(false)}
                onFocus={() => setIsAuthorHovered(true)}
                onBlur={() => setIsAuthorHovered(false)}
                className="group/author absolute top-[calc(100%+1.5rem)] right-0 inline-flex items-center gap-2 will-change-transform text-shadow-lg/30 focus-visible:outline-none"
              >
                <span className="text-xl leading-none md:text-2xl" aria-hidden>
                  —
                </span>
                <span className="relative text-xl leading-none tracking-[-0.01em] font-medium md:text-2xl">
                  <span>{quotes[currentIndex]?.author || "Loading..."}</span>
                  <motion.span
                    aria-hidden
                    className="absolute -bottom-1 left-0 h-px w-full origin-left bg-current"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isAuthorHovered ? 1 : 0 }}
                    transition={textSpring}
                  />
                </span>
              </motion.a>
            </AnimatePresence>
          </div>
        </div>

        <QuoteToolbar
          ref={toolbarRef}
          onNewQuote={getQuote}
          onPreviousQuote={getPreviousQuote}
          onNextQuote={getNextQuote}
          onToggleSaveQuote={toggleSaveQuote}
          isSaved={isCurrentQuoteSaved}
          canGoPrevious={currentIndex < quotes.length - 1}
          canGoNext={currentIndex > 0}
          drawerCount={savedQuotes.length}
          onToggleDrawer={() => setIsDrawerOpen((v) => !v)}
          onToggleStack={() => setIsStackOpen((v) => !v)}
          hidden={isDrawerOpen || isStackOpen}
        />
      </main>

      <StackInfo open={isStackOpen} onOpenChange={setIsStackOpen} hideTrigger />
      <VaulDrawer savedQuotes={savedQuotes} onRemoveQuote={removeQuote} open={isDrawerOpen} onOpenChange={setIsDrawerOpen} hideTrigger />
      <FirefoxNotice />
    </>
  );
}
