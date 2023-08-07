import React from "react";
import { loginUrl } from "../helpers/authUrl";

export default function Start() {
  const [code, setCode] = React.useState(null);

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

  return (
    <React.Fragment>
        {code && <p>We have a code!</p>}
      <a href={loginUrl}>Start Authorization</a>
    </React.Fragment>
  );
}
