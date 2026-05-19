import { useState, useEffect, useRef } from "react";

export default function StackInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setIsOpen(false), 200);
  };

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
        onClick={() => setIsOpen(true)}
        className="animate-in fade-in slide-in-from-bottom-4 fixed right-4 bottom-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-stone-800 bg-stone-900 text-white shadow-lg transition-all hover:scale-110 hover:bg-stone-800 active:scale-95"
        aria-label="View Tech Stack"
        title="View Tech Stack"
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
      </button>

      {isOpen && (
        <div
          className={`Alte fixed inset-0 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity duration-200 ${
            isAnimating ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            ref={modalRef}
            className={`w-full max-w-sm rounded-2xl border border-stone-800 bg-stone-950/50 p-6 shadow-2xl backdrop-blur-3xl transition-all duration-200 ${
              isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Tech Stack</h2>
              <button
                onClick={handleClose}
                className="cursor-pointer rounded-full p-1 text-white transition-all hover:bg-stone-800 active:scale-95"
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
                  className="flex items-center justify-between rounded-xl border border-stone-800 bg-stone-900/50 p-3 transition-all duration-200 ease-out hover:bg-stone-800/50"
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
