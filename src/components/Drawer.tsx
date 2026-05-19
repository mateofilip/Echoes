import { Drawer } from "vaul";
import type { Quote } from "../types/Quote";

interface VaulDrawerProps {
  savedQuotes: Quote[];
  onRemoveQuote?: (index: number) => void;
}

export default function VaulDrawer({
  savedQuotes,
  onRemoveQuote,
}: VaulDrawerProps) {
  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger asChild>
        <button className="absolute bottom-4 left-4 cursor-pointer rounded-lg border border-stone-800 bg-stone-900 p-3 hover:scale-105">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 15 15"
          >
            <path
              d="M3.5 2C3.22386 2 3 2.22386 3 2.5V13.5C3 13.6818 3.09864 13.8492 3.25762 13.9373C3.41659 14.0254 3.61087 14.0203 3.765 13.924L7.5 11.5896L11.235 13.924C11.3891 14.0203 11.5834 14.0254 11.7424 13.9373C11.9014 13.8492 12 13.6818 12 13.5V2.5C12 2.22386 11.7761 2 11.5 2H3.5Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
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
          <div className="flex h-full w-full grow flex-col rounded-2xl bg-stone-900/75 p-5">
            <Drawer.Title className="Alte mb-4 text-xl font-semibold text-orange-200">
              Saved Quotes ({savedQuotes.length})
            </Drawer.Title>
            <div className="flex-1 overflow-y-auto">
              {savedQuotes.length === 0 ? (
                <p className="text-stone-500">No saved quotes yet.</p>
              ) : (
                <div className="flex flex-col-reverse gap-4">
                  {savedQuotes.map((quote, index) => (
                    <div
                      key={index}
                      className="group relative rounded-lg border border-stone-700 bg-stone-800 p-4"
                    >
                      <button
                        onClick={() => onRemoveQuote?.(index)}
                        className="absolute top-2 right-2 rounded-md p-1 text-stone-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-stone-700 hover:text-red-400"
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
                      <p className="mb-2 pr-6 text-orange-100">
                        « {quote.quote} »
                      </p>
                      <p className="text-end text-sm text-stone-400">
                        — {quote.author}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
