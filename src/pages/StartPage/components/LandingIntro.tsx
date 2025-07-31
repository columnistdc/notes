import type { FC } from 'react'
import clsx from 'clsx'

import Button from '../../../components/Button.tsx'

interface Props {
  onStart: () => void
  loading: boolean
  className?: string
}

const HEADING = 'My Voice Memos'
const DESCRIPTION = 'Create quick memos by voice or keyboard. Stored locally in your browser.'
const BUTTON_TEXT_START = 'Start'
const BUTTON_TEXT_LOADING = 'Checking…'

export const LandingIntro: FC<Props> = ({ className, loading, onStart }) => {
  return (
    <div className={clsx('max-w-xl text-center', className)}>
      <h1 className="mb-3 text-3xl font-semibold">{HEADING}</h1>
      <p className="mb-6 text-slate-600">{DESCRIPTION}</p>
      <Button onClick={onStart} disabled={loading} className="px-6 py-3 text-lg">
        {loading ? BUTTON_TEXT_LOADING : BUTTON_TEXT_START}
      </Button>
    </div>
  )
}
