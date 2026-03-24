import { useState, useRef } from 'react'
import { useData } from '../context/dataContext'
import { sendChatMessage } from '../../requests/requests' 
export function ChatPanel() {
  const { finalData } = useData()

  const [messages, setMessages] = useState([
    {
      text: 'Ask questions about your sources. I will answer using only what you have added to this notebook.',
      sender: 'bot',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const bottomRef = useRef(null)

  // Scroll to bottom
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }

  // Format response
  const formatResponse = (text) => {
    let formatted = text.trim()
    formatted = formatted.replace(/\s+/g, ' ')
    formatted = formatted.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '')
    formatted = formatted.replace(/([.,!?])([a-zA-Z])/g, '$1 $2')
    formatted = formatted.replace(
      /(^|[.!?]\s+)([a-z])/g,
      (match, p1, p2) => p1 + p2.toUpperCase()
    )
    return formatted
  }

  // Handle send
  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { text: input, sender: 'user' }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Replace with your API call
      const responseData = await sendChatMessage({
        question: input,
        context: finalData,
      })

      const formatted = formatResponse(responseData.response)

      const botMessage = { text: formatted, sender: 'bot' }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error(error)
      setMessages((prev) => [
        ...prev,
        { text: 'Something went wrong. Try again.', sender: 'bot' },
      ])
    } finally {
      setIsLoading(false)
      setTimeout(scrollToBottom, 100)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`rounded-2xl px-4 py-3 text-sm ${
                msg.sender === 'user'
                  ? 'bg-[#8ab4f8] text-black self-end'
                  : 'bg-[#28292a] text-[#e8eaed]'
              }`}
            >
              {msg.text}
            </div>
          ))}

          {isLoading && (
            <div className="text-sm text-gray-400">Typing...</div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input box */}
      <form
        onSubmit={handleSend}
        className="border-t border-[#3c4043] bg-[#1e1f20] p-3"
      >
        <div className="mx-auto flex max-w-2xl gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Learnly…"
            rows={1}
            className="flex-1 resize-none rounded-2xl border border-[#3c4043] bg-[#28292a] px-4 py-3 text-sm text-white outline-none focus:border-[#8ab4f8]"
          />

          <button
            type="submit"
            className="rounded-full bg-[#8ab4f8] px-5 py-2 text-sm font-medium text-black hover:bg-[#a8c7fa]"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}