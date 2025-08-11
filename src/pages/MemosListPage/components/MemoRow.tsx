import { Link } from 'react-router-dom'

import type { Memo } from '@/db/types.ts'
import { createTextPreview } from '@/helpers/createTextPreview.ts'
import { formatTimestamp } from '@/helpers/formatTimestamp.ts'

type MemoRowProps = {
  item: Memo
  onDelete: () => void
}

export const MemoRow = ({ item, onDelete }: MemoRowProps) => {
  const right = formatTimestamp(item.createdAt)
  const to = `/edit/${item.id}`

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete()
  }

  return (
    <li className="rounded-2xl border border-black/5 bg-white/80 shadow-sm transition hover:shadow-md">
      <div className="relative">
        <Link
          to={to}
          className="block px-4 py-3 transition hover:bg-black/[0.03] focus:bg-black/[0.04] md:px-5 md:py-4"
        >
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="truncate text-[16.5px] font-semibold leading-6 md:text-[17px]">
                {item.title || 'Untitled'}
              </div>
              <div className="mt-1 line-clamp-2 text-[14.5px] text-slate-600">
                {createTextPreview(item.text)}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 self-center pl-3">
              <div className="text-right text-sm text-slate-500">{right}</div>
              <button
                onClick={handleDeleteClick}
                aria-label={`Delete memo "${item.title || 'Untitled'}"`}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                title={`Delete memo "${item.title || 'Untitled'}"`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7ZM9 8V17H11V8H9ZM13 8V17H15V8H13Z" />
                </svg>
              </button>
            </div>
          </div>
        </Link>
      </div>
    </li>
  )
}
