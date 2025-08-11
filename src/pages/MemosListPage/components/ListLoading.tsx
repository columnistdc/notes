import { LoadingSpinner } from '@/components/LoadingSpinner.tsx'

export const ListLoading = () => {
  return (
    <div className="p-4 md:p-5">
      <LoadingSpinner size="md" text="Loading memos..." />
    </div>
  )
}
