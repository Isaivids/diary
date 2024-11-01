// import Link from "next/link";
import Login from "./components/Login";

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center items-center">
      <Login type={1}/>
    </div>
  );
}
