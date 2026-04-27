"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
type FormData = {
  name: string;
  email: string;
  password: string;
  role: string;
};
export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
  name: "",
  email: "",
  password: "",
  role: "user",
});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};
  const register = async () => {
    const res = await fetch("http://localhost:5001/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registered successfully");
      router.push("/login");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F6FF]">

      <div className="bg-white p-8 rounded-2xl shadow-md w-[350px]">

        <h2 className="text-2xl font-semibold text-center mb-6">
          Create Account
        </h2>

        <div className="space-y-4">

          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <select
            name="role"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
            <option value="developer">Developer</option>
          </select>
          
          <button
            onClick={register}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Register
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">
  Already have an account?{" "}
  <Link href="/login" className="text-blue-600 underline">
    Login
  </Link>
</p>

        </div>
      </div>

    </div>
  );
}