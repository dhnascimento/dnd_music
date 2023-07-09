import React from "react"
import { loginUrl } from "../helpers/authUrl"

export default function Start() {
    return(
        <React.Fragment>
            <a href={loginUrl}>Start Authorization</a>
        </React.Fragment>
    )
}