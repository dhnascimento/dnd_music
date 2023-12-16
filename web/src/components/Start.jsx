import React from "react";
import { loginUrl } from "../helpers/authUrl";

export default function Start({ code, userData }) {



  return (
    <React.Fragment>
        {code && <><p>We have a code!</p></>}
        {!code &&  <a href={loginUrl}>Start Authorization</a>}
        {userData && <h3>User data received!</h3>}
    </React.Fragment>
  );
}
