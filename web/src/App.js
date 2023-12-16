import logo from './logo.svg';
import Start from './components/Start';
import './App.css';
import React from 'react';
import { mockResponse } from './helpers/mockResponse';

function App() {
  const [code, setCode] = React.useState(null);
  const [userData, setUserData] = React.useState(null);
  const [mockMode, setMockMode] = React.useState(false);

  React.useEffect(() => {
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
      return;
      handleCodeRequest();
    }

    return () => {};
  }, [code]);


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Start code={code} userData={userData} />
      </header>
    </div>
  );
}

export default App;
