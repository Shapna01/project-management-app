"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
type User = {
  name?: string;
  avatar?: string;
  location?: string;
};

export default function Topbar() {
  const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  fetch("http://localhost:5001/profile", {
    credentials: "include",
  })
    .then(res => res.json())
   .then((data: User) => setUser(data));
}, []);
  return (
   <div className="fixed top-0 left-64 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      

      <div className="w-[40%] text-gray-300">
        <input
          type="text"
          placeholder="Search for anything..."
          className="w-full px-4 py-2 border rounded-md text-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="flex items-center gap-4">

        <div className="relative cursor-pointer">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-black">
              Anima Agrawal
            </p>
            <p className="text-xs text-gray-500">
              UP, India
            </p>
          </div>

          <Link href="/profile/edit">
  <img
    src={user?.avatar || "https://i.pravatar.cc/150?img=3"}
    className="w-9 h-9 rounded-full cursor-pointer object-cover"
  />
</Link>
        </div>
      </div>
    </div>
  );
}