import axios from "axios";
import { useEffect, useState } from "react";

import { useLocalStorage } from "./util/useLocalStorage";

function App() {
  const [jwt, setJwt] = useLocalStorage("", "jwt");

  useEffect(async () => {
    // const response = await fetch("http://localhost:8080/api/auth/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ username: "duchiep", password: "Motconvit1?" }),
    // });

    // if (response.ok) {
    //   // Retrieve the token from the Authorization header
    //   const token = response.headers.get("Authorization");

    //   // Optionally, store the token in localStorage or sessionStorage for later use
    //   // localStorage.setItem("token", token);

    //   console.log("Token:", token);

    //   // Proceed with user login success actions
    // } else {
    //   // Handle HTTP errors
    //   console.error("Login failed:", response.statusText);
    // }

    axios
      .post(
        "/api/auth/login",
        {
          username: "duchiep",
          password: "Motconvit1?",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.headers.get("Authorization"));
      });
  }, []);

  useEffect(() => {
    console.log(`JWT: ${jwt}`);
  }, [jwt]);

  return <div>What is this {jwt}</div>;
}

export default App;
