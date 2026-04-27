"use client";

import React from "react";
import Link from "next/link";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);


type Project = {
  id: number;
  title: string;
  image?: string;
};

type Task = {
  id: number;
  status?: string;
  created_at?: string;
};

type Performance = {
  month: string;
  achieved: number;
};

type Worklog = {
  name: string;
  value: number;
};

type Props = {
  projects?: Project[];
  tasks?: Task[];
  performance?: Performance[];
  worklog?: Worklog[];
};

export default function Dashboardwidgets({
  projects = [],
  tasks = [],
  performance = [],
  worklog = [],
}: Props) {
  
  const safeTasks: Task[] = (tasks || []).map((t) => ({
    ...t,
    status: (t.status || "").toLowerCase(),
  }));

  const safeProjects: Project[] = Array.isArray(projects) ? projects : [];

  

  const completed = safeTasks.filter((t) => t.status === "completed").length;
  const onHold = safeTasks.filter((t) => t.status?.includes("hold")).length;
  const pending = safeTasks.filter((t) => t.status === "pending").length;
  const inProgress = safeTasks.filter((t) =>
    t.status?.includes("progress")
  ).length;

  const totalTasks = safeTasks.length;

  
  const taskData = {
    labels: worklog.map((w) => w.name),
    datasets: [
      {
        data: worklog.map((w) => w.value),
        backgroundColor: ["#1ABC9C", "#3498DB", "#E74C3C", "#F1C40F"],
      },
    ],
  };

  const workLogData = {
    labels: ["Done", "Remaining"],
    datasets: [
      {
        data: [completed, totalTasks - completed],
        backgroundColor: ["#27AE60", "#F39C12"],
        borderWidth: 0,
      },
    ],
  };

  const lineData = {
    labels: performance.map((p) => p.month),
    datasets: [
      {
        label: "Achieved",
        data: performance.map((p) => p.achieved),
        borderColor: "#6C63FF",
      },
    ],
  };

 
  return (
    <div className="p-4 grid grid-cols-2 mt-16 p-6 gap-5 text-black">
      <div className="bg-white shadow rounded-md p-4 h-[320px]">
        <h3 className="font-semibold text-base mb-3">Projects</h3>

        <div className="flex gap-4 overflow-x-auto">
          {safeProjects.slice(0, 4).map((project) => (
            <Link href={`/projects/${project.id}`} key={project.id}>
              <div className="text-center cursor-pointer">
                <img
                  src={project.image || "/default.png"}
                  className="w-[90px] h-[70px] rounded object-cover"
                  alt={project.title}
                />
                <p className="text-xs mt-1 truncate">
                  {project.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded-md p-4 h-[320px]">
        <div className="flex justify-between mb-3">
          <h3 className="text-base font-semibold">Tasks</h3>
          <span className="text-xs bg-blue-100 px-2 py-1 rounded">
            Week
          </span>
        </div>

        {totalTasks === 0 ? (
          <p className="text-gray-400 text-sm">No data</p>
        ) : (
          <div className="flex justify-center items-center h-[230px]">
            <Pie data={taskData} />
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-md p-4 h-[320px]">
        <h3 className="text-base font-semibold mb-3">Work Log</h3>

        {totalTasks === 0 ? (
          <p className="text-gray-400 text-sm">No data</p>
        ) : (
          <div className="flex justify-center items-center h-[230px]">
            <Pie data={workLogData} />
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-md p-4 h-[320px]">
        <h3 className="text-base font-semibold mb-3">Performance</h3>

        {performance.length === 0 ? (
          <p className="text-gray-400 text-sm">No data</p>
        ) : (
          <div className="flex justify-center items-center h-[230px]">
            <Line data={lineData} />
          </div>
        )}
      </div>
    </div>
  );
}