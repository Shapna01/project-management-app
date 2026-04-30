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

        <div className="flex-1 ml-64 mt-16 p-6 flex justify-center">
            <div className="w-full max-w-[1494px]">

          <h1 className="text-2xl font-semibold text-black mb-6">
            Tasks
          </h1>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            {tasks.length === 0 ? (
              <p>No tasks available</p>
            ) : (
              tasks.map((task: Task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center border rounded-xl p-4 mb-3 hover:shadow-sm transition"
                >
                  <div>
                    <h3 className="font-medium text-black">
                      {task.title}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      #{task.id} Opened few days ago by{" "}
                      <span className="font-semibold">
                        {task.assigned_to || "Unknown"}
                      </span>
                    </p>

                    <div className="flex gap-2 mt-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          task.status === "cancelled"
                            ? "bg-red-100 text-red-500"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        Cancelled
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        Completed
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    
                    <div className="flex items-center gap-1 text-green-600 text-xs bg-green-50 px-2 py-[4px] rounded-full">
                      <Clock size={12} />
                      <span>{task.time_spent || "00:30:00"}</span>
                    </div>

                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 border border-white shadow-sm">
                      <img
                        src={`https://i.pravatar.cc/150?u=${task.assigned_to}`}
                        className="w-full h-full object-cover"
                      />
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