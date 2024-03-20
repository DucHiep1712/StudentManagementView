import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/util/useLocalStorage";

export default function Navbar() {
  const [jwt, setJwt] = useLocalStorage("", "jwt");

  const handleLogout = () => {
    setJwt(null);
    window.location.href = "/login";
  };

  return (
    <div className="w-full h-16 relative top-0 left-0 border-b flex items-center justify-end px-12 mb-12">
      <Button onClick={handleLogout}>Log out</Button>
    </div>
  );
}
