export function QuizPanel() {
  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      <div className="mx-auto w-full max-w-2xl">
        <h3 className="mb-1 text-lg font-medium text-[#e8eaed]">Quiz</h3>
        <p className="mb-6 text-sm text-[#9aa0a6]">
          Generate questions from your sources once they are added.
        </p>
        <div className="rounded-xl border border-[#3c4043] bg-[#1e1f20] p-6">
          <p className="text-center text-sm text-[#bdc1c6]">
            No quiz yet. Add sources on the left, then refresh this view.
          </p>
          <button
            type="button"
            disabled
            className="mt-4 w-full rounded-lg bg-[#28292a] px-4 py-2.5 text-sm font-medium text-[#9aa0a6]"
          >
            Generate quiz
          </button>
        </div>
      </div>
    </div>
  )
}
