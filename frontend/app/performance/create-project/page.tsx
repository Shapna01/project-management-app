"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PerformancePage() {
  const [title, setTitle] = useState<string>("");
const [type, setType] = useState<string>("");
const [startDate, setStartDate] = useState<string>("");
const [endDate, setEndDate] = useState<string>("");
const [description, setDescription] = useState<string>("");
const router = useRouter();
  const handleCreate = async (): Promise<void> => {
  try {
    const res = await fetch("http://localhost:5001/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        type,
        startDate,
        endDate,
      }),
    });

    const data: any = await res.json();

if (!res.ok) {
  alert(data.error);
  return;
}

console.log("CREATED:", data);

    console.log("CREATED:", data);

    setTitle("");
    setType("");
    setStartDate("");
    setEndDate("");
    setDescription("");

    router.push("/dashboard");
router.refresh();

 } catch (err: unknown) {
    console.error("CREATE ERROR:", err);
  }
};

  return (
   

        <div className="flex-1 mt-20 px-6 flex justify-center ">
          
           <div className="w-full max-w-[1494px]">
          <p className="text-gray-400 text-sm mb-4">
            Projects / Create Project
          </p>

          <div className="bg-white rounded-xl shadow-md p-6 max-full">

             <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-black">
                <label className="text-sm text-gray-600">Project Title</label>
                <input
                  className="input mt-1"
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
  setTitle(e.target.value)
}
                />
              </div>

              <div className="text-black">
                <label className="text-sm text-gray-600">Project Type</label>
                <input
                  className="input mt-1"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                />
              </div>

              <div className="text-black">
                <label className="text-sm text-gray-600">Start Date</label>
                <input
                  type="date"
                  className="input mt-1"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="text-black">
                <label className="text-sm text-gray-600">End Date</label>
                <input
                  type="date"
                  className="input mt-1"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4 text-black">
              <label className="text-sm text-gray-600">
                Project Description
              </label>
              <textarea
                className="input mt-1 w-full h-24"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
  setDescription(e.target.value)
}
              />
            </div>

            <div className="mb-6">
              <label className="text-sm text-gray-600">
                Project Roles
              </label>

              <div className="border rounded-md mt-2 p-3 max-w-sm">
                <select className="w-full mb-2 outline-none text-black text-sm">
                  <option>Team Lead</option>
                  <option>Admin</option>
                  <option>User</option>
                  <option>Viewer</option>
                </select>

                {["Yash", "Shapna", "Sai", "Kavi"].map((name, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-black text-sm py-1"
                  >
                    <span>{name}</span>
                    <input type="checkbox" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-5 py-2 rounded-md"
              >
                Create
              </button>

              <button className="bg-gray-200 text-gray-700 px-5 py-2 rounded-md">
                Delete
              </button>
            </div>

          </div>
          </div>
        </div>
    
  );
}