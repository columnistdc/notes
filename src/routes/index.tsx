import { createBrowserRouter } from 'react-router-dom'

import { NewMemoPage } from '@/pages/NewMemoPage'
import StartPage from '@/pages/StartPage'
import { WIP } from '@/pages/WIP.tsx'

export const router = createBrowserRouter([
  { path: '/', element: <StartPage /> },
  { path: '/memos', element: <WIP /> },
  { path: '/new', element: <NewMemoPage /> },
  { path: '/edit/:id', element: <WIP /> },
])
