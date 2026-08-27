import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Drawer } from "vaul";
import { Archive, X, Trash2 } from "lucide-react";
import type { Quote } from "../types/Quote";

const getQuoteKey = (quote: Quote) => `${quote.quote}\u0000${quote.author}`;

interface VaulDrawerProps {
  savedQuotes: Quote[];
  onRemoveQuote?: (quote: Quote) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}

export default function VaulDrawer({
  savedQuotes,
  onRemoveQuote,
  open,
  onOpenChange,
  hideTrigger,
}: VaulDrawerProps) {
  const [pendingRemovalKeys, setPendingRemovalKeys] = useState<Set<string>>(() => new Set());
  const prefersReducedMotion = useReducedMotion();
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);
  const displayedQuotes = savedQuotes.filter((quote) => !pendingRemovalKeys.has(getQuoteKey(quote)));

  // Apple: critically damped, interruptible springs — no bounce for list
  const cardSpring = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, bounce: 0, duration: 0.35 };
  const emptySpring = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, bounce: 0, duration: 0.35 };
  const pressSpring = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, bounce: 0, duration: 0.2 };

  const requestRemoveQuote = (quote: Quote) => {
    if (!onRemoveQuote) return;
    setPendingRemovalKeys((currentKeys) => {
      const key = getQuoteKey(quote);
      if (currentKeys.has(key)) return currentKeys;
      const nextKeys = new Set(currentKeys);
      nextKeys.add(key);
      return nextKeys;
    });
  };
  const completeRemoval = () => {
    if (pendingRemovalKeys.size === 0) return;
    savedQuotes.filter((quote) => pendingRemovalKeys.has(getQuoteKey(quote))).forEach((quote) => onRemoveQuote?.(quote));
    setPendingRemovalKeys(new Set());
  };

  return (
    <Drawer.Root direction="right" open={open} onOpenChange={onOpenChange}>
      {!hideTrigger && (
        <Drawer.Trigger asChild>
          <motion.button
            type="button"
            aria-label="View saved quotes"
            onPointerEnter={(e) => {
              if (e.pointerType !== "mouse") return;
              setIsTooltipHovered(true);
            }}
            onPointerLeave={(e) => {
              if (e.pointerType !== "mouse") return;
              setIsTooltipHovered(false);
            }}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
            transition={pressSpring}
            className="group fixed bottom-4 left-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-stone-800 bg-stone-900 text-white shadow-lg transition-[background-color,border-color,color] duration-200 hover:border-stone-700 hover:bg-stone-800 focus-visible:ring-2 focus-visible:ring-orange-200/70 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 focus-visible:outline-none"
          >
            <Archive size={18} strokeWidth={1.9} />
            <motion.div
              initial={false}
              animate={{
                opacity: isTooltipHovered ? 1 : 0,
                scale: isTooltipHovered ? 1 : 0.92,
                y: isTooltipHovered ? 0 : 4,
              }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { type: "spring", bounce: 0, duration: 0.2, delay: isTooltipHovered ? 0.2 : 0 }
              }
              className="font-alte-haas pointer-events-none absolute bottom-10 -left-1 flex origin-bottom-left flex-col items-start will-change-transform"
            >
              <div className="flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900 px-3 py-2 text-xs font-medium tracking-tight text-white">
                Saved
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-stone-600 bg-stone-700 px-1.5 py-1 font-mono text-xs leading-none shadow-sm">D</span>
              </div>
              <div className="h-2 w-2 -translate-y-1 rotate-45 rounded-sm border-r border-b border-stone-800 bg-stone-900"></div>
            </motion.div>
          </motion.button>
        </Drawer.Trigger>
      )}
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-stone-950/80 data-[state=closed]:![animation-duration:200ms] data-[state=open]:![animation-duration:200ms] motion-reduce:![animation-duration:0ms]" />
        <Drawer.Content className="fixed top-4 right-4 bottom-4 z-10 flex w-[calc(100vw-2rem)] overflow-x-hidden outline-none data-[state=closed]:![animation-duration:200ms] data-[state=open]:![animation-duration:200ms] motion-reduce:![animation-duration:0ms] sm:w-[420px]">
          <div className="flex h-full w-full grow flex-col overflow-hidden rounded-3xl border border-stone-800/90 bg-stone-950 p-5 shadow-2xl ring-1 shadow-black/40 ring-white/5 ring-inset sm:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-stone-800/80 pb-5">
              <div>
                <Drawer.Title className="font-alte-haas text-xl leading-none font-semibold tracking-tight text-orange-100 sm:text-2xl">
                  Saved Quotes
                </Drawer.Title>
                <Drawer.Description className="sr-only">A collection of quotes saved in this browser.</Drawer.Description>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-alte-haas text-xs font-medium text-orange-200/70 tabular-nums">{displayedQuotes.length}</span>
                <Drawer.Close asChild>
                  <button
                    type="button"
                    aria-label="Close saved quotes"
                    className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-stone-800 text-stone-400 transition-[background-color,border-color,color,transform] duration-200 hover:border-stone-700 hover:bg-stone-800 hover:text-orange-100 focus-visible:ring-2 focus-visible:ring-orange-200/70 focus-visible:outline-none active:scale-95"
                  >
                    <X size={16} strokeWidth={1.9} aria-hidden="true" />
                  </button>
                </Drawer.Close>
              </div>
            </div>

            <div className="font-alte-haas min-h-0 w-full flex-1 [scrollbar-width:none] overflow-x-hidden overflow-y-auto overscroll-contain pt-5 [&::-webkit-scrollbar]:hidden">
              <AnimatePresence initial={false}>
                {displayedQuotes.length === 0 && pendingRemovalKeys.size === 0 && (
                  <motion.div
                    key="empty"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 8, scale: 0.98, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, scale: 0.98, filter: "blur(6px)" }}
                    transition={emptySpring}
                    className="mb-3 w-full rounded-2xl border-2 border-dashed border-stone-800 bg-stone-900/30 px-6 py-10 text-center will-change-transform"
                  >
                    <p className="text-sm font-medium text-stone-300">No saved quotes yet.</p>
                    <p className="mt-2 text-xs leading-5 text-stone-500">Save a quote to see it here.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex w-full flex-col gap-3 pb-1">
                <AnimatePresence initial={false} mode="popLayout" onExitComplete={completeRemoval}>
                  {[...displayedQuotes].reverse().map((quote) => (
                    <motion.div
                      key={getQuoteKey(quote)}
                      layout={prefersReducedMotion ? false : "position"}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.96, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                      exit={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: -10, scale: 0.96, filter: "blur(6px)" }
                      }
                      transition={cardSpring}
                      className="w-full will-change-transform"
                    >
                      <motion.article
                        layout={prefersReducedMotion ? false : "position"}
                        initial={false}
                        className="group relative origin-top overflow-hidden rounded-2xl border border-stone-800/90 bg-stone-900/60 p-5 shadow-lg shadow-black/10 transition-colors duration-200 hover:border-orange-200/30 hover:bg-stone-900/85"
                      >
                        <p className="pr-8 text-[0.95rem] leading-7 text-orange-50">
                          <span className="font-prata mr-1 text-lg text-orange-200/70">«</span>
                          {quote.quote}
                          <span className="font-prata ml-1 text-lg text-orange-200/70">»</span>
                        </p>

                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-stone-800/80 pt-4">
                          <p className="text-xs font-medium tracking-wide text-stone-300">{quote.author}</p>
                          <motion.button
                            type="button"
                            onClick={() => requestRemoveQuote(quote)}
                            aria-label={`Remove quote by ${quote.author}`}
                            whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
                            transition={pressSpring}
                            className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-stone-800 text-stone-500 transition-[background-color,border-color,color,transform] duration-200 hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300 focus-visible:ring-2 focus-visible:ring-orange-200/70 focus-visible:outline-none"
                          >
                            <Trash2 size={14} strokeWidth={1.9} aria-hidden="true" />
                          </motion.button>
                        </div>
                      </motion.article>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
