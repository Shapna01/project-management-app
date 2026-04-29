"use client";

import { useState } from "react";

export default function CreateTaskPage() {
  const [form, setForm] = useState<{
  title: string;
  type: string;
  description: string;
  startDate: string;
  endDate: string;
  assignTo: string;
  priority: string;
  status: string;
}>({
  title: "",
  type: "",
  description: "",
  startDate: "",
  endDate: "",
  assignTo: "Yash",
  priority: "High",
  status: "Pending",
});
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (): Promise<void> => {
  try {
    const res = await fetch("http://localhost:5001/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("NOT JSON RESPONSE:", text);
      setMessage("❌ Server Error");
      return;
    }

    if (!res.ok) {
      setMessage(data.error || "Failed to create task");
      return;
    }

    console.log("TASK CREATED:", data);

    setMessage("✅ Task Created Successfully");

    setForm({
      title: "",
      type: "",
      description: "",
      startDate: "",
      endDate: "",
      assignTo: "Yash",
      priority: "High",
      status: "Pending",
    });

    setTimeout(() => setMessage(""), 3000);

  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    setMessage("❌ Server Error");
  }
};

  return (
    <div className="flex-1 mt-16 p-6">
      <p className="text-gray-400 text-sm mb-4 ">
        Tasks / Create Task
      </p>

      <div className="bg-white rounded-xl shadow-md p-6 max-full">
      {message && (
  <div className="mb-4 text-sm text-green-600">
    {message}
  </div>
)}
        <div className="grid grid-cols-4 gap-4 mb-4 text-black">
          <div>
            <label className="text-sm text-gray-600">Task Title</label>
            <input
              name="title"
              className="input mt-1"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Task Type</label>
            <input
              name="type"
              className="input mt-1"
              value={form.type}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Start Date</label>
            <input
              type="date"
              name="startDate"
              className="input mt-1"
              value={form.startDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">End Date</label>
            <input
              type="date"
              name="endDate"
              className="input mt-1"
              value={form.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-4 text-black">
          <label className="text-sm text-gray-600">Task Description</label>
          <textarea
            name="description"
            className="input mt-1 w-full h-24"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center gap-6 mb-6 text-black">

          <div>
            <label className="text-sm text-gray-600">Assign To</label>
            <select
              name="assignTo"
              className="input mt-1"
              value={form.assignTo}
              onChange={handleChange}
            >
              <option>Yash</option>
              <option>Shapna</option>
              <option>Sai</option>
              <option>Kavi</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Priority</label>
            <select
              name="priority"
              className="input mt-1"
              value={form.priority}
              onChange={handleChange}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Status</label>
            <select
              name="status"
              className="input mt-1"
              value={form.status}
              onChange={handleChange}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

        </div>

        
        <div className="flex justify-end gap-4">
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-5 py-2 rounded-md"
          >
            Create
          </button>

          <button
            onClick={() =>
              setForm({
                title: "",
                type: "",
                description: "",
                startDate: "",
                endDate: "",
                assignTo: "Yash",
                priority: "High",
                status: "Pending",
              })
            }
            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-md"
          >
            Clear
          </button>
        </div>

      </div>
    </div>
  );
}