import { useEffect, useState } from "react";
import { generate } from "random-words";

function App() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [textList, setTextList] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [status, setStatus] = useState("Start");
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [accuracy, setAccuracy] = useState(100);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);

  const start = () => {
    setTextList(generate(100));
    setTimer(60);
    setScore(0);
    setIsGameOver(false);
    setStartTime(Date.now());
    setStatus("Reset");
    setCurrWordIndex(0);
    setTypedText("");
  };

  const handleChange = (e) => {
    if (!isGameOver) {
      // Handle backspace
      if (e.key === "Backspace") {
        if (typedText.length > 0) {
          setTypedText((prevTypedText) => prevTypedText.slice(0, -1));
        }
        return;
      }
  
      // Handle whitespace
      if (e.key === " ") {
        setTypedText((prevTypedText) => prevTypedText + " ");
        return;
      }
  
      // Get the expected character
      const expectedChar = textList[currWordIndex][typedText.length];
  
      // Check if the typed character matches the expected character
      if (e.key === expectedChar) {
        setTypedText((prevTypedText) => prevTypedText + e.key);
        if (e.key === " " || typedText.length === textList[currWordIndex].length - 1) {
          setCurrWordIndex((prevIndex) => prevIndex + 1);
          setTypedText("");
          setScore((prevScore) => prevScore + 1);
        }
      } else {
        // If mistyped, update accuracy and set typed text with red color
        setAccuracy((prevAccuracy) => prevAccuracy - 1);
        setTypedText((prevTypedText) => prevTypedText + e.key);
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
    setTextList(generate(100));
  }, []);

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
  }, [timer]);

  return (
    <div className="flex flex-col bg-[#323437] text-neutral-300 items-center justify-center h-screen px-20 ">
      <h1 className="mb-8 text-3xl font-bold">Speed Typing Game</h1>
      {!isGameOver ? (
        <>
          <div className="relative flex flex-wrap w-full mb-4 text-2xl leading-1">
            {textList.map((word, i) => (
              <span
                key={i}
                className={i === currWordIndex ? "text-yellow-500" : undefined}
              >
                {word}&nbsp;
              </span>
            ))}
            <input
              className="absolute inset-0 bg-transparent opacity-0 "
              onKeyDown={handleChange}
              autoFocus
            />
          </div>
          <p>Time: {timer}s</p>
          <p>Score: {score}</p>
          <p>Accuracy: {accuracy}%</p>
          <p>Words Per Minute (WPM): {wordsPerMinute}</p>
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
