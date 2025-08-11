import type { RefObject } from 'react'

import FabMic from '@/components/FabMic.tsx'

type TextEditorProps = {
  text: string
  onChange: (value: string) => void
  onDictation: (result: string) => void
  textareaRef: RefObject<HTMLTextAreaElement | null>
}

export const TextEditor = ({ text, onChange, onDictation, textareaRef }: TextEditorProps) => {
  return (
    <main className="relative mx-auto w-full max-w-3xl flex-1 px-4 py-4">
      <div className="relative rounded-2xl border border-black/5 bg-white/80 p-0 shadow-sm">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[50vh] w-full resize-y bg-transparent p-4 text-[17px] leading-7 outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 md:p-6"
          placeholder="Start typing your memo…"
          aria-describedby="editor-help"
          aria-label="Memo text editor"
        />
        <div className="absolute bottom-2 right-2 z-10">
          <FabMic onResult={onDictation} />
        </div>
      </div>
      <p id="editor-help" className="mt-3 text-sm text-slate-500">
        Tip: place the cursor where you want the dictated text to be inserted, then tap the
        microphone button.
      </p>
    </main>
  )
}
