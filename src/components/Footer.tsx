export default function Footer() {
  return (
    <footer className="Alte absolute right-0 bottom-0 left-0 flex flex-col items-center px-4 pb-6 sm:px-8 sm:pb-4 md:px-12 lg:px-16 xl:px-20 2xl:px-32">
      <p className="max-w-4xl pb-4 text-center text-xs text-slate-800 sm:pb-6 sm:text-sm md:text-base lg:text-sm xl:text-base dark:text-slate-200">
        Built in{" "}
        <a
          href="https://code.visualstudio.com/"
          target="_blank"
          rel="noreferrer noopener"
          className="relative cursor-pointer font-semibold text-slate-700 transition-all duration-300 ease-in-out after:absolute after:bottom-0 after:left-0 after:h-1/15 after:w-0 after:rounded-full after:bg-slate-700 after:transition-all after:duration-300 hover:after:w-full dark:text-slate-300 dark:after:bg-slate-300"
        >
          Visual Studio Code,
        </a>{" "}
        powered by{" "}
        <a
          href="https://astro.build/"
          target="_blank"
          rel="noreferrer noopener"
          className="relative cursor-pointer font-semibold text-slate-700 transition-all duration-300 ease-in-out after:absolute after:bottom-0 after:left-0 after:h-1/15 after:w-0 after:rounded-full after:bg-slate-700 after:transition-all after:duration-300 hover:after:w-full dark:text-slate-300 dark:after:bg-slate-300"
        >
          Astro
        </a>
        , styled using{" "}
        <a
          href="https://tailwindcss.com/"
          target="_blank"
          rel="noreferrer noopener"
          className="relative cursor-pointer font-semibold text-slate-700 transition-all duration-300 ease-in-out after:absolute after:bottom-0 after:left-0 after:h-1/15 after:w-0 after:rounded-full after:bg-slate-700 after:transition-all after:duration-300 hover:after:w-full dark:text-slate-300 dark:after:bg-slate-300"
        >
          Tailwind CSS
        </a>
        , and delivered by{" "}
        <a
          href="https://vercel.com/"
          target="_blank"
          rel="noreferrer noopener"
          className="relative cursor-pointer font-semibold text-slate-700 transition-all duration-300 ease-in-out after:absolute after:bottom-0 after:left-0 after:h-1/15 after:w-0 after:rounded-full after:bg-slate-700 after:transition-all after:duration-300 hover:after:w-full dark:text-slate-300 dark:after:bg-slate-300"
        >
          Vercel
        </a>
        . All encapsulated within the{" "}
        <a
          href="https://www.fontshare.com/fonts/satoshi"
          target="_blank"
          rel="noreferrer noopener"
          className="relative cursor-pointer font-semibold text-slate-700 transition-all duration-300 ease-in-out after:absolute after:bottom-0 after:left-0 after:h-1/15 after:w-0 after:rounded-full after:bg-slate-700 after:transition-all after:duration-300 hover:after:w-full dark:text-slate-300 dark:after:bg-slate-300"
        >
          Satoshi
        </a>{" "}
        font with the help of some AI generated icons. Data is brought by{" "}
        <a
          href="https://openweathermap.org/api"
          target="_blank"
          rel="noreferrer noopener"
          className="relative cursor-pointer font-semibold text-slate-700 transition-all duration-300 ease-in-out after:absolute after:bottom-0 after:left-0 after:h-1/15 after:w-0 after:rounded-full after:bg-slate-700 after:transition-all after:duration-300 hover:after:w-full dark:text-slate-300 dark:after:bg-slate-300"
        >
          OpenWeatherMap API
        </a>
        .
      </p>
    </footer>
  );
}
