import logo from './logo.svg';
import Start from './components/Start';
import stages from './helpers/stages';
import InfiniteCorridor from './components/InfiniteCorridor';
import './App.css';
import React, { useState, useEffect } from 'react';
import { mockResponse } from './helpers/mockResponse';

function App() {
  const [code, setCode] = useState(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [allParagraphsTyped, setAllParagraphsTyped] = useState(false);
  const [userData, setUserData] = useState(null);
  const [mockMode, setMockMode] = useState(false);
  const [typedParagraphs, setTypedParagraphs] = useState(new Array(stages[currentStage].paragraphs.length).fill(false)); // Flag if paragraph has been fully typed

  const handleTyping = () => {
    setIsTyping(!isTyping);
  };

  const handleStartJourney = () => {
    setHasStarted(!hasStarted);
    setIsTyping(!isTyping);
  }


  useEffect(() => {
    const params = new URLSearchParams(document.location.search);
    const handleCodeRequest = async () => {

      if (mockMode) {
        console.log('mockCode!');
        setUserData(mockResponse);
        return;
      }

      try {
        const req = await fetch("http://localhost:8000/code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ code: code }),
        });

        const data = await req.json();

        console.log(data);
        setUserData(data);


      } catch (error) {
        console.error(error);
      }


    };

    if (params) {
      setCode(params.get("code"));
    }

    if (code || mockMode) {
      handleCodeRequest();
    }

  }, [code, mockMode]);


  return (
    <div className="App">
      <InfiniteCorridor
        hasStarted={hasStarted}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentStage={currentStage}
        stageData={stages[currentStage]}
        setCurrentStage={setCurrentStage}
        setMockCode={setMockMode}
        handleTyping={handleTyping}
        handleStartJourney={handleStartJourney}
        isTyping={isTyping}
        setTypedParagraphs={setTypedParagraphs}
        typedParagraphs={typedParagraphs}
        setAllParagraphsTyped={setAllParagraphsTyped}
        allParagraphsTyped={allParagraphsTyped}
        userData={userData}
      />
    </div>
  );
}

export default App;
