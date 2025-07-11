export default function Footer() {
  return (
    <footer className="Alte absolute right-0 bottom-0 left-0 flex flex-col items-center px-4 pb-6 sm:px-8 sm:pb-4 md:px-12 lg:px-16 xl:px-20 2xl:px-32">
      <p className="max-w-4xl pb-4 text-center text-xs sm:pb-6 sm:text-sm md:text-base lg:text-sm xl:text-base">
        Crafted in{" "}
        <a
          href="https://code.visualstudio.com/"
          target="_blank"
          rel="noreferrer noopener"
          className="relative cursor-pointer font-bold transition-all duration-300 ease-in-out after:absolute after:bottom-0 after:left-0 after:h-1/15 after:w-0 after:rounded-full after:bg-gray-700 after:transition-all after:duration-300 hover:after:w-full dark:after:bg-orange-200"
        >
          Visual Studio Code,
        </a>{" "}
        with{" "}
        <a
          href="https://astro.build/"
          target="_blank"
          rel="noreferrer noopener"
          className="relative cursor-pointer font-bold transition-all duration-300 ease-in-out after:absolute after:bottom-0 after:left-0 after:h-1/15 after:w-0 after:rounded-full after:bg-gray-700 after:transition-all after:duration-300 hover:after:w-full dark:after:bg-orange-200"
        >
          Astro
        </a>{" "}
        magic,{" "}
        <a
          href="https://tailwindcss.com/"
          target="_blank"
          rel="noreferrer noopener"
          className="relative cursor-pointer font-bold transition-all duration-300 ease-in-out after:absolute after:bottom-0 after:left-0 after:h-1/15 after:w-0 after:rounded-full after:bg-gray-700 after:transition-all after:duration-300 hover:after:w-full dark:after:bg-orange-200"
        >
          Tailwind CSS
        </a>{" "}
        flair, and{" "}
        <a
          href="https://vercel.com/"
          target="_blank"
          rel="noreferrer noopener"
          className="relative cursor-pointer font-bold transition-all duration-300 ease-in-out after:absolute after:bottom-0 after:left-0 after:h-1/15 after:w-0 after:rounded-full after:bg-gray-700 after:transition-all after:duration-300 hover:after:w-full dark:after:bg-orange-200"
        >
          Vercel
        </a>{" "}
        speed.{" "}
        <a
          href="https://supabase.com/"
          target="_blank"
          rel="noreferrer noopener"
          className="relative cursor-pointer font-bold transition-all duration-300 ease-in-out after:absolute after:bottom-0 after:left-0 after:h-1/15 after:w-0 after:rounded-full after:bg-gray-700 after:transition-all after:duration-300 hover:after:w-full dark:after:bg-orange-200"
        >
          Supabase
        </a>{" "}
        handles the backend while the data is delivered by an API of my own.
      </p>
    </footer>
  );
}
