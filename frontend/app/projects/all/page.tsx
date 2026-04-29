"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
type Project = {
  id: number;
  title: string;
  description?: string;
  status?: string;
  created_at?: string;
  createdAt?: string;
  issues?: number;
};

   export default function AllProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProjects = (): void => {
    setLoading(true);

    fetch("http://localhost:5001/api/projects")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
     .then((data: any) => {
  const projectsData = Array.isArray(data) ? data : [];

  const formatted: Project[] = projectsData.map((p: any) => ({
    ...p,
    createdAt: p.created_at,
    status: (p.status || "pending").toLowerCase(),
  }));

  setProjects(formatted);
})
      .catch((err) => {
        console.error("❌ FETCH ERROR:", err);
        setProjects([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async () => {
    if (!title || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        throw new Error("Failed to create project");
      }

      await res.json();

      fetchProjects();

      setTitle("");
      setDescription("");
      setShowModal(false);
    } catch (err) {
      console.error("❌ CREATE ERROR:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F6FF]">
      <Topbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 ml-64 mt-16 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-black">All Projects</h1>

            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Create
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 text-black">
            {loading ? (
              <p>Loading projects...</p>
            ) : projects.length === 0 ? (
              <p>No projects found</p>
            ) : (
              projects.map((project) => (
                <Link href={`/projects/${project.id}`} key={project.id}>
                  <div className="bg-white p-5 rounded-xl shadow hover:shadow-md cursor-pointer">
                    <h2 className="font-semibold text-lg">
                      {project.title}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {project.description}
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                      {Number(project.issues || 0)} issues
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-black">
                  Create Project
                </h2>

                <input
                  type="text"
                  placeholder="Project Title"
                  className="w-full border p-2 text-black rounded mb-3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                  placeholder="Project Description"
                  className="w-full border text-black p-2 rounded mb-4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-black border rounded"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleCreate}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

