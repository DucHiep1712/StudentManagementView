import axios from "axios";
import { useEffect, useState } from "react";

import { useLocalStorage } from "./util/useLocalStorage";

function App() {
  const [jwt, setJwt] = useLocalStorage("", "jwt");

  useEffect(() => {
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
        console.log(response);
      });
  }, []);

  useEffect(() => {
    console.log(`JWT: ${jwt}`);
  }, [jwt]);

  return <div>What is this {jwt}</div>;
}

export default App;
