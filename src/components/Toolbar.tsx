import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { RefreshCw, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, BookMarked, Info } from "lucide-react";

interface QuoteToolbarProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  onNewQuote?: () => void;
  onPreviousQuote?: () => void;
  onNextQuote?: () => void;
  onToggleSaveQuote?: () => void;
  isSaved?: boolean;
  drawerCount?: number;
  onToggleDrawer?: () => void;
  onToggleStack?: () => void;
  hidden?: boolean;
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
      drawerCount = 0,
      onToggleDrawer,
      onToggleStack,
      hidden = false,
    },
    ref,
  ) => {
    const [activeButton, setActiveButton] = useState<string | null>(null);
    const [hovered, setHovered] = useState<string | null>(null);
    const prefersReducedMotion = useReducedMotion();

    useImperativeHandle(
      ref,
      () => ({
        triggerReload: () => setActiveButton("reload"),
        triggerPrev: () => canGoPrevious && setActiveButton("prev"),
        triggerNext: () => canGoNext && setActiveButton("next"),
        triggerSave: () => setActiveButton("save"),
      }),
      [canGoPrevious, canGoNext],
    );

    useEffect(() => {
      if (!activeButton) return;
      if (activeButton === "reload") onNewQuote?.();
      else if (activeButton === "prev") onPreviousQuote?.();
      else if (activeButton === "next") onNextQuote?.();
      else if (activeButton === "save") onToggleSaveQuote?.();
      const timeout = setTimeout(() => setActiveButton(null), 420);
      return () => clearTimeout(timeout);
    }, [activeButton]);

    const getTooltipProps = (isHovered: boolean) => ({
      initial: false as const,
      animate: {
        opacity: isHovered ? 1 : 0,
        scale: isHovered ? 1 : 0.96,
        y: isHovered ? 0 : 6,
        filter: isHovered ? "blur(0px)" : "blur(6px)",
      },
      transition: prefersReducedMotion
        ? { duration: 0 }
        : {
            type: "spring" as const,
            bounce: 0,
            duration: 0.2,
            delay: isHovered ? 0.2 : 0,
          },
    });

    const hoverSpring = prefersReducedMotion
      ? { duration: 0 }
      : { type: "spring" as const, bounce: 0, duration: 0.3 };
    const tapSpring = prefersReducedMotion
      ? { duration: 0 }
      : { type: "spring" as const, bounce: 0, duration: 0.2 };
    const iconPopSpring = prefersReducedMotion
      ? { duration: 0 }
      : { type: "spring" as const, bounce: 0.22, duration: 0.45 };
    const pillSpring = prefersReducedMotion
      ? { duration: 0 }
      : { type: "spring" as const, bounce: 0, duration: 0.2 };

    const handlePointerEnter = (id: string) => (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      setHovered(id);
    };
    const handlePointerLeave = (id: string) => (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      setHovered((v) => (v === id ? null : v));
    };

    const buttonBase =
      "group relative flex h-10 w-10 cursor-pointer transition-colors duration-200 ease-out transition-colors duration-200 ease-out items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20";

    return (
      <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 justify-center">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.96, filter: "blur(8px)" }}
          animate={
            hidden
              ? { opacity: 0, y: 12, scale: 0.96, filter: "blur(8px)" }
              : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
          }
          transition={pillSpring}
          className="flex items-center gap-1 rounded-full border border-stone-800 bg-stone-900 p-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] will-change-transform"
          style={{ pointerEvents: hidden ? "none" : "auto" }}
          role="toolbar"
          aria-label="Quote actions"
          aria-hidden={hidden}
        >
          {/* Drawer — BookMarked */}
          <motion.button
            onClick={onToggleDrawer}
            onPointerEnter={handlePointerEnter("drawer")}
            onPointerLeave={handlePointerLeave("drawer")}
            whileHover={undefined}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.88, y: 1 }}
            transition={hoverSpring}
            className={`${buttonBase} bg-transparent text-stone-300 hover:text-stone-50`}
            aria-label="View saved quotes"
          >
            <motion.span
              animate={
                !prefersReducedMotion && activeButton === "drawer"
                  ? { scale: 1.18, y: -1, filter: "blur(0px)" }
                  : { scale: 1, y: 0, filter: "blur(0px)" }
              }
              transition={iconPopSpring}
              className="flex will-change-transform"
            >
              <BookMarked size={20} strokeWidth={1.7} />
            </motion.span>
            <motion.div
              {...getTooltipProps(hovered === "drawer")}
              className="font-alte-haas pointer-events-none absolute bottom-12 left-1/2 flex -translate-x-1/2 origin-bottom flex-col items-center will-change-transform"
            >
              <div className="inline-flex w-auto items-center gap-2 whitespace-nowrap rounded-full border border-stone-800 bg-stone-900 px-3 py-2 text-xs font-medium tracking-tight text-white">
                Saved
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-stone-600 bg-stone-700 px-1.5 py-1 font-mono text-xs leading-none shadow-sm">D</span>
              </div>
              <div className="h-2 w-2 -translate-y-1 rotate-45 rounded-br-sm border-r border-b border-stone-800 bg-stone-900"></div>
            </motion.div>
          </motion.button>

          <div className="h-6 w-px shrink-0 bg-white/10" aria-hidden />

          {/* Reload — 360 spin + pop */}
          <motion.button
            onClick={() => setActiveButton("reload")}
            onPointerEnter={handlePointerEnter("reload")}
            onPointerLeave={handlePointerLeave("reload")}
            whileHover={undefined}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.88, y: 1 }}
            transition={hoverSpring}
            className={`${buttonBase} bg-transparent text-stone-300 hover:text-stone-50`}
            aria-label="New quote"
          >
            <motion.span
              animate={
                !prefersReducedMotion && activeButton === "reload"
                  ? { rotate: 360, scale: 1.12, filter: "blur(0px)" }
                  : { rotate: 0, scale: 1, filter: "blur(0px)" }
              }
              transition={iconPopSpring}
              className="flex will-change-transform"
            >
              <RefreshCw size={20} strokeWidth={1.7} />
            </motion.span>
            <motion.div
              {...getTooltipProps(hovered === "reload")}
              className="font-alte-haas pointer-events-none absolute bottom-12 left-1/2 flex -translate-x-1/2 origin-bottom flex-col items-center will-change-transform"
            >
              <div className="inline-flex w-auto items-center gap-2 whitespace-nowrap rounded-full border border-stone-800 bg-stone-900 px-3 py-2 text-xs font-medium tracking-tight text-white">
                New Quote
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-stone-600 bg-stone-700 px-1.5 py-1 font-mono text-xs leading-none shadow-sm">R</span>
              </div>
              <div className="h-2 w-2 -translate-y-1 rotate-45 rounded-br-sm border-r border-b border-stone-800 bg-stone-900"></div>
            </motion.div>
          </motion.button>

          {/* Prev — slide left + pop */}
          <motion.button
            onClick={() => canGoPrevious && setActiveButton("prev")}
            onPointerEnter={handlePointerEnter("prev")}
            onPointerLeave={handlePointerLeave("prev")}
            whileHover={undefined}
            whileTap={prefersReducedMotion || !canGoPrevious ? undefined : { scale: 0.88, y: 1 }}
            transition={hoverSpring}
            className={`${buttonBase} bg-transparent text-stone-300 hover:text-stone-50 disabled:pointer-events-none disabled:text-stone-700`}
            disabled={!canGoPrevious}
            aria-label="Previous quote"
          >
            <motion.span
              animate={
                !prefersReducedMotion && activeButton === "prev"
                  ? { x: -3, filter: "blur(0px)" }
                  : { x: 0, scale: 1, filter: "blur(0px)" }
              }
              transition={iconPopSpring}
              className="flex will-change-transform"
            >
              <ChevronLeft size={20} strokeWidth={1.7} />
            </motion.span>
            <motion.div
              {...getTooltipProps(hovered === "prev")}
              className="font-alte-haas pointer-events-none absolute bottom-12 left-1/2 flex -translate-x-1/2 origin-bottom flex-col items-center will-change-transform"
            >
              <div className="inline-flex w-auto items-center gap-2 whitespace-nowrap rounded-full border border-stone-800 bg-stone-900 px-3 py-2 text-xs font-medium tracking-tight text-white">
                Previous
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-stone-600 bg-stone-700 px-1.5 py-1 font-mono text-xs leading-none shadow-sm">←</span>
              </div>
              <div className="h-2 w-2 -translate-y-1 rotate-45 rounded-br-sm border-r border-b border-stone-800 bg-stone-900"></div>
            </motion.div>
          </motion.button>

          {/* Next — slide right + pop */}
          <motion.button
            onClick={() => canGoNext && setActiveButton("next")}
            onPointerEnter={handlePointerEnter("next")}
            onPointerLeave={handlePointerLeave("next")}
            whileHover={undefined}
            whileTap={prefersReducedMotion || !canGoNext ? undefined : { scale: 0.88, y: 1 }}
            transition={hoverSpring}
            className={`${buttonBase} bg-transparent text-stone-300 hover:text-stone-50 disabled:pointer-events-none disabled:text-stone-700`}
            disabled={!canGoNext}
            aria-label="Next quote"
          >
            <motion.span
              animate={
                !prefersReducedMotion && activeButton === "next"
                  ? { x: 3, filter: "blur(0px)" }
                  : { x: 0, scale: 1, filter: "blur(0px)" }
              }
              transition={iconPopSpring}
              className="flex will-change-transform"
            >
              <ChevronRight size={20} strokeWidth={1.7} />
            </motion.span>
            <motion.div
              {...getTooltipProps(hovered === "next")}
              className="font-alte-haas pointer-events-none absolute bottom-12 left-1/2 flex -translate-x-1/2 origin-bottom flex-col items-center will-change-transform"
            >
              <div className="inline-flex w-auto items-center gap-2 whitespace-nowrap rounded-full border border-stone-800 bg-stone-900 px-3 py-2 text-xs font-medium tracking-tight text-white">
                Next
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-stone-600 bg-stone-700 px-1.5 py-1 font-mono text-xs leading-none shadow-sm">→</span>
              </div>
              <div className="h-2 w-2 -translate-y-1 rotate-45 rounded-br-sm border-r border-b border-stone-800 bg-stone-900"></div>
            </motion.div>
          </motion.button>

          {/* Save — lift + pop */}
          <motion.button
            onClick={() => setActiveButton("save")}
            onPointerEnter={handlePointerEnter("save")}
            onPointerLeave={handlePointerLeave("save")}
            whileHover={undefined}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.88, y: 1 }}
            transition={hoverSpring}
            className={`${buttonBase} bg-transparent text-stone-300 hover:text-stone-50`}
            aria-label={isSaved ? "Remove from favorites" : "Save quote"}
          >
            <motion.span
              animate={
                !prefersReducedMotion && activeButton === "save"
                  ? { scale: 1.22, y: -2, rotate: -4 }
                  : { scale: 1, y: 0, rotate: 0 }
              }
              transition={iconPopSpring}
              className="relative flex h-5 w-5 items-center justify-center will-change-transform"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {isSaved ? (
                  <motion.span
                    key="saved"
                    initial={prefersReducedMotion ? false : { scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { scale: 0.85, opacity: 0 }}
                    transition={iconPopSpring}
                    className="absolute flex"
                  >
                    <BookmarkCheck size={20} strokeWidth={1.7} className="fill-current" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="unsaved"
                    initial={prefersReducedMotion ? false : { scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { scale: 0.85, opacity: 0 }}
                    transition={iconPopSpring}
                    className="absolute flex"
                  >
                    <Bookmark size={20} strokeWidth={1.7} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.span>
            <motion.div
              {...getTooltipProps(hovered === "save")}
              className="font-alte-haas pointer-events-none absolute bottom-12 left-1/2 flex -translate-x-1/2 origin-bottom flex-col items-center will-change-transform"
            >
              <div className="inline-flex w-auto items-center gap-2 whitespace-nowrap rounded-full border border-stone-800 bg-stone-900 px-3 py-2 text-xs font-medium tracking-tight text-white">
                {isSaved ? "Remove" : "Save"}
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-stone-600 bg-stone-700 px-1.5 py-1 font-mono text-xs leading-none shadow-sm">S</span>
              </div>
              <div className="h-2 w-2 -translate-y-1 rotate-45 rounded-br-sm border-r border-b border-stone-800 bg-stone-900"></div>
            </motion.div>
          </motion.button>

          <div className="h-6 w-px shrink-0 bg-white/10" aria-hidden />

          {/* StackInfo */}
          <motion.button
            onClick={onToggleStack}
            onPointerEnter={handlePointerEnter("stack")}
            onPointerLeave={handlePointerLeave("stack")}
            whileHover={undefined}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.88, y: 1 }}
            transition={hoverSpring}
            className={`${buttonBase} bg-transparent text-stone-300 hover:text-stone-50`}
            aria-label="View tech stack"
          >
            <motion.span
              animate={!prefersReducedMotion && activeButton === "stack" ? { scale: 1.1 } : { scale: 1 }}
              transition={iconPopSpring}
              className="flex will-change-transform"
            >
              <Info size={20} strokeWidth={1.7} />
            </motion.span>
            <motion.div
              {...getTooltipProps(hovered === "stack")}
              className="font-alte-haas pointer-events-none absolute bottom-12 left-1/2 flex -translate-x-1/2 origin-bottom flex-col items-center will-change-transform"
            >
              <div className="inline-flex w-auto items-center gap-2 whitespace-nowrap rounded-full border border-stone-800 bg-stone-900 px-3 py-2 text-xs font-medium tracking-tight text-white">
                Stack
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-stone-600 bg-stone-700 px-1.5 py-1 font-mono text-xs leading-none shadow-sm">I</span>
              </div>
              <div className="h-2 w-2 -translate-y-1 rotate-45 rounded-br-sm border-r border-b border-stone-800 bg-stone-900"></div>
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    );
  },
);

export type { ToolbarRef };

export default QuoteToolbar;
