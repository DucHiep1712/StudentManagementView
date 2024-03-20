import { useLocalStorage } from "@/util/useLocalStorage";

export default function Dashboard() {
  const [jwt, setJwt] = useLocalStorage("", "jwt");

  return <div>Hello: {jwt}</div>;
}
