import { useCallback, useRef, useState } from 'react'

function SectionTitle({ children }) {
  return (
    <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-[#9aa0a6]">
      {children}
    </h2>
  )
}

export function SourcesPanel() {
  const [link, setLink] = useState('')
  const [text, setText] = useState('')
  const fileInputRef = useRef(null)


  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadStatus('Uploading...');
    const formData = new FormData();
    formData.append("pdf", file);
  
    try {
      const result = await uploadPdf(formData);
      console.log("Extracted text:", result.text);
      setUploadStatus('Done!');
      setFinalData(result.text || '');
    } catch (error) {
      setUploadStatus('Error uploading PDF');
      console.error('Upload error:', error);
    }
  };
  return (
    <div className="flex h-full min-h-[320px] flex-col gap-6 overflow-y-auto p-4 lg:max-h-[calc(100svh-3.5rem)]">
      <div>
        <SectionTitle>Sources</SectionTitle>
        <p className="mb-4 text-sm leading-relaxed text-[#bdc1c6]">
          Add PDFs, links, or paste text. Your content stays in this notebook.
        </p>
      </div>

      <section>
        <SectionTitle>PDF</SectionTitle>
        <button
          type="button"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#5f6368] bg-[#1e1f20] px-4 py-8 text-center transition hover:border-[#8ab4f8]/50 hover:bg-[#28292a]"
        >
          <svg
            className="size-10 text-[#8ab4f8]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
          </svg>
          <span className="text-sm font-medium text-[#e8eaed]">Upload a PDF</span>
          <span className="text-xs text-[#9aa0a6]">Drop or click to browse</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={() => {
            /* future: handle file */
          }}
        />
      </section>

      <section>
        <SectionTitle>Link</SectionTitle>
        <label className="sr-only" htmlFor="source-link">
          Web link
        </label>
        <input
          id="source-link"
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://…"
          className="w-full rounded-lg border border-[#3c4043] bg-[#28292a] px-3 py-2.5 text-sm text-[#e8eaed] placeholder:text-[#9aa0a6] outline-none ring-0 transition focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8]"
        />
      </section>

      <section className="min-h-0 flex-1">
        <SectionTitle>Text</SectionTitle>
        <label className="sr-only" htmlFor="source-text">
          Plain text
        </label>
        <textarea
          id="source-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type notes, articles, transcripts…"
          rows={6}
          className="min-h-[140px] w-full resize-y rounded-lg border border-[#3c4043] bg-[#28292a] px-3 py-2.5 text-sm leading-relaxed text-[#e8eaed] placeholder:text-[#9aa0a6] outline-none focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8]"
        />
      </section>
    </div>
  )
}
