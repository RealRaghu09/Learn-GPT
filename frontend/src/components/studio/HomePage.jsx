import React from "react";

export default function HomePage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <h3 className="mb-1 text-lg font-medium text-[#e8eaed]">Home</h3>
        <p className="mb-6 text-sm text-[#9aa0a6]">Welcome to Learnly GPT</p>

        {/* Main Content */}
        <div className="min-h-[200px] rounded-xl border border-[#3c4043] bg-[#1e1f20] p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">
            Your AI-Powered Learning Assistant
          </h2>

          <p className="text-sm text-[#bdc1c6] leading-relaxed">
            Learnly GPT helps you learn smarter, faster, and more efficiently
            using AI. Upload content, explore concepts, and test your knowledge
            — all in one place.
          </p>

          {/* Features */}
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <h4 className="text-white font-medium"> Generate PPTs</h4>
              <p className="text-sm text-[#9aa0a6]">
                generate PPT's to deep dive into the sources.
              </p>
            </div>
          <div className="space-y-3 mt-4">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <h4 className="text-white font-medium">Generate Summaries</h4>
              <p className="text-sm text-[#9aa0a6]">
                Convert long PDFs or text into short, medium, or detailed
                summaries instantly.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <h4 className="text-white font-medium"> Create Quizzes</h4>
              <p className="text-sm text-[#9aa0a6]">
                Automatically generate quizzes from your content to test
                understanding.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <h4 className="text-white font-medium"> Chat with Content </h4>
              <p className="text-sm text-[#9aa0a6]">
                Ask questions and interact with your documents using AI-powered
                chat.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#9aa0a6]">
              Start exploring features !!!!!!!.....
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
