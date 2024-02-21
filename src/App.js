import { useEffect, useState } from "react";
import { generate } from "random-words";

function App() {

  const [isGameOver, setIsGameOVer ] = useState(false);
  const [textList, setTextList] = useState([]);
  const [input, setInput]  = useState("");
  const [currWordIndex, setCurrWordIndex] = useState(0)
  const [currCharIndex, setCurrCharIndex] = useState(-1)
  const [currChar, setCurrChar] = useState("")
  const [correct, setCorrect] = useState(0)
  const [ score, setScore ] = useState(0);
  const [ timer, setTimer ] = useState(0);
  const [ startTime, setStartTime ] = useState(0);
  const [ status, setStatus ] = useState("Start");

  
  const start = () => {
    setTextList("");
    setTextList(generate(100));
    setTimer(600); 
    setScore(0); 
    setIsGameOVer(false); 
    setStartTime(Date.now());
    setStatus("Reset")
  }
  
  const handleChange = (e) => {
    setInput(e.target.value);
  }

  const endGame = () => {
    setIsGameOVer(true);
    setStatus("Play Again!")

    const endTime = Date.now();
    const elapsedTime = (endTime - startTime) / 1000;
    
  }

  useEffect(() => {
    setTextList(generate(100));
  }, []);

  useEffect(() => {
  //   window.addEventListener("keydown",(event)=>{
  //     console.log(event);
  // })
    let interval;
    if(timer > 0 && !isGameOver){
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }else if(timer === 0 & !isGameOver){
      endGame();
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, isGameOver]);

 

  return (
    <div className="flex flex-col bg-[#323437] text-neutral-300 items-center justify-center h-screen px-20 ">
      <h1 className="mb-8 text-3xl font-bold">Speed Typing Game</h1>
      {!isGameOver ? (
        <>
          <div className="relative flex flex-wrap w-full mb-4 text-2xl leading-1">{
            textList.map((word, i) => (
              <div className=" opacity-20 text-neutral-200"  key={i}>
                {word.split("").map((char, i) => (
                  <span key={i} >{char}</span>
                ))}
                {i !== textList.length - 1 && <span>&nbsp;</span>} 
              </div>
            ))
          }
          {/* <div className="absolute inset-0 z-20 flex flex-wrap ">
          {
            textList.map((word, i) => (
              <div className={false? " " :" "} key={i}>
                {word.split("").map((char, i) => (
                  <span key={i} className={false ? "text-white " : " text-red-700 "}>{char}</span>
                ))}
                {i !== textList.length - 1 && <span>&nbsp;</span>} 
              </div>
            ))
          }
          </div>  */}
          <input
            className="absolute inset-0 bg-transparent opacity-0 "
            value={input}
            onKeyDown={(e) => { console.log(e)}}
            onChange={handleChange}
            autoFocus
          />
          </div>
          <p>Time:{timer}s</p>
          <p>Score: {score}</p>
        </>
      ) : (
        <>
          <p>Game over!</p>
          <p>Your final score: {score}</p>
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
