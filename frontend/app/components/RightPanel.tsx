"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
type Project = {
  id: number;
  title: string;
  description?: string;
};
export default function RightPanel() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("http://localhost:5001/projects")
      .then((res) => res.json())
      .then((data: Project[]) => setProjects(data))
      .catch(console.error);
  }, []);

  return (
    <div className="w-[300px] space-y-6">

      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="flex justify-between">
          <h3 className="font-semibold text-black">Projects</h3>
          <Link href="/projects/all">
            <span className="text-pink-500 text-sm cursor-pointer">
              View all
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {projects.slice(0, 6).map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              
              <div className="cursor-pointer hover:scale-105 transition">
                <div className="w-full h-20 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={`https://picsum.photos/200?random=${project.id}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-[11px] mt-1 font-medium truncate">
                  {project.title}
                </p>
              </div>

            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4 text-center">
        <div className="flex justify-between">
          <h3 className="font-semibold text-black">Total work done</h3>
          <span className="text-sm bg-blue-100 text-gray-500 px-2 rounded">
            This Week
          </span>
        </div>

        <div className="mt-6">
          <div className="w-32 h-32 mx-auto rounded-full border-[10px] border-blue-500 border-t-gray-300 flex items-center justify-center">
            <span className="font-bold text-gray-500">5w:2d</span>
          </div>
        </div>
      </div>

    </div>
  );
}