"use client";

import { useState } from "react";
type SubTaskForm = {
  title: string;
  status: string;
  startDate: string;
  endDate: string;
  description: string;
  reporter: string[];
  assignee: string[];
};
export default function CreateSubTaskPage() {
  const [form, setForm] = useState<SubTaskForm>({
    title: "",
    status: "Type - I",
    startDate: "",
    endDate: "",
    description: "",
    reporter: [],
    assignee: [],
  });

  const users = ["Yash", "Shapna", "Sai", "Kavi"];

 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (field: "reporter" | "assignee", name: string) => {
    setForm((prev: SubTaskForm) => {
      const exists = prev[field].includes(name);
      return {
        ...prev,
        [field]: exists
          ? prev[field].filter((n) => n !== name)
          : [...prev[field], name],
      };
    });
  };

  const handleCreate = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/subtasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed");
        return;
      }

      setForm({
        title: "",
        status: "Type - I",
        startDate: "",
        endDate: "",
        description: "",
        reporter: [],
        assignee: [],
      });

      window.location.href = "/performance";

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='flex-1 mt-16 p-6'>
      <p className="text-gray-400 text-sm mb-4 ">
        SubTask / Create SubTask
      </p>

      <div className="bg-white rounded-xl shadow-md p-6 max-full">

        <div className="grid grid-cols-4 gap-4 mb-4 text-black">
          <div>
            <label className="text-sm text-gray-600">SubTask Title</label>
            <input
              name="title"
              className="input mt-1"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">SubTask Status</label>
            <input
              name="status"
              className="input mt-1"
              value={form.status}
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
          <label className="text-sm text-gray-600">SubTask Description</label>
          <textarea
            name="description"
            className="input mt-1 w-full h-24"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6 text-black">
          <div>
            <label className="text-sm text-gray-600">Reporter</label>
            <div className="border rounded-md mt-2 p-3">
              <select className="w-full mb-2 outline-none text-sm">
                <option>Team Lead</option>
              </select>
              {users.map((name, i) => (
                <div key={i} className="flex justify-between py-1 text-sm">
                  <span>{name}</span>
                  <input
                    type="checkbox"
                    checked={form.reporter.includes(name)}
                    onChange={() => handleCheckbox("reporter", name)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Assignee</label>
            <div className="border rounded-md mt-2 p-3">
              <select className="w-full mb-2 outline-none text-sm">
                <option>Team Lead</option>
              </select>
              {users.map((name, i) => (
                <div key={i} className="flex justify-between py-1 text-sm">
                  <span>{name}</span>
                  <input
                    type="checkbox"
                    checked={form.assignee.includes(name)}
                    onChange={() => handleCheckbox("assignee", name)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button className="bg-green-100 text-green-600 px-4 py-2 rounded-md text-sm">
            Add Attachment
          </button>

          <div className="flex gap-4">
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