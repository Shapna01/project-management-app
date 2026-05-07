"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { Clock } from "lucide-react";
type Task = {
  id: number;
  title: string;
  description?: string;
  assign_to?: string;
  status?: string;
  created_at?: string;
  time_spent?: string;
};
export default function AssignTaskPage() {
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignTo, setAssignTo] = useState("");

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/tasks")
      .then((res) => res.json())
      .then((data: Task[]) => setTasks(data));
  }, []);

  const handleSubmit = async () => {
    if (!title || !assignTo) {
      alert("Title & Assign To required");
      return;
    }

    const res = await fetch("http://localhost:5001/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        assign_to: assignTo,
        status: "pending",
      }),
    });

    const newTask: Task = await res.json();

    setTasks([newTask, ...tasks]);

    setTitle("");
    setDescription("");
    setAssignTo("");
    setShowModal(false);
  };


 const getTimeAgo = (date?: string) => {
  if (!date) return "some time ago";

  const now = new Date();
  const past = new Date(date);

  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  const days = Math.floor(diff / 86400);
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;

  const hours = Math.floor(diff / 3600);
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const mins = Math.floor(diff / 60);
  if (mins > 0) return `${mins} min ago`;

  return "Just now";
};

  return (
    <div className="min-h-screen bg-[#F2F6FF]">
      <Topbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 mt-16 p-6">
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-black">
              Assign Task
            </h1>

            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              + Assign Task
            </button>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            {tasks.length === 0 ? (
              <p>No tasks</p>
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
          : "border border-yellow-200 bg-yellow-50/30"
      }`}
  >
    <div
      className={`w-1.5 rounded-l-xl
        ${
          task.status === "completed"
            ? "bg-green-500"
            : task.status === "cancelled"
            ? "bg-red-500"
            : "bg-yellow-500"
        }`}
    />

    <div className="flex justify-between items-center w-full p-4">

      <div>
        <h3 className="font-semibold text-black">{task.title}</h3>

        <p className="text-sm text-gray-500">
          {task.description}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          #{task.id} • {getTimeAgo(task.created_at)} •{" "}
          <span className="font-medium text-black">
            {task.assign_to || "Unknown"}
          </span>
        </p>

        <div className="mt-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              task.status === "completed"
                ? "bg-green-100 text-green-600"
                : task.status === "cancelled"
                ? "bg-red-100 text-red-500"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {task.status || "Pending"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-green-600 text-xs bg-green-50 px-2 py-1 rounded-full">
          <Clock size={12} />
          <span>{task.time_spent || "00:30:00"}</span>
        </div>

        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 border border-white shadow-sm">
          <img
            src={`https://i.pravatar.cc/150?u=${task.assign_to}`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

    </div>
  </div>
))
            )}
          </div>

        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#0F172A]/20 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[420px] shadow-xl border border-gray-100">

            <h2 className="text-lg font-semibold text-black mb-4">
              Assign Task
            </h2>

            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-3 rounded-lg mb-3 text-black"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-3 rounded-lg mb-3 text-black"
            />

            <input
              type="text"
              placeholder="Assign To"
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              className="w-full border p-3 rounded-lg mb-4 text-black"
            />

            <div className="flex justify-end gap-2">
              <button
  onClick={() => setShowModal(false)}
  className="px-4 py-2 text-gray-600 hover:text-black transition"
>
  Cancel
</button>

<button
  onClick={handleSubmit}
  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 hover:shadow-md transition"
>
  Save
</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}