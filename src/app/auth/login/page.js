"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg,setMsg]=useState("")
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data.user)
      router.push("/");
    } else {
      setMsg(data.message)

    }
  };

  return (
    <div className="fixed p-10 bg-gray-100 w-full h-screen flex items-center justify-center ">
    <span className="text-red-400 absolute top-50 left-1/2 transform -translate-y-1/2 -translate-x-1/2   text-xl">
      {msg}
    </span>
    <form onSubmit={handleSubmit} className="p-8 md:max-w-md w-full mx-auto bg-white rounded-xl hover:shadow-xl text-gray-500 shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        type="email"
        required
        placeholder="Email"
        className="border border-gray-300 outline-none rounded-xl p-2 w-full mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        required
        placeholder="Password"
        className="border border-gray-300 outline-none rounded-xl p-2 w-full mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded active:scale-95 active:bg-blue-700 w-full"
      >
        Login
      </button>
      
    </form>


    </div>
  );
}
