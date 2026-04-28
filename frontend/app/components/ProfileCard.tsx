"use client";
type User = {
  avatar?: string;
  name?: string;
  email?: string;
  location?: string;
  role?: string;
  phone?: string;
};
import { useEffect, useState } from "react";

export default function ProfileCard() {
  const [user, setUser] = useState<User>({});

  useEffect(() => {
    fetch("http://localhost:5001/profile", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);
 
  return (
    <div className="w-[260px] bg-white rounded-2xl shadow-md p-5 text-center">

      <div className="w-28 h-28 mx-auto rounded-full border-[4px] border-pink-500 overflow-hidden">
        <img
  src={user?.avatar || "https://i.pravatar.cc/150"}
  className="w-full h-full object-cover"
/>
      </div>

      <h2 className="mt-4 font-semibold">{user.name}</h2>
      <p className="text-sm text-gray-500">{user.location}</p>

      <div className="border-t my-4"></div>

      <div className="text-left space-y-3 text-gray-500 text-sm">
        <p>👤 {user.role}</p>
        <p>📞 {user.phone}</p>
        <p>📧 {user.email}</p>
      </div>
    </div>
  );
}