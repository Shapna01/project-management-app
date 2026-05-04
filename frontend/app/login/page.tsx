"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import keycloak from "../lib/keycloak";
export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      const authenticated = await keycloak.init({
        onLoad: "check-sso",
        pkceMethod: "S256",
        checkLoginIframe: false,
      });

      if (!authenticated) {
        await keycloak.login({
          redirectUri: "http://localhost:3000/dashboard",
        });
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Keycloak Login Error:", error);
      alert("Login Failed");
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
            Welcome back
          </h2>

          <p className="text-sm text-gray-600 mb-6">
            Login using Keycloak Authentication
          </p>

          <label className="text-sm text-black font-medium">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border-b border-gray-400 mb-5 outline-none"
          />

          <label className="text-sm text-black font-medium">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border-b border-gray-400 mb-5 outline-none"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-2 rounded-md mb-4"
          >
            Login with Keycloak
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