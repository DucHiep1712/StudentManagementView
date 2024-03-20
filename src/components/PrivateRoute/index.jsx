import { useToast } from "@/components/ui/use-toast";
import ajax from "@/services/fetchServices";
import { useLocalStorage } from "@/util/useLocalStorage";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import Navbar from "../Navbar";

export default function PrivateRoute({ children }) {
  const { toast } = useToast();
  const [jwt, setJwt] = useLocalStorage("", "jwt");
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  if (jwt) {
    ajax("get", `/api/auth/validate?token=${jwt}`, null, jwt).then(
      (response) => {
        console.log(response.data);
        setIsValid(response.data);
        setIsLoading(false);
        if (!response.data) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Session expired. Please log in!",
          });
        }
      }
    );
  } else {
    return <Navigate to="/login" />;
  }

  return isLoading ? (
    <div className="w-full h-[100vh] flex items-center justify-center">
      <div className="border-secondary h-20 w-20 animate-spin rounded-full border-8 border-t-foreground" />
    </div>
  ) : isValid ? (
    <>
      <Navbar />
      {children}
    </>
  ) : (
    <Navigate to="/login" />
  );
}
