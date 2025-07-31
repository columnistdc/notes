import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import main from '../../assets/main.webp'
import { countMemos } from '../../db/dbApi.ts'

import { LandingIntro } from './components/LandingIntro.tsx'

export default function StartPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleStart = useCallback(async () => {
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
        <LandingIntro className={'md:text-left'} onStart={handleStart} loading={loading} />
      </div>

      <div className="px-6 pb-10 md:hidden">
        <LandingIntro className={'mx-auto'} onStart={handleStart} loading={loading} />
      </div>
    </section>
  )
}
