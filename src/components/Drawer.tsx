import { motion, AnimatePresence } from "motion/react";
import { Drawer } from "vaul";
import type { Quote } from "../types/Quote";

interface VaulDrawerProps {
  savedQuotes: Quote[];
  onRemoveQuote?: (quote: Quote) => void;
}

export default function VaulDrawer({
  savedQuotes,
  onRemoveQuote,
}: VaulDrawerProps) {
  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger asChild>
        <button className="group fixed bottom-4 left-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-stone-800 bg-stone-900 text-white shadow-lg transition-all hover:scale-110 hover:bg-stone-800 active:scale-95">
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
          <div className="Geist invisible absolute bottom-12 left-1 translate-y-2 text-xs opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-300">
            <div className="flex items-center gap-2 rounded-xl border border-stone-800 bg-stone-950 p-3 whitespace-nowrap text-white shadow-lg">
              Saved Quotes
            </div>
            <div className="absolute top-full left-3 h-2 w-2 -translate-y-1 rotate-45 rounded-br-sm border-r border-b border-stone-800 bg-stone-950 shadow-lg"></div>
          </div>
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/90" />
        <Drawer.Content
          className="fixed top-2 right-2 bottom-2 z-10 flex w-[310px] outline-none"
          style={
            { "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties
          }
        >
          <div className="flex h-full w-full grow flex-col rounded-2xl bg-stone-900 p-5">
            <Drawer.Title className="Geist mb-4 text-xl font-semibold text-orange-200">
              Saved Quotes ({savedQuotes.length})
            </Drawer.Title>
            <div className="Geist flex-1 overflow-y-auto">
              <div className="flex flex-col-reverse gap-4">
                <p
                  className={`text-stone-500 transition-opacity delay-300 duration-200 ease-out ${savedQuotes.length === 0 ? "opacity-100" : "opacity-0"}`}
                >
                  No saved quotes yet.
                </p>

                <AnimatePresence initial={false}>
                  {savedQuotes.map((quote) => (
                    <motion.div
                      key={quote.quote + quote.author}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="group relative rounded-lg border border-stone-700 bg-stone-800 p-4"
                    >
                      <p className="mb-2 pr-6 text-sm text-orange-100">
                        <span className="Prata">«</span> {quote.quote}{" "}
                        <span className="Prata">»</span>
                      </p>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => onRemoveQuote?.(quote)}
                          className="cursor-pointer rounded-md p-1 text-stone-500 opacity-0 transition-all duration-200 ease-out group-hover:opacity-100 hover:bg-stone-700 hover:text-red-400"
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                              fill="currentColor"
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        </button>

                        <p className="text-end text-xs text-stone-400">
                          — {quote.author}
                        </p>
                      </div>
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
