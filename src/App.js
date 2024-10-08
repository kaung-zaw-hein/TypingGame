import React, { useEffect, useState, useRef, useCallback } from "react";
import { generate } from "random-words";

function App() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [textList, setTextList] = useState([]);
  const [typedList, setTypedList] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [startTime, setStartTime] = useState(0);
  const [status, setStatus] = useState("Start");
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [accuracy, setAccuracy] = useState(100);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [difficulty, setDifficulty] = useState("Medium");
  const inputRef = useRef(null);

  const start = () => {
    setTextList(generate(difficulty === "Easy" ? 40 : difficulty === "Hard" ? 80 : 60));
    setTimer(difficulty === "Easy" ? 90 : difficulty === "Hard" ? 45 : 60);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setStartTime(Date.now());
    setStatus("Reset");
    setCurrWordIndex(0);
    setTypedText("");
    setTypedList([]);
    setAccuracy(100);
    setWordsPerMinute(0);

    if (inputRef?.current) {
      inputRef.current.focus();
      inputRef.current.value = "";
    }

    // Start the timer once the game starts
    let interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    // Stop the timer when the game ends or is paused
    return () => clearInterval(interval);
  };

  const pauseGame = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      setStatus("Resume");
    } else {
      setStatus("Reset");
    }
  };

  const handleChange = (e) => {
    if (!isGameOver && !isPaused) {
      if (currWordIndex >= textList.length - 1) {
        endGame();
      }
      if (e.key === "Backspace") {
        if (typedText.length > 0) {
          setTypedText((prevTypedText) => prevTypedText.slice(0, -1));
        } else if (typedList.length > 0) {
          setCurrWordIndex((prevIndex) => prevIndex - 1);
          setTypedText(typedList[typedList.length - 1]);
          setTypedList((prevList) => prevList.slice(0, -1));
        }
        return;
      }

      const expectedChar = textList[currWordIndex][typedText.length];
      if (e.key === " " || typedText.length >= textList[currWordIndex].length) {
        setCurrWordIndex((prevIndex) => prevIndex + 1);
        setTypedList((prevList) => prevList.concat(typedText));
        setTypedText("");
        if (typedText === textList[currWordIndex]) {
          setScore((prevScore) => prevScore + 1);
        } else {
          setAccuracy((prevAccuracy) => prevAccuracy - 1);
        }
        return;
      }
      setTypedText((prevTypedText) => prevTypedText + e.key);
      if (e.key !== expectedChar) {
        setAccuracy((prevAccuracy) => prevAccuracy - 1);
      }
    }
  };

  const endGame = useCallback(() => {
    setIsGameOver(true);
    setStatus("Play Again!");
    const endTime = Date.now();
    const elapsedTime = (endTime - startTime) / 1000;

    const typedWords = typedText.trim().split(/\s+/).length;
    const currentWPM = (typedWords / elapsedTime) * 60;
    setWordsPerMinute(currentWPM.toFixed(2));

    const correctCharacters = typedList.join("").length;
    const totalCharacters = textList.join("").length;
    const currentAccuracy = (correctCharacters / totalCharacters) * 100;
    setAccuracy(currentAccuracy.toFixed(2));

    setLeaderboard((prevLeaderboard) => [...prevLeaderboard, { score, accuracy, wordsPerMinute }]);
  }, [startTime, typedText, textList, typedList, score, accuracy]);

  useEffect(() => {
    if (timer === 0 && !isGameOver) {
      endGame();
    }
  }, [timer, isGameOver, endGame]);

  return (
    <div className="flex flex-col bg-[#1F2937] text-white items-center justify-center h-screen px-4 sm:px-20 transition-all ease-in-out">
      <h1 className="mb-8 text-4xl font-bold text-[#60A5FA] drop-shadow-lg">Speed Typing Game</h1>
      <div className="mb-4">
        <label className="mr-4">Select Difficulty:</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="px-4 py-2 rounded-lg text-black bg-slate-400"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {!isGameOver ? (
        <>
          <div className="mb-6 text-xl font-semibold">Time Left: {timer}s</div>
          <div className="relative flex flex-wrap w-full mb-6 text-2xl leading-1.5 text-neutral-400 bg-[#2D3748] p-6 rounded-lg shadow-lg transition-transform ease-in-out transform-gpu hover:scale-105 sm:w-3/4 lg:w-2/3 xl:w-1/2">
            {textList.map((word, i) => (
              <div key={i}>
                <span
                  className={`${
                    currWordIndex > i &&
                    (word === typedList[i] ? "text-green-500" : "border-b-2 border-red-600")
                  } ${i === currWordIndex ? "text-white" : undefined}`}
                >
                  {word.split("").map((char, index) => (
                    <span
                      key={index}
                      className={
                        index === typedText.length && i === currWordIndex
                          ? "border-b-2 border-yellow-300"
                          : undefined
                      }
                      style={{
                        color:
                          i === currWordIndex &&
                          (index < typedText.length
                            ? char !== typedText[index]
                              ? "red"
                              : "green"
                            : index === typedText.length && i === currWordIndex
                            ? "yellow"
                            : ""),
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span>&nbsp;</span>
              </div>
            ))}
            <input
              className="absolute inset-0 bg-transparent opacity-0"
              onKeyDown={handleChange}
              ref={inputRef}
              autoFocus
            />
          </div>
          <div className="flex justify-between w-full sm:w-3/4 lg:w-2/3 xl:w-1/2 text-lg">
            <p className="font-medium">Score: {score}</p>
            <p className="font-medium">Accuracy: {accuracy}%</p>
          </div>
        </>
      ) : (
        <>
          <p className="text-2xl font-semibold">Game over!</p>
          {score > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-lg">Your final score: {score}</p>
              <p className="text-lg">Accuracy: {accuracy}%</p>
              <p className="text-lg">Words Per Minute (WPM): {wordsPerMinute}</p>
            </div>
          )}
        </>
      )}
      <button
        className="px-6 py-3 mt-8 text-lg font-semibold bg-blue-600 rounded-lg shadow-md hover:bg-blue-800 hover:shadow-xl transition-all duration-300 ease-in-out"
        onClick={start}
      >
        {status}
      </button>
      {!isGameOver && (
        <button
          className="px-4 py-2 mt-4 ml-4 font-semibold bg-yellow-600 rounded-lg hover:bg-yellow-800"
          onClick={pauseGame}
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
      )}
    </div>
  );
}

export default App;
