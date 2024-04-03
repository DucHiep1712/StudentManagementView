import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/util/useLocalStorage";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [jwt, setJwt] = useLocalStorage("", "jwt");

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    setJwt(null);
    // navigate("/login");
    window.location.href = "/login";
  };

  return (
    <div className="w-full h-16 relative top-0 left-0 border-b flex items-center justify-between px-12 mb-12">
      <Button variant="ghost" onClick={handleGoBack}>
        <ArrowLeftIcon className="mr-2.5" />
        Go back
      </Button>
      <Button onClick={handleLogout}>Log out</Button>
    </div>
  );
}
