"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Clock } from "lucide-react";
type Task = {
  id: number;
  title: string;
  assigned_to?: string;
  status?: string;
  time_spent?: string;
};
export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]); 

  useEffect(() => {
  fetch("http://localhost:5001/api/tasks")
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks([]);
        console.log("Invalid response:", data);
      }
    })
    .catch((err) => {
      console.error(err);
      setTasks([]);
    });
}, []);

  return (
    <div className="min-h-screen bg-[#F2F6FF]">
      <Topbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1  ml-64 mt-16 p-6 flex justify-center">
            <div className="w-full  max-w-[1494px]">

          <h1 className="text-2xl  font-semibold text-black mb-6">
            Tasks
          </h1>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            {tasks.length === 0 ? (
  <p>No tasks available</p>
) : (
  tasks.map((task: Task) => (
    <div
      key={task.id}
      className={`flex items-stretch rounded-xl mb-3 transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]
        ${
          task.status === "completed"
            ? "border border-green-200 bg-green-50/30"
            : task.status === "cancelled"
            ? "border border-red-200 bg-red-50/30"
            : "border border-gray-200 bg-blue-50/10"
        }`}
    >
      <div
        className={`w-1.5 rounded-l-xl
          ${
            task.status === "completed"
              ? "bg-green-500"
              : task.status === "cancelled"
              ? "bg-red-500"
              : "bg-blue-200"
          }`}
      />

      <div className="flex justify-between items-center w-full p-4">
        <div>
          <h3 className="font-medium text-black">{task.title}</h3>

          <p className="text-xs text-gray-500 mt-1">
            #{task.id} Opened few days ago by{" "}
            <span className="font-semibold">
              {task.assigned_to || "Unknown"}
            </span>
          </p>

          <div className="mt-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                task.status === "completed"
                  ? "bg-green-100 text-green-600"
                  
                  : task.status === "cancelled"
                  ? "bg-red-100 text-red-500"
                  : "bg-blue-100 text-blue-400"
              }`}
            >
              {task.status || "Pending"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
            {task.time_spent || "00:30:00"}
          </div>
        </div>
      </div>
    </div>
  ))
)}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}