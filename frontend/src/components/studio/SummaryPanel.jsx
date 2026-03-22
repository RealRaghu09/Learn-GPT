export function SummaryPanel() {
  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      <div className="mx-auto w-full max-w-2xl">
        <h3 className="mb-1 text-lg font-medium text-[#e8eaed]">Summary</h3>
        <p className="mb-6 text-sm text-[#9aa0a6]">
          A concise overview of your notebook sources.
        </p>
        <div className="min-h-[200px] rounded-xl border border-[#3c4043] bg-[#1e1f20] p-6">
          <p className="text-sm leading-relaxed text-[#bdc1c6]">
            Summaries will appear here after you add content and run generation.
          </p>
        </div>
      </div>
    </div>
  )
}
