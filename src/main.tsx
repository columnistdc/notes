import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { checkDbAvailable } from '@/db/db.ts'
import { router } from '@/routes'

import './index.css'

void (async () => {
  const dbAvailable = await checkDbAvailable()

  const rootElement = document.getElementById('root')
  if (!rootElement) throw new Error('Root element #root not found in DOM')

  createRoot(rootElement).render(
    <StrictMode>
      {dbAvailable ? (
        <RouterProvider router={router} />
      ) : (
        <div
          role="alert"
          className="flex min-h-screen items-center justify-center bg-[#FFFBEA] p-6"
        >
          <div className="max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
            <p className="text-base font-medium text-red-700">
              Local storage is unavailable. Your memos cannot be saved.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              This can happen in private browsing mode or when storage is blocked by browser
              settings.
            </p>
          </div>
        </div>
      )}
    </StrictMode>,
  )
})()
