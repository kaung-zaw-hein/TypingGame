import { useEffect, useState } from "react";

function App() {

  const [isGameOver, setIsGameOVer ] = useState(false);
  const [text, setText]  = useState("");
  const [input, setInput]  = useState("");
  const [ score, setScore ] = useState(0);
  const [ timer, setTimer ] = useState(0);
  const [ startTime, setStartTime ] = useState(0);
  
  let randomTexts = [
    "Technology has revolutionized the way we live, work, and interact with one another. From the invention of the internet to the development of smartphones, technological advancements have transformed every aspect of modern life. Today, we rely on technology for communication, transportation, healthcare, entertainment, and much more. As technology continues to evolve at a rapid pace, it presents both opportunities and challenges for society.",
    "Climate change is one of the most pressing issues facing our planet today. The burning of fossil fuels, deforestation, and industrial activities have led to a rise in greenhouse gas emissions, resulting in global warming and unpredictable weather patterns. The consequences of climate change are far-reaching, affecting ecosystems, biodiversity, and human populations worldwide. Urgent action is needed to mitigate the impacts of climate change and transition to a sustainable future."
  ]

  const start = () => {
    let radomItem = randomTexts[Math.floor((Math.random() * randomTexts.length -1))];
    setText(radomItem);
    setTimer(6); 
    setScore(0); 
    setIsGameOVer(false); 
    setStartTime(Date.now());
  }
  
  const handleChange = (e) => {
    setInput(e.target.value);
  }

  const endGame = () => {
    setIsGameOVer(true);

    const endTime = Date.now();
    const elapsedTime = (endTime - startTime) / 1000;
    console.log(elapsedTime);
  }

  useEffect(() => {
    window.addEventListener("keydown",(event)=>{
      console.log(event);
  })
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
    <div className="flex flex-col bg-[#323437] text-neutral-300 items-center justify-center h-screen px-10">
      <h1 className="mb-8 text-3xl font-bold">Speed Typing Game</h1>
      {!isGameOver ? (
        <>
          <p className="mb-4 text-2xl leading-10 text-neutral-500 opacity-55">{text}</p>
          <textarea
            className="w-64 h-24 p-2 mb-4 border border-gray-300 rounded-md"
            placeholder="Type here..."
            value={input}
            onChange={handleChange}
            autoFocus
          ></textarea>
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
        {isGameOver ? 'Play Again' : 'Start Game'}
      </button>
    </div>
  );
}

export default App;
