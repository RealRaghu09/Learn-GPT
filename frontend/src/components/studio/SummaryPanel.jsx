import React, { useState } from "react";
import { useData } from "../context/dataContext";
import { summarizeContent } from "../../requests/requests";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import ReactMarkdown from 'react-markdown'

export function SummaryPanel() {
  const { finalData } = useData();

  const [summary, setSummary] = useState("");
  const [size, setSize] = useState(""); 

  const levels = ["small", "medium", "large"];

  const handleClick = async (selectedSize) => {
    if (!selectedSize) {
      setSummary("Select the Level");
      return;
    }

    if (!finalData) {
      console.log("No context is provided");
      return;
    }

    try {
      const data = {
        content: finalData,
        size: selectedSize,
      };

      const responseSummary = await summarizeContent(data);
      setSummary(responseSummary.response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      <div className="mx-auto w-full max-w-2xl">
        <h3 className="mb-1 text-lg font-medium text-[#e8eaed]">Summary</h3>
        <p className="mb-6 text-sm text-[#9aa0a6]">
          A concise overview of your notebook sources.
        </p>

        {/* Summary Output */}
        <div className="min-h-[200px] rounded-xl border border-[#3c4043] bg-[#1e1f20] p-6">
          <p className="text-sm leading-relaxed text-[#bdc1c6]">
            <ReactMarkdown >
              {summary || "Summaries will appear here after generation."}
              </ReactMarkdown>
          </p>
        </div>

        {/* Dropdown */}
        <div className="mt-4 bg-[#1e1f20] p-6 rounded-xl border border-[#3c4043]">
          <p className="text-gray-300 mb-4">Select Summary Size</p>

          <Menu as="div" className="relative w-full">
            <MenuButton className="w-full bg-white/10 text-white p-2 rounded flex justify-between">
              {size ? size : "Select Level"}
              <ChevronDownIcon className="size-5" />
            </MenuButton>

            <MenuItems className="absolute w-full mt-2 bg-gray-800 rounded z-10">
              {levels.map((lvl) => (
                <MenuItem key={lvl}>
                  <button
                    onClick={() => {
                      setSize(lvl);
                      handleClick(lvl); 
                    }}
                    className={`w-full text-left px-4 py-2 ${
                      size === lvl
                        ? "bg-blue-500 text-black"
                        : "text-gray-300"
                    } hover:bg-white/10`}
                  >
                    {lvl}
                  </button>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>
      </div>
    </div>
  );
}