import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useData } from "../context/dataContext";
import { generateStructured } from "../../requests/requests";

const TARGET_AUDIENCE = ["students", "educators", "executives", "general"];
const NUM_SLIDES = ["5", "10", "15", "20", "25"];
const PRESENTATION_STYLE = ["minimal", "detailed", "storytelling", "data_driven"];
const LANGUAGES = ["English", "Spanish", "French", "Hindi", "German", "Japanese"];
const TONES = ["formal", "casual", "persuasive", "neutral", "inspirational"];
const SUMMARY_LEVELS = ["brief", "standard", "detailed"];

const fieldClass =
  "w-full rounded-lg border border-[#3c4043] bg-white/10 px-3 py-2.5 text-sm text-[#e8eaed] outline-none transition focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8]";

const labelClass = "mb-1.5 block text-sm font-medium text-[#bdc1c6]";

function ToggleRow({ id, label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[#3c4043] bg-white/5 px-4 py-3">
      <label htmlFor={id} className="text-sm text-[#e8eaed]">
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          checked ? "bg-[#8ab4f8]" : "bg-[#5f6368]"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function SpinnerIcon({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function PPTPanel() {
  const { finalData } = useData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [outline, setOutline] = useState("");
  const [generateError, setGenerateError] = useState(null);

  const [user_response, setUserResponse] = useState({
    target_audience: "general",
    num_slides: "10",
    presentation_style: "minimal",
    include_images: true,
    include_charts: false,
    language: "English",
    tone: "neutral",
    summary_level: "standard",
    theme: "black",
    data : finalData
  });

  const setField = (key, value) => {
    setUserResponse((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    setUserResponse((prev) => ({ ...prev, data: finalData }));
  }, [finalData]);

  const handleGenerate = async () => {
    setGenerateError(null);
    setIsGenerating(true);
    let objectUrl;
    try {
      objectUrl = await generateStructured({ content: user_response });
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = "presentation.pptx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setGenerateError(
        err?.message || "Could not generate the presentation. Try again."
      );
    } finally {
      setIsGenerating(false);
      if (objectUrl) {
        window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 100);
      }
    }
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      <div className="mx-auto w-full max-w-2xl">
        <h3 className="mb-1 text-lg font-medium text-[#e8eaed]">
          Presentation settings
        </h3>
        <p className="mb-6 text-sm text-[#9aa0a6]">
          Configure how your deck is generated from your sources.
        </p>

        <form
          className="space-y-6 rounded-xl border border-[#3c4043] bg-[#1e1f20] p-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label className={labelClass} htmlFor="ppt-target-audience">
                Target audience
              </label>
              <select
                id="ppt-target-audience"
                className={fieldClass}
                value={user_response.target_audience}
                onChange={(e) =>
                  setField("target_audience", e.target.value)
                }
              >
                {TARGET_AUDIENCE.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#1e1f20]">
                    {opt.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-1">
              <label className={labelClass} htmlFor="ppt-num-slides">
                Number of slides
              </label>
              <select
                id="ppt-num-slides"
                className={fieldClass}
                value={user_response.num_slides}
                onChange={(e) => setField("num_slides", e.target.value)}
              >
                {NUM_SLIDES.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#1e1f20]">
                    {opt} slides
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="ppt-style">
                Presentation style
              </label>
              <select
                id="ppt-style"
                className={fieldClass}
                value={user_response.presentation_style}
                onChange={(e) =>
                  setField("presentation_style", e.target.value)
                }
              >
                {PRESENTATION_STYLE.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#1e1f20]">
                    {opt.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-1">
              <label className={labelClass} htmlFor="ppt-language">
                Language
              </label>
              <select
                id="ppt-language"
                className={fieldClass}
                value={user_response.language}
                onChange={(e) => setField("language", e.target.value)}
              >
                {LANGUAGES.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#1e1f20]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-1">
              <label className={labelClass} htmlFor="ppt-tone">
                Tone
              </label>
              <select
                id="ppt-tone"
                className={fieldClass}
                value={user_response.tone}
                onChange={(e) => setField("tone", e.target.value)}
              >
                {TONES.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#1e1f20]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="ppt-summary-level">
                Summary level
              </label>
              <select
                id="ppt-summary-level"
                className={fieldClass}
                value={user_response.summary_level}
                onChange={(e) => setField("summary_level", e.target.value)}
              >
                {SUMMARY_LEVELS.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#1e1f20]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-[#bdc1c6]">Media</p>
            <ToggleRow
              id="ppt-include-images"
              label="Include images"
              checked={user_response.include_images}
              onChange={(v) => setField("include_images", v)}
            />
            <ToggleRow
              id="ppt-include-charts"
              label="Include charts"
              checked={user_response.include_charts}
              onChange={(v) => setField("include_charts", v)}
            />
          </div>

          <div>
            <p className={`${labelClass} mb-2`}>Theme</p>
            <div className="flex gap-2 rounded-lg border border-[#3c4043] bg-white/5 p-1">
              {[
                { value: "black", label: "Dark" },
                { value: "white", label: "Light" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setField("theme", value)}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                    user_response.theme === value
                      ? "bg-[#8ab4f8] text-[#202124]"
                      : "text-[#9aa0a6] hover:bg-white/10 hover:text-[#e8eaed]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              aria-busy={isGenerating}
              aria-label={isGenerating ? "Generating presentation outline" : "Generate presentation outline"}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#8ab4f8] px-4 py-3 text-sm font-semibold text-[#202124] transition hover:bg-[#a8c7fa] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <SpinnerIcon className="h-5 w-5 animate-spin text-[#202124]" />
                  Generating…
                </>
              ) : (
                "Generate"
              )}
            </button>
            {generateError && (
              <p className="mt-2 text-sm text-red-400" role="alert">
                {generateError}
              </p>
            )}
            {outline && (
              <div className="mt-4 rounded-lg border border-[#3c4043] bg-[#131314] p-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#9aa0a6]">
                  Outline
                </p>
                <div className="text-sm leading-relaxed text-[#bdc1c6]">
                  <ReactMarkdown>{outline}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
