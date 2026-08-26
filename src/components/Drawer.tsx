import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Drawer } from "vaul";
import type { Quote } from "../types/Quote";

const getQuoteKey = (quote: Quote) => `${quote.quote}\u0000${quote.author}`;
const DRAWER_MOTION_DURATION = 0.2;
const DRAWER_EXIT_DURATION = 0.2;
const DRAWER_EASE_OUT = [0.23, 1, 0.32, 1] as const;

interface VaulDrawerProps {
  savedQuotes: Quote[];
  onRemoveQuote?: (quote: Quote) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function VaulDrawer({
  savedQuotes,
  onRemoveQuote,
  open,
  onOpenChange,
}: VaulDrawerProps) {
  const [pendingRemovalKeys, setPendingRemovalKeys] = useState<Set<string>>(
    () => new Set(),
  );
  const prefersReducedMotion = useReducedMotion();
  const displayedQuotes = savedQuotes.filter(
    (quote) => !pendingRemovalKeys.has(getQuoteKey(quote)),
  );
  const cardTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: DRAWER_MOTION_DURATION,
        ease: DRAWER_EASE_OUT,
      };
  const emptyTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: DRAWER_MOTION_DURATION,
        ease: DRAWER_EASE_OUT,
      };
  const cardExitTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: DRAWER_EXIT_DURATION,
        ease: DRAWER_EASE_OUT,
      };
  const cardVariants = prefersReducedMotion
    ? {
        initial: {
          opacity: 1,
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
        },
        animate: {
          opacity: 1,
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
        },
        exit: {
          opacity: 0,
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          transition: cardExitTransition,
        },
      }
    : {
        initial: {
          opacity: 0,
          x: 0,
          y: 12,
          scaleX: 0.98,
          scaleY: 0.98,
        },
        animate: {
          opacity: 1,
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
        },
        exit: {
          opacity: 1,
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 0.04,
          transition: cardExitTransition,
        },
      };
  const cardShellVariants = prefersReducedMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 0, transition: cardExitTransition },
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: {
          opacity: [1, 0.35, 0],
          transition: {
            ...cardExitTransition,
            times: [0, 0.5, 1],
          },
        },
      };
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

    savedQuotes
      .filter((quote) => pendingRemovalKeys.has(getQuoteKey(quote)))
      .forEach((quote) => onRemoveQuote?.(quote));
    setPendingRemovalKeys(new Set());
  };

  return (
    <Drawer.Root direction="right" open={open} onOpenChange={onOpenChange}>
      <Drawer.Trigger asChild>
        <button
          type="button"
          aria-label="View saved quotes"
          className="group fixed bottom-4 left-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-stone-800 bg-stone-900 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:border-stone-700 hover:bg-stone-800 focus-visible:ring-2 focus-visible:ring-orange-200/70 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 focus-visible:outline-none active:scale-95"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.30902 1C2.93025 1 2.58398 1.214 2.41459 1.55279L1.05279 4.27639C1.01807 4.34582 1 4.42238 1 4.5V13C1 13.5523 1.44772 14 2 14H13C13.5523 14 14 13.5523 14 13V4.5C14 4.42238 13.9819 4.34582 13.9472 4.27639L12.5854 1.55281C12.416 1.21403 12.0698 1.00003 11.691 1.00003L7.5 1.00001L3.30902 1ZM3.30902 2L7 2.00001V4H2.30902L3.30902 2ZM8 4V2.00002L11.691 2.00003L12.691 4H8ZM7.5 5H13V13H2V5H7.5ZM5.5 7C5.22386 7 5 7.22386 5 7.5C5 7.77614 5.22386 8 5.5 8H9.5C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7H5.5Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
          <div className="font-alte-haas pointer-events-none visible absolute bottom-10 -left-1 flex translate-y-2 flex-col items-start opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-300">
            <div className="flex items-center gap-2 rounded-full border border-stone-800 bg-stone-950 px-3 py-2 text-[10px] whitespace-nowrap text-white">
              Saved Quotes ({displayedQuotes.length})
              <span className="float-end inline-grid w-fit place-items-center rounded-lg border border-stone-700 bg-stone-800 px-2 py-1 font-mono">
                D
              </span>
            </div>
            <div className="ml-5 h-2 w-2 -translate-y-1 rotate-45 rounded-br-sm border-r border-b border-stone-800 bg-stone-950 shadow-lg"></div>
          </div>
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-stone-950/75 backdrop-blur-[2px] data-[state=closed]:![animation-duration:200ms] data-[state=open]:![animation-duration:200ms]" />
        <Drawer.Content className="fixed top-4 right-4 bottom-4 z-10 flex w-[calc(100vw-2rem)] overflow-x-hidden outline-none data-[state=closed]:![animation-duration:200ms] data-[state=open]:![animation-duration:200ms] sm:w-[420px]">
          <div className="flex h-full w-full grow flex-col overflow-hidden rounded-3xl border border-stone-800/90 bg-stone-950/95 p-5 shadow-2xl ring-1 shadow-black/40 ring-white/5 backdrop-blur-2xl ring-inset sm:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-stone-800/80 pb-5">
              <div>
                <Drawer.Title className="font-alte-haas text-xl leading-none font-semibold tracking-tight text-orange-100 sm:text-2xl">
                  Saved Quotes
                </Drawer.Title>
                <Drawer.Description className="sr-only">
                  A collection of quotes saved in this browser.
                </Drawer.Description>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-alte-haas text-xs font-medium text-orange-200/70 tabular-nums">
                  {displayedQuotes.length}
                </span>
                <Drawer.Close asChild>
                  <button
                    type="button"
                    aria-label="Close saved quotes"
                    className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-stone-800 text-stone-400 transition-all duration-200 hover:border-stone-700 hover:bg-stone-800 hover:text-orange-100 focus-visible:ring-2 focus-visible:ring-orange-200/70 focus-visible:outline-none active:scale-95"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </Drawer.Close>
              </div>
            </div>

            <div className="font-alte-haas min-h-0 w-full flex-1 [scrollbar-width:none] overflow-x-hidden overflow-y-auto overscroll-contain pt-5 [&::-webkit-scrollbar]:hidden">
              <AnimatePresence initial={false}>
                {displayedQuotes.length === 0 &&
                  pendingRemovalKeys.size === 0 && (
                    <motion.div
                      key="empty"
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 8 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={emptyTransition}
                      className="mb-3 w-full rounded-2xl border-2 border-dashed border-stone-800 bg-stone-900/30 px-6 py-10 text-center"
                    >
                      <p className="text-sm font-medium text-stone-300">
                        No saved quotes yet.
                      </p>
                      <p className="mt-2 text-xs leading-5 text-stone-500">
                        Save a quote to see it here.
                      </p>
                    </motion.div>
                  )}
              </AnimatePresence>

              <motion.div
                layout
                transition={cardTransition}
                className="flex w-full flex-col gap-3 pb-1"
              >
                <AnimatePresence
                  initial={false}
                  mode="popLayout"
                  onExitComplete={completeRemoval}
                >
                  {[...displayedQuotes].reverse().map((quote) => (
                    <motion.div
                      key={quote.quote + quote.author}
                      layout={prefersReducedMotion ? false : "position"}
                      variants={cardShellVariants}
                      initial={prefersReducedMotion ? false : "initial"}
                      animate="animate"
                      exit="exit"
                      transition={cardTransition}
                      className="w-full overflow-hidden"
                    >
                      <motion.article
                        variants={cardVariants}
                        style={{ transformOrigin: "center top" }}
                        className="group relative origin-top overflow-hidden rounded-2xl border border-stone-800/90 bg-stone-900/60 p-5 shadow-lg shadow-black/10 transition-colors delay-0 duration-200 ease-out hover:border-orange-200/30 hover:bg-stone-900/85"
                      >
                        <p className="pr-8 text-[0.95rem] leading-7 text-orange-50">
                          <span className="Prata mr-1 text-lg text-orange-200/70">
                            «
                          </span>
                          {quote.quote}
                          <span className="Prata ml-1 text-lg text-orange-200/70">
                            »
                          </span>
                        </p>

                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-stone-800/80 pt-4">
                          <p className="text-xs font-medium tracking-wide text-stone-300">
                            {quote.author}
                          </p>
                          <button
                            type="button"
                            onClick={() => requestRemoveQuote(quote)}
                            aria-label={`Remove quote by ${quote.author}`}
                            className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-stone-800 text-stone-500 transition-all delay-0 duration-200 ease-out hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300 focus-visible:ring-2 focus-visible:ring-orange-200/70 focus-visible:outline-none active:scale-95"
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </motion.article>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
