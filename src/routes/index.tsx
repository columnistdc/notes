import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { ErrorBoundary } from '@/components/ErrorBoundary.tsx'
import { LoadingSpinner } from '@/components/LoadingSpinner.tsx'
import { MemoPageMode } from '@/constants.ts'

const StartPage = lazy(() =>
  import('@/pages/StartPage').then((module) => ({ default: module.StartPage })),
)
const MemoListPage = lazy(() =>
  import('@/pages/MemosListPage').then((module) => ({ default: module.MemoListPage })),
)
const MemoPage = lazy(() =>
  import('@/pages/MemoPage').then((module) => ({ default: module.MemoPage })),
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <StartPage />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: '/memos',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <MemoListPage />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: '/new',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <MemoPage mode={MemoPageMode.Create} />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: '/edit/:id',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <MemoPage mode={MemoPageMode.Edit} />
        </Suspense>
      </ErrorBoundary>
    ),
  },
])
