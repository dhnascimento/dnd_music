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
  const [userData, setUserData] = useState(null);
  const [mockMode, setMockMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(document.location.search);

    const handleCodeRequest = async () => {
      
      if (mockMode) {
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

    if (code) {
      handleCodeRequest();
    }

  }, [code, mockMode]);


  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload!
        </p>
      </header> */}
      <InfiniteCorridor
        hasStarted={hasStarted}
        setHasStarted={setHasStarted}
        currentStage={currentStage}
        stageData={stages[currentStage]}
        setCurrentStage={setCurrentStage}
      />
      {/* <Start code={code} userData={userData} /> */}
    </div>
  );
}

export default App;
