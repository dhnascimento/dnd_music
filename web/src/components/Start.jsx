import React from "react";
import { loginUrl } from "../helpers/authUrl";

export default function Start() {
  const [code, setCode] = React.useState(null);
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
    const params = new URLSearchParams(document.location.search);

    const handleCodeRequest = async () => {
      const request = await fetch("http://localhost:8000/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code: code }),
      });
      console.log(request);
    };

    if (params) {
      setCode(params.get("code"));
    }

    if (code) {
      handleCodeRequest();
    }

    return () => {};
  }, [code]);

const handleUserData = async () => {
  try {
    const response = await fetch("http://localhost:8000/user");
    if (!response) {
      throw new Error('Error on request');
    }
    const json = await response.json();
    setUserData(json);
  } catch (e) {
    console.log(e);
  }

}

  return (
    <React.Fragment>
        {code && <><p>We have a code!</p><button onClick={handleUserData}>Click</button></>}
        {!code &&  <a href={loginUrl}>Start Authorization</a>}
        {userData && <h3>User data received!</h3>}
    </React.Fragment>
  );
}
