import { useState } from "react";
import { ChatPanel } from "./ChatPanel";
import { QuizPanel } from "./QuizPanel";
import { SummaryPanel } from "./SummaryPanel";
import { PPTPanel } from "./PPTPanel"
import HomePage from "./HomePage";
const TABS = [
  { id: "quiz", label: "Quiz" },
  { id: "summary", label: "Summary" },
  { id: "chat", label: "Chat" },
  { id: "home", label: "Home" },
  {id : 'ppt' , label : "PPT"}
];

export function StudioPanel() {
  const [tab, setTab] = useState("home");

  return (
    <div className="flex h-full min-h-[420px] flex-col bg-[#131314] lg:max-h-[calc(100svh-3.5rem)]">
      <div
        className="flex shrink-0 gap-1 border-b border-[#3c4043] bg-[#1e1f20] px-2 pt-2"
        role="tablist"
        aria-label="Studio"
      >
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`relative rounded-t-lg px-4 py-2.5 text-sm font-medium transition ${
              tab === id
                ? "bg-[#131314] text-[#e8eaed] after:absolute after:inset-x-0 after:top-full after:h-px after:bg-[#131314]"
                : "text-[#9aa0a6] hover:bg-[#28292a]/80 hover:text-[#e8eaed]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden" role="tabpanel">
        {tab === "quiz" && <QuizPanel />}
        {tab === "summary" && <SummaryPanel />}
        {tab === "chat" && <ChatPanel />}
        {tab === "home" && <HomePage />}
        {tab === "ppt" && <PPTPanel/>}
      </div>
    </div>
  );
}
