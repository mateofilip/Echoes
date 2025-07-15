# Echoes

Echoes is a modern web app for discovering and sharing inspiring quotes. Built with Astro, React, TailwindCSS, and Supabase, it features a beautiful, responsive UI with dark mode, smooth animations, and a curated collection of quotes.

## ✨ Features

- Get a random quote from a curated collection
- Dark mode toggle with system preference support
- Animated transitions and smooth UI
- Responsive design for all devices
- Powered by Supabase for backend and data

## 🚀 Tech Stack

- [Astro](https://astro.build/) (with React integration)
- [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)

## 📦 Setup & Installation

1. **Clone the repo:**
   ```sh
   git clone <your-repo-url>
   cd Echoes
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your Supabase credentials:
     ```env
     PUBLIC_SUPABASE_URL=your-supabase-url
     PUBLIC_SUPABASE_KEY=your-supabase-key
     ```
4. **Run the development server:**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:4321](http://localhost:4321).

## 🛠 Usage

- Click "Get a New Quote" to fetch a random quote.
- Use the dark mode toggle for your preferred theme.
- Navigate through previous/next quotes using the arrow buttons.

## 🗃 Deployment

- The project is ready for deployment on [Vercel](https://vercel.com/) or any platform supporting Astro SSR.
- To build for production:
  ```sh
  npm run build
  npm run preview
  ```
- For Vercel, connect your repo and set the required environment variables.

## 👤 Author

- [Mateo Filip](https://github.com/mateofilip)

## 📄 License

This project is for personal or educational use. Contact the author for other uses.
