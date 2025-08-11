type TitleInputProps = {
  title: string
  onChange: (value: string) => void
}

export const TitleInput = ({ title, onChange }: TitleInputProps) => {
  return (
    <div className="mb-4">
      <label htmlFor="memo-title" className="mb-2 block text-sm font-medium text-slate-700">
        Title
      </label>
      <input
        id="memo-title"
        type="text"
        value={title}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-lg outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100 focus:ring-offset-2"
        placeholder="Enter memo title…"
        aria-describedby="title-help"
        aria-label="Memo title"
      />
      <p id="title-help" className="mt-1 text-xs text-slate-500">
        Enter a descriptive title for your memo
      </p>
    </div>
  )
}
