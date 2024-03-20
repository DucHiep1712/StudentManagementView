import { useLocalStorage } from "@/util/useLocalStorage";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const [jwt, setJwt] = useLocalStorage("", "jwt");

  return jwt ? children : <Navigate to="/login" />;
}
