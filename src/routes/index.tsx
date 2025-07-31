import { createBrowserRouter } from 'react-router-dom'
import { WIP } from '../pages/WIP.tsx'
import StartPage from '../pages/StartPage.tsx'

export const router = createBrowserRouter([
  { path: '/', element: <StartPage /> },
  { path: '/memos', element: <WIP /> },
  { path: '/new', element: <WIP /> },
  { path: '/edit/:id', element: <WIP /> },
])
