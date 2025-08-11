import { createBrowserRouter } from 'react-router-dom'

import { MemoPageMode } from '@/constants.ts'
import { MemoPage } from '@/pages/MemoPage'
import { MemoListPage } from '@/pages/MemosListPage'
import { StartPage } from '@/pages/StartPage'

export const router = createBrowserRouter([
  { path: '/', element: <StartPage /> },
  { path: '/memos', element: <MemoListPage /> },
  { path: '/new', element: <MemoPage mode={MemoPageMode.Create} /> },
  { path: '/edit/:id', element: <MemoPage mode={MemoPageMode.Edit} /> },
])
