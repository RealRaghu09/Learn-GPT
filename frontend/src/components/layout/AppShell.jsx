import { SourcesPanel } from '../sources/SourcesPanel'
import { StudioPanel } from '../studio/StudioPanel'

export function AppShell() {
  return (
    <div className="flex min-h-svh flex-col bg-[#131314] text-[#e8eaed]">
      <header className="flex h-14 shrink-0 items-center border-b border-[#3c4043] bg-[#1e1f20] px-4">
        <div className="flex items-center gap-2">
          <span
            className="grid size-8 place-items-center rounded-lg bg-[#28292a] text-sm font-medium text-[#8ab4f8]"
            aria-hidden
          >
            L
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium tracking-tight">Learnly</span>
            <span className="text-xs text-[#9aa0a6]">Notebook</span>
          </div>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-4">
        <aside className="min-h-0 border-b border-[#3c4043] lg:border-b-0 lg:border-r">
          <SourcesPanel />
        </aside>
        <main className="min-h-0 lg:col-span-3">
          <StudioPanel />
        </main>
      </div>
    </div>
  )
}
