import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import ajax from "@/services/fetchServices";
import { useLocalStorage } from "@/util/useLocalStorage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PasswordInput } from "../ui/password-input";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [jwt, setJwt] = useLocalStorage("", "jwt");

  const checkFormFocus = (event) => {
    if (event.key === "Enter") {
      sendLoginRequest();
    }
  };

  const sendLoginRequest = () => {
    const authData = {
      username: username,
      password: password,
    };

    ajax("post", "/api/auth/login", authData, null)
      .then((response) => {
        return response.headers;
      })
      .then((headers) => {
        console.log(headers.get("Authorization"));
        setJwt(headers.get("Authorization"));
        window.location.href = "/dashboard";
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Invalid credentials",
        });
      });
  };

  return (
    <div className="w-full h-[100vh] flex items-center justify-center bg-[url('/login_background.jpg')] bg-cover bg-no-repeat bg-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                onKeyDown={checkFormFocus}
                id="username"
                placeholder="Username"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                onKeyDown={checkFormFocus}
                id="password"
                placeholder="Password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="password"
              />
            </div>
            <Button
              className="w-full"
              type="submit"
              onClick={() => sendLoginRequest()}
            >
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
