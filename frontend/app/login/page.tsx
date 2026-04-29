"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
const [password, setPassword] = useState<string>("");
const handleLogin = async (): Promise<void> => {
  try {
    const res = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    alert("Login success");
    router.push("/dashboard");

  } catch (error) {
    console.error("Login Error:", error);
    alert("Server error");
  }
};
  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center relative">
      
      <div className="absolute top-10 left-10 text-xl font-semibold text-[#1C4E80]">
        AProjectO
      </div>

      <div className="absolute top-10 right-[120px] text-sm text-black">
        ✶ Asite Product System
      </div>

      <div className="w-[90%] max-w-6xl flex justify-between items-center">

        <div className="w-1/2 flex justify-center">
          <Image
            src="/image.png"     
            alt="Login Illustration"
            width={450}
            height={450}
            className="object-contain"
          />
        </div>

        <div className="w-[430px]">

          <h2 className="text-xl text-black font-bold mb-1">
            Welcome back, Yash
          </h2>

          <p className="text-sm text-gray-600 mb-6">
            Welcome back! Please enter your details.
          </p>

          <label className="text-sm text-black font-medium">Email</label>
          <input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
  setEmail(e.target.value)
}
  className="w-full p-2 border-b border-gray-400 mb-5 outline-none"
/>

          <label className="text-sm text-black font-medium">Password</label>
          <div className="relative">
            <input
  type="password"
  placeholder="Enter password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full p-2 border-b border-gray-400 mb-2 outline-none"
/>
            <span className="absolute right-2 top-3 text-gray-600 cursor-pointer">
              👁
            </span>
          </div>

          <div className="flex justify-between items-center text-xs text-gray-600 mb-5">
            <label className="flex items-center gap-1 text-black">
              <input type="checkbox" /> Terms & Conditions
            </label>
            <a className="underline cursor-pointer">
              Forgot Password?
            </a>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-2 rounded-md mb-4"
          >
            Log in
          </button>

          <p className="text-center text-xs text-gray-600">
  Don’t have an account?{" "}
  <Link href="/signup" className="text-blue-600 underline">
    Sign up for free
  </Link>
</p>

        </div>
      </div>
    </div>
  );
}  