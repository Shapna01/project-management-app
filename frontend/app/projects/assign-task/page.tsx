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
    fetch("http://localhost:5001/tasks")
      .then((res) => res.json())
      .then((data: Task[]) => setTasks(data));
  }, []);

  const handleSubmit = async () => {
    if (!title || !assignTo) {
      alert("Title & Assign To required");
      return;
    }

    const res = await fetch("http://localhost:5001/tasks", {
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

        <div className="flex-1 ml-64 mt-16 p-6">
          
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
                  className="flex justify-between items-center border rounded-xl p-4 mb-3 hover:shadow-sm transition"
                >
                  
                  <div>
                    <h3 className="font-medium text-black">
                      {task.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {task.description}
                    </p>
                      
                    <p className="text-xs text-gray-500 mt-1">
  #{task.id} Opened {getTimeAgo(task.created_at)} by{" "}
  <span className="font-semibold text-black">
    {task.assign_to || "Unknown"}
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

                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700 border border-white shadow-sm">
                      {task.assign_to ? (
                        <img
                          src={`https://i.pravatar.cc/150?u=${task.assign_to}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        task.assign_to?.charAt(0).toUpperCase()
                      )}
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">

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
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
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