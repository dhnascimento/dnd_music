import React from "react";
import { loginUrl } from "../helpers/authUrl";

export default function Start({ code, userData }) {

  const handleClick = async () => {
    try {
      const request = await fetch("http://localhost:8000/character", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...userData }),
      });
      const data = await request.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }

  }

  return (
    <React.Fragment>
        {code && <><p>We have a code!</p></>}
        {!code &&  <a href={loginUrl}>Start Authorization</a>}
        {userData && 
          <>
          <h3>User data received!</h3>
          <button onClick={handleClick}>Send Prompt</button>
          </>
        }

    </React.Fragment>
  );
}
