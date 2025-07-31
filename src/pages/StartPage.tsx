import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.tsx'
import main from '../assets/main.webp'
import { countMemos } from '../db/dbApi.ts'

const HEADING = 'My Voice Memos'
const DESCRIPTION = 'Create quick memos by voice or keyboard. Stored locally in your browser.'
const BUTTON_TEXT_START = 'Start'
const BUTTON_TEXT_LOADING = 'Checking…'

export default function StartPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onStart = useCallback(async () => {
    setLoading(true)
    try {
      const total = await countMemos()
      if (total === 0) navigate('/new')
      else navigate('/memos')
    } finally {
      setLoading(false)
    }
  }, [navigate])

  return (
    <section className="hero-landscape grid min-h-screen grid-cols-1 gap-y-8 sm:gap-y-12 md:grid-cols-2 md:gap-0 lg:grid-cols-3">
      <div className="relative lg:col-span-2">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${main})` }}
          aria-hidden
        />
        <div className="h-[40vh] sm:h-[50vh] md:h-auto lg:h-full" />
      </div>

      <div className="relative z-10 hidden items-center justify-center p-6 md:flex lg:p-10">
        <div className="max-w-xl text-center md:text-left">
          <h1 className="mb-3 text-3xl font-semibold">{HEADING}</h1>
          <p className="mb-6 text-slate-600">{DESCRIPTION}</p>
          <Button onClick={onStart} disabled={loading} className="px-6 py-3 text-lg">
            {loading ? BUTTON_TEXT_LOADING : BUTTON_TEXT_START}
          </Button>
        </div>
      </div>

      <div className="px-6 pb-10 md:hidden">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="mb-3 text-3xl font-semibold">{HEADING}</h1>
          <p className="mb-6 text-slate-600">{DESCRIPTION}</p>
          <Button onClick={onStart} disabled={loading} className="px-6 py-3 text-lg">
            {loading ? BUTTON_TEXT_LOADING : BUTTON_TEXT_START}
          </Button>
        </div>
      </div>
    </section>
  )
}
