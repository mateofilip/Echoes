import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Info, X } from "lucide-react";

interface StackInfoProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}

export default function StackInfo({ open, onOpenChange, hideTrigger }: StackInfoProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const isControlled = open !== undefined;
  const isOpen = isControlled ? (open as boolean) : internalOpen;

  const handleOpen = () => {
    if (isControlled) onOpenChange?.(true);
    else setInternalOpen(true);
  };

  const handleClose = () => {
    if (isControlled) onOpenChange?.(false);
    else setInternalOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isControlled]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      if (prefersReducedMotion) {
        document.body.style.overflow = prev;
      } else {
        const t = setTimeout(() => {
          document.body.style.overflow = prev;
        }, 500);
        return () => clearTimeout(t);
      }
    };
  }, [isOpen, prefersReducedMotion]);

  // Apple: critically damped, symmetric, interruptible — 500ms for modal so it doesn't feel too quick
  const overlaySpring = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, bounce: 0, duration: 0.2 };
  const modalSpring = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, bounce: 0, duration: 0.2 };

  const pressSpring = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, bounce: 0, duration: 0.2 };

  const stack = [
    { name: "Astro", description: "Web Framework" },
    { name: "React", description: "UI Library" },
    { name: "Tailwind CSS", description: "Styling" },
    { name: "Motion.dev", description: "Animation Library" },
    { name: "Vercel", description: "Infrastructure" },
  ];

  return (
    <>
      {!hideTrigger && (
        <motion.button
          onClick={handleOpen}
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
          className="group fixed right-4 bottom-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-stone-800 bg-stone-900 text-white shadow-lg transition-colors duration-200 hover:bg-stone-800 focus:outline-none motion-reduce:transition-none"
          aria-label="View Tech Stack"
        >
          <Info size={20} strokeWidth={1.9} />
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
                : {
                    type: "spring",
                    bounce: 0,
                    duration: 0.2,
                    delay: isTooltipHovered ? 0.2 : 0,
                  }
            }
            className="font-alte-haas pointer-events-none absolute -right-1 bottom-10 flex origin-bottom-right flex-col items-end will-change-transform"
          >
            <div className="flex items-center gap-2 rounded-full border border-stone-800 bg-stone-950 px-3 py-2 text-[10px] whitespace-nowrap text-white shadow-xl">
              Tech Stack
              <span className="float-end inline-grid w-fit place-items-center rounded-lg border border-stone-700 bg-stone-800 px-2 py-1 font-mono">
                I
              </span>
            </div>
            <div className="mr-5 h-2 w-2 -translate-y-1 rotate-45 rounded-br-sm border-r border-b border-stone-800 bg-stone-950 shadow-lg"></div>
          </motion.div>
        </motion.button>
      )}

      {/* Backdrop — dims to focus, separate from modal so exit isn't doubled */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="stack-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={overlaySpring}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md motion-reduce:backdrop-blur-none"
            onClick={handleClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Modal — single motion card, fixed centered, no wrapper opacity so exit mirrors enter 1:1 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="stack-modal"
            ref={modalRef}
            initial={
              prefersReducedMotion
                ? { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, scale: 0.88, y: 12, filter: "blur(10px)" }
            }
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={
              prefersReducedMotion
                ? { opacity: 0, scale: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, scale: 0.88, y: 12, filter: "blur(10px)" }
            }
            transition={modalSpring}
            onClick={(e) => e.stopPropagation()}
            className="font-alte-haas fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 origin-center rounded-2xl border border-stone-800 bg-stone-950 p-6 shadow-2xl ring-1 ring-white/10 will-change-transform"
            aria-modal="true"
            role="dialog"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-white">Tech Stack</h2>
              <button
                onClick={handleClose}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white transition duration-200 hover:bg-stone-800 active:scale-95"
              >
                <X size={18} strokeWidth={1.9} />
              </button>
            </div>
            <ul className="space-y-3">
              {stack.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-stone-800 bg-stone-900/50 p-3 transition duration-200 hover:bg-stone-800/50"
                >
                  <span className="font-semibold text-slate-100">{item.name}</span>
                  <span className="rounded-full bg-orange-200/10 px-2 py-1 text-xs font-medium text-orange-200">
                    {item.description}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-center">
              <p className="text-xs text-neutral-500">Built with ❤️ by Mateo</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
