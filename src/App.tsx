import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 antialiased">
      <header className="max-w-3xl mx-auto px-6 pt-10 pb-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Vite + React</h1>
        <nav className="flex items-center gap-4">
          <a
            href="https://vite.dev"
            target="_blank"
            className="text-slate-300 hover:text-white transition"
          >
            Vite
          </a>
          <a
            href="https://react.dev"
            target="_blank"
            className="text-slate-300 hover:text-white transition"
          >
            React
          </a>
        </nav>
      </header>

      <section className="max-w-3xl mx-auto px-6">
        <div className="flex items-center justify-center gap-10 md:gap-14">
          <a
            href="https://vite.dev"
            target="_blank"
            className="group relative"
            aria-label="Vite website"
          >
            <img
              src={viteLogo}
              alt="Vite logo"
              className="h-16 w-16 md:h-20 md:w-20 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_8px_25px_rgba(137,99,255,0.45)]"
            />
          </a>
          <a
            href="https://react.dev"
            target="_blank"
            className="group relative"
            aria-label="React website"
          >
            <img
              src={reactLogo}
              alt="React logo"
              className="h-16 w-16 md:h-20 md:w-20 transition-transform duration-300 group-hover:scale-110 animate-[spin_12s_linear_infinite] drop-shadow-[0_8px_25px_rgba(56,189,248,0.45)]"
            />
          </a>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="rounded-2xl p-6 md:p-8 bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          <h2 className="text-xl font-semibold mb-4">Playground</h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={() => setCount((c) => c + 1)}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10
                         transition will-change-transform hover:-translate-y-0.5
                         border-2 border-[rgba(255,165,0,0.5)]
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-slate-900"
            >
              count is&nbsp;<span className="font-semibold">{count}</span>
            </button>

            <p className="text-slate-300">
              Edit{' '}
              <code className="px-2 py-1 rounded-md bg-black/40 border border-white/10">
                src/App.tsx
              </code>{' '}
              and save to test HMR
            </p>
          </div>

          <div className="mt-6 text-slate-400 text-sm">Click on the logos above to learn more</div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm">
        Crafted with Tailwind • {new Date().getFullYear()}
      </footer>
    </div>
  )
}

export default App
