import { useState } from 'react'

export function ChatPanel() {
  const [message, setMessage] = useState('')

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <div className="rounded-2xl rounded-tl-sm bg-[#28292a] px-4 py-3 text-sm leading-relaxed text-[#e8eaed]">
            Ask questions about your sources. I will answer using only what you have added to this
            notebook.
          </div>
          <p className="text-center text-xs text-[#9aa0a6]">Today</p>
        </div>
      </div>

      <div className="shrink-0 border-t border-[#3c4043] bg-[#1e1f20] p-3">
        <div className="mx-auto flex max-w-2xl gap-2">
          <label className="sr-only" htmlFor="chat-input">
            Message
          </label>
          <textarea
            id="chat-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message Learnly…"
            rows={1}
            className="min-h-[44px] flex-1 resize-none rounded-2xl border border-[#3c4043] bg-[#28292a] px-4 py-3 text-sm text-[#e8eaed] placeholder:text-[#9aa0a6] outline-none focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8]"
          />
          <button
            type="button"
            className="shrink-0 self-end rounded-full bg-[#8ab4f8] px-5 py-2.5 text-sm font-medium text-[#131314] transition hover:bg-[#a8c7fa]"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
