"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
type User = {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  location?: string;
  bio?: string;
  avatar?: string;
  skills?: string[];
};
export default function EditProfile() {
  const [user, setUser] = useState<User>({});

  useEffect(() => {
    fetch("http://localhost:5001/api/profile", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUser(data as User));
  }, []);

 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
    setUser((prev) => ({
  ...prev,
  [e.target.name]: e.target.value,
}));
  };

  const updateProfile = async () => {
    await fetch("http://localhost:5001/profile", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    alert("Updated!");
  };

  return (
    <div className="min-h-screen bg-[#F2F6FF]">
      <Topbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 ml-64 mt-16 p-6 flex gap-6">

          <div className="w-[260px] bg-white rounded-2xl shadow-md p-5 text-center">
            <div className="w-28 h-28 mx-auto rounded-full border-[4px] border-pink-500 overflow-hidden">
              <img
  src={user?.avatar || "https://i.pravatar.cc/150?img=5"}
  className="w-full h-full object-cover"
/>
            </div>

            <h2 className="mt-4 font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.location}</p>

            <div className="border-t my-4"></div>

            <div className="text-left text-gray-500 space-y-3 text-sm">
              <p>👤 {user.name} ({user.role})</p>
              <p>📞 {user.phone}</p>
              <p>📧 {user.email}</p>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-2xl shadow-md p-6 text-black">

            <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

            <div className="grid grid-cols-2 gap-4 font-bold text-gray-300">

              <input
                name="name"
                value={user.name || ""}
                onChange={handleChange}
                placeholder="First Name"
                className="border p-2 rounded"
              />

              <input
                name="role"
                value={user.role || ""}
                onChange={handleChange}
                placeholder="Role"
                className="border p-2 rounded"
              />

              <input
                name="email"
                value={user.email || ""}
                onChange={handleChange}
                className="border p-2 rounded col-span-2"
              />

              <input
                name="phone"
                value={user.phone || ""}
                onChange={handleChange}
                placeholder="Phone"
                className="border p-2 rounded"
              />

              <input
                name="location"
                value={user.location || ""}
                onChange={handleChange}
                placeholder="Location"
                className="border p-2 rounded"
              />

              <textarea
                name="bio"
                value={user.bio || ""}
                onChange={handleChange}
                placeholder="Bio"
                className="border p-2 rounded col-span-2"
              />

            </div>

            <button
              onClick={updateProfile}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded"
            >
              Save
            </button>

          </div>

          <div className="w-[300px]">
          </div>

        </div>
      </div>
    </div>
  );
}