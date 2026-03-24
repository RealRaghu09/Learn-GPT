import React, { useState } from "react";
import { generateQuiz } from "../../requests/requests";
import { useData } from "../context/dataContext";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export function QuizPanel() {
  const { finalData } = useData();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [difficulty, setDifficulty] = useState(null);
  const [apiQuestions, setApiQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Fetch Questions 
  const fetchQuestions = async (level) => {
    const selectedLevel = level || difficulty;

    if (!selectedLevel) {
      setError("Please select difficulty");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Sending difficulty:", selectedLevel);

      const data = await generateQuiz({
        content: finalData,
        level: selectedLevel,
      });

      if (!data?.response) {
        throw new Error("Invalid API response");
      }

      const parsed = JSON.parse(data.response);

      const formatted = [];
      for (let i = 1; i <= 5; i++) {
        formatted.push({
          question: parsed[`question_${i}`],
          options: [
            parsed[`question_${i}_option_1`],
            parsed[`question_${i}_option_2`],
            parsed[`question_${i}_option_3`],
            parsed[`question_${i}_option_4`],
          ],
          correct: parsed[`correct_answer_${i}`],
        });
      }

      setApiQuestions(formatted);
      setCurrentQuestion(0);
    } catch (err) {
      console.error(err);
      setError("Failed to load quiz");
    }

    setIsLoading(false);
  };

  //  Option click
  const handleOptionClick = (option) => {
    if (showAnswer) return;

    setSelectedOption(option);
    setShowAnswer(true);

    if (option === apiQuestions[currentQuestion].correct) {
      setCurrentScore((prev) => prev + 1);
    }
  };

  //  Next
  const handleNext = () => {
    if (currentQuestion === apiQuestions.length - 1) {
      setShowResults(true);
      return;
    }

    setCurrentQuestion((prev) => prev + 1);
    setSelectedOption(null);
    setShowAnswer(false);
  };

  //  Reset
  const handleReset = () => {
    setApiQuestions([]);
    setDifficulty(null);
    setCurrentScore(0);
    setSelectedOption(null);
    setShowAnswer(false);
    setShowResults(false);
    setCurrentQuestion(0);
  };

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mx-auto w-full max-w-2xl">
        <h3 className="text-white text-lg mb-2">Quiz</h3>

        {/* ERROR */}
        {error && <p className="text-red-400">{error}</p>}

        {/* RESULTS */}
        {showResults && (
          <div className="text-white text-center mt-6">
            <h2>Quiz Completed 🎉</h2>
            <p>
              Score: {currentScore}/{apiQuestions.length}
            </p>
            <button onClick={handleReset} className="mt-3 bg-blue-500 p-2 rounded">
              Restart
            </button>
          </div>
        )}

        {/* DROPDOWN */}
        {!showResults && apiQuestions.length === 0 && (
          <div className="bg-[#1e1f20] p-6 rounded-xl border border-[#3c4043]">
            <p className="text-gray-300 mb-4">Select Difficulty</p>

            <Menu as="div" className="relative w-full">
              <MenuButton className="w-full bg-white/10 text-white p-2 rounded flex justify-between">
                {difficulty ? difficulty.toUpperCase() : "Select Level"}
                <ChevronDownIcon className="size-5" />
              </MenuButton>

              <MenuItems className="absolute w-full mt-2 bg-gray-800 rounded z-10">
                {["easy", "medium", "hard"].map((lvl) => (
                  <MenuItem key={lvl}>
                    <button
                      onClick={() => {
                        setDifficulty(lvl);
                        fetchQuestions(lvl); 
                      }}
                      className={`w-full text-left px-4 py-2 ${
                        difficulty === lvl
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
        )}

        {/* LOADING */}
        {isLoading && <p className="text-white mt-4">Loading...</p>}

        {/* QUIZ */}
        {apiQuestions.length > 0 && !showResults && (
          <div className="mt-6 text-white">
            <p>Score: {currentScore}</p>

            <h2>Q{currentQuestion + 1}</h2>
            <p>{apiQuestions[currentQuestion].question}</p>
            {/* DOOO THISSS RAGHHHHHUUUUUNNNANDAN */}
            <div className="grid gap-2 mt-3">
              {apiQuestions[currentQuestion].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(opt)}
                  disabled={showAnswer}
                  className={`p-2 rounded ${
                    showAnswer
                      ? opt === apiQuestions[currentQuestion].correct
                        ? "bg-green-500"
                        : opt === selectedOption
                        ? "bg-red-500"
                        : "bg-gray-700"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {showAnswer && (
              <button
                onClick={handleNext}
                className="mt-4 bg-blue-500 p-2 rounded w-full"
              >
                {currentQuestion === apiQuestions.length - 1
                  ? "Generate Results"
                  : "Next"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}