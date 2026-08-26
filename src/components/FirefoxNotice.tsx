import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X, Copy, Check } from "lucide-react";

export default function FirefoxNotice() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof navigator === "undefined" || typeof window === "undefined") return;
    const ua = navigator.userAgent;
    const isFirefox = /firefox|fxios/i.test(ua);
    if (!isFirefox) return;
    const t = setTimeout(() => setVisible(true), 700);
    return () => clearTimeout(t);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link and open it in Chrome, Edge or Safari:", window.location.href);
    }
  };

  const overlayTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: "easeOut" as const };
  const modalTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: "easeOut" as const };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="firefox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={overlayTransition}
            className="fixed inset-0 z-50 bg-black/90"
            onClick={() => setVisible(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visible && (
          <motion.div
            key="firefox-modal"
            initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            transition={modalTransition}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setVisible(false)}
            aria-modal="true"
            role="dialog"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="font-alte-haas w-full max-w-sm rounded-2xl border border-stone-800 bg-stone-950 p-6 shadow-2xl ring-1 ring-white/10"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 id="firefox-title" className="text-base font-semibold leading-6 tracking-tight text-white">
                  Heads up!
                </h2>
              <button
                type="button"
                onClick={() => setVisible(false)}
                aria-label="Close"
                className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-stone-500 transition duration-200 hover:bg-stone-900 hover:text-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-700"
              >
                <X size={14} strokeWidth={2} aria-hidden="true" />
              </button>
              </div>

              <div className="mt-2 text-sm leading-6 text-stone-300">
                <p>Echoes uses soft blurs that Firefox draws more slowly, so it can feel choppy here. Not your device.</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-400">
                For the smoothest view, open in Chrome, Edge or Safari. Or just stay here.
              </p>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVisible(false)}
                  className="inline-flex cursor-pointer items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-stone-400 transition duration-200 hover:bg-stone-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-700"
                >
                  Continue anyway
                </button>

                <motion.button
                  type="button"
                  onClick={handleCopyLink}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                  transition={overlayTransition}
                  className="inline-flex w-32 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-900 shadow-sm transition duration-200 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copied ? (
                      <motion.span
                        key="copied"
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                        transition={overlayTransition}
                        className="inline-flex items-center gap-1.5"
                      >
                      <Check size={14} strokeWidth={2.2} aria-hidden="true" />
                      Copied!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                      transition={overlayTransition}
                      className="inline-flex items-center gap-1.5"
                    >
                      <Copy size={14} strokeWidth={1.7} aria-hidden="true" />
                      Copy link
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
