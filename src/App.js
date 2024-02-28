import React, { useEffect, useState, useRef } from "react";
import { generate } from "random-words";

function App() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [textList, setTextList] = useState([]);
  const [typedList, setTypedList] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [status, setStatus] = useState("Start");
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [accuracy, setAccuracy] = useState(100);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    start();
  }, []);

  const start = () => {
    setTextList(generate(50));
    setTimer(60);
    setScore(0);
    setIsGameOver(false);
    setStartTime(Date.now());
    setStatus("Reset");
    setCurrWordIndex(0);
    setTypedText("");
    setTypedList([]);
    if(inputRef?.current){
      inputRef.current.focus(); 
      inputRef.current.value = "";
    }
  };

  const handleChange = (e) => {
    if (!isGameOver) {
      if (currWordIndex >= textList.length - 1) {
        endGame();
      }
      // Handle backspace
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

      // Get the expected character
      const expectedChar = textList[currWordIndex][typedText.length];
      // Check if the typed character matches the expected character
      if (e.key === " ") {
        setCurrWordIndex((prevIndex) => prevIndex + 1);
        setTypedList((prevList) => prevList.concat(typedText));
        setTypedText("");
        if (typedText.length === textList[currWordIndex].length) {
          setScore((prevScore) => prevScore + 1);
        } else {
          setAccuracy((prevAccuracy) => prevAccuracy - 1);
        }
        return;
      }
      if (e.key === expectedChar) {
        setTypedText((prevTypedText) => prevTypedText + e.key);
      } else {
        setTypedText((prevTypedText) => prevTypedText + e.key);
        setAccuracy((prevAccuracy) => prevAccuracy - 1);
      }
    }
  };

  const endGame = () => {
    setIsGameOver(true);
    setStatus("Play Again!");
    const endTime = Date.now();
    const elapsedTime = (endTime - startTime) / 1000;

    // Calculate Words Per Minute (WPM)
    const typedWords = typedText.trim().split(/\s+/).length;
    const currentWPM = (typedWords / elapsedTime) * 60;
    setWordsPerMinute(currentWPM.toFixed(2));
  };

  useEffect(() => {
    let interval;
    if (timer > 0 && !isGameOver) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && !isGameOver) {
      endGame();
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, isGameOver]);

  return (
    <div className="flex flex-col bg-[#323437] text-neutral-200 items-start justify-center h-screen px-20 ">
      <h1 className="mb-8 text-3xl font-bold">Speed Typing Game</h1>
      {!isGameOver ? (
        <>
         <p>Time: {timer}s</p>
          <div className="relative flex flex-wrap w-full mb-4 text-2xl leading-1 text-neutral-600">
            {textList.map((word, i) => (
              <div>
                <span
                  key={i}
                  className={`${currWordIndex > i && (word === typedList[i] ? "text-green-300" : 'border-b-2 border-solid border-red-500')} ${i === currWordIndex ? "text-neutral-300" : undefined}`}
                >
                  {word.split('').map((char, index) => (
                    <span
                      key={index}
                      className={index === typedText.length && i === currWordIndex ? "border-b-2 border-solid border-yellow-500" : undefined}
                      style={{ color: (i === currWordIndex && (index < typedText.length ? (char !== typedText[index] ? 'red' : 'green') : (index === typedText.length && i === currWordIndex ? 'yellow' : ''))) ? (index < typedText.length ? (char !== typedText[index] ? 'red' : 'green') : (index === typedText.length && i === currWordIndex ? 'yellow' : '')) : undefined }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span>
                  &nbsp;
                </span>
              </div>
            ))}
            <input
              className="absolute inset-0 bg-transparent opacity-0 "
              onKeyDown={handleChange}
              ref={inputRef}
              autoFocus
            />
          </div>
          <div className="flex justify-end w-full space-x-12">
          <p>Score: {score}</p>
          <p>Accuracy: {accuracy}%</p>
          <p>Words Per Minute (WPM): {wordsPerMinute}</p>
          </div>
        </>
      ) : (
        <>
          <p>Game over!</p>
          {score > 0 && 
          (
            <div>
              <p>Your final score: {score}</p>
              <p>Accuracy: {accuracy}%</p>
              <p>Words Per Minute (WPM): {wordsPerMinute}</p>
            </div>
          )}
        </>
      )}
      <button
        className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        onClick={start}
      >
        {status}
      </button>
    </div>
  );
}

export default App;
