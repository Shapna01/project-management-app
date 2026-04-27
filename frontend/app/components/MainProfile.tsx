"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
type User = {
  id?: number;
  name?: string;
  role?: string;
  avatar?: string;
  bio?: string;
};
export default function MainProfile() {
 
  const [showAll, setShowAll] = useState(false);
const [user, setUser] = useState<User>({});
const [users, setUsers] = useState<User[]>([]);

useEffect(() => {
  fetch("http://localhost:5001/profile", {
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data: User) => setUser(data));
}, []);

useEffect(() => {
  fetch("http://localhost:5001/users")
    .then((res) => res.json())
    .then((data: User[]) => setUsers(data));
}, []);
  return (
    <div className="flex-1 bg-white rounded-2xl shadow-md p-6">

      <p className="text-sm text-gray-400">Inicio → Profile</p>
      <h1 className="text-2xl font-semibold text-black mt-2">
         UI Developer

      </h1>

      <div className="bg-gray-100 rounded-lg p-3 mt-3 text-sm text-gray-600">
        {user.bio}
      </div>

      <div className="mt-4">
        <Link href="/profile/edit">
          <button className="bg-blue-500 text-white px-4 py-1 rounded">
            Edit Profile
          </button>
        </Link>
      </div>

      <div className="mt-6">
        <div className="flex justify-between">
          <h3 className="font-semibold text-gray-400">Worked with</h3>

          <span
            onClick={() => setShowAll(!showAll)}
            className="text-pink-500 text-sm cursor-pointer"
          >
            {showAll ? "Show less" : "View all"}
          </span>
        </div>

        <div
  className={`grid grid-cols-4 gap-6 mt-4 ${
    showAll
      ? "max-h-[320px] overflow-y-auto pr-2"
      : "max-h-[160px] overflow-hidden"
  }`}
>
  {(showAll
    ? users.filter((u) => u.role === "user")
    : users.filter((u) => u.role === "user").slice(0, 8)
  ).map((u) => (
    <div key={u.id} className="flex flex-col items-center">
      
      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-400 hover:scale-105 transition">
        <img
          src={u.avatar || `https://i.pravatar.cc/150?img=${u.id}`}
          className="w-full h-full object-cover"
        />
      </div>

      <p className="text-xs mt-2 text-gray-700 text-center">
        {u.name}
      </p>

    </div>
  ))}
</div>
      </div>

    </div>
  );
}