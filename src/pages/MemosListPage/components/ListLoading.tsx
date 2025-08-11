export const ListLoading = () => {
  return (
    <div className="p-4 md:p-5">
      <div className="animate-pulse space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 rounded-md bg-black/5" />
        ))}
      </div>
    </div>
  )
}
