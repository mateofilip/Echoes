import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

interface StackInfoProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function StackInfo({ open, onOpenChange }: StackInfoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const closeDelay = prefersReducedMotion ? 0 : 200;
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleClose = (callback: () => void) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = setTimeout(() => {
      callback();
      closeTimeoutRef.current = null;
    }, closeDelay);
  };

  useEffect(() => {
    if (open !== undefined) {
      if (open) {
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = null;
        }
        setIsOpen(true);
      } else {
        setIsAnimating(false);
        scheduleClose(() => setIsOpen(false));
      }
    }
  }, [closeDelay, open]);

  useEffect(() => {
    if (!isOpen) return;
    if (prefersReducedMotion) {
      setIsAnimating(true);
      return;
    }

    const frame = requestAnimationFrame(() => setIsAnimating(true));
    return () => cancelAnimationFrame(frame);
  }, [isOpen, prefersReducedMotion]);

  const handleClose = () => {
    if (open !== undefined) {
      setIsAnimating(false);
      scheduleClose(() => onOpenChange?.(false));
    } else {
      setIsAnimating(false);
      scheduleClose(() => setIsOpen(false));
    }
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const stack = [
    { name: "Astro", description: "Web Framework" },
    { name: "React", description: "UI Library" },
    { name: "Tailwind CSS", description: "Styling" },
    { name: "Motion.dev", description: "Animation Library" },
    { name: "Vercel", description: "Infrastructure" },
  ];

  return (
    <>
      <button
        onClick={() => {
          open !== undefined ? onOpenChange?.(true) : setIsOpen(true);
        }}
        className="group fixed right-4 bottom-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-stone-800 bg-stone-900 text-white shadow-lg transition-[background-color,border-color,transform] duration-200 hover:scale-110 hover:bg-stone-800 focus:outline-none active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
        aria-label="View Tech Stack"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        <div className="font-alte-haas pointer-events-none visible absolute -right-1 bottom-10 flex translate-y-2 flex-col items-end opacity-0 transition-[opacity,transform] delay-200 duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none">
          <div className="flex items-center gap-2 rounded-full border border-stone-800 bg-stone-950 px-3 py-2 text-[10px] whitespace-nowrap text-white">
            Tech Stack
            <span className="float-end inline-grid w-fit place-items-center rounded-lg border border-stone-700 bg-stone-800 px-2 py-1 font-mono">
              I
            </span>
          </div>
          <div className="mr-5 h-2 w-2 -translate-y-1 rotate-45 rounded-br-sm border-r border-b border-stone-800 bg-stone-950 shadow-lg"></div>
        </div>
      </button>

      {isOpen && (
        <div
          className={`font-alte-haas fixed inset-0 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-200 motion-reduce:transition-none ${
            isAnimating ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            ref={modalRef}
            className={`w-full max-w-sm rounded-2xl border border-stone-800 bg-stone-950/95 p-6 shadow-2xl transition-[opacity,transform] duration-200 motion-reduce:transition-none ${
              isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Tech Stack</h2>
              <button
                onClick={handleClose}
                className="cursor-pointer rounded-full p-1 text-white transition-[background-color,transform] duration-200 hover:bg-stone-800 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <ul className="space-y-3">
              {stack.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-stone-800 bg-stone-900/50 p-3 transition-colors duration-200 ease-out hover:bg-stone-800/50"
                >
                  <span className="font-semibold text-slate-100">
                    {item.name}
                  </span>
                  <span className="rounded-full bg-orange-200/10 px-2 py-1 text-xs font-medium text-orange-200">
                    {item.description}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-center">
              <p className="text-xs text-neutral-500">Built with ❤️ by Mateo</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
