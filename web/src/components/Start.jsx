import React from "react";
import { loginUrl } from "../helpers/authUrl";

export default function Start() {
  const [code, setCode] = React.useState(null);
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
    const params = new URLSearchParams(document.location.search);

    const handleCodeRequest = async () => {
      
      try {
        const req = await fetch("http://localhost:8000/code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ code: code }),
        });
  
        const data = await req.json();
        console.log(data)
  
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

    return () => {};
  }, [code]);


  return (
    <React.Fragment>
        {code && <><p>We have a code!</p></>}
        {!code &&  <a href={loginUrl}>Start Authorization</a>}
        {userData && <h3>User data received!</h3>}
    </React.Fragment>
  );
}
