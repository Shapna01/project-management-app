"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { PieLabelRenderProps } from "recharts";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type Project = {
  id: number;
  title: string;
  description?: string;
  status?: string;
  created_at?: string;
  createdAt: string | undefined;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAllDevs, setShowAllDevs] = useState(false);

  const COLORS: string[] = [
  "#2F8F9D",
  "#6C63FF",
  "#3FA7D6",
  "#E53935",
];

  useEffect(() => {
    fetch("http://localhost:5001/api/projects")
      .then((res) => res.json())
      .then((data: any[] = []) => {
        const formatted: Project[] = data.map((p) => ({
          id: p.id,
          title: p.title ?? "Untitled",
          description: p.description ?? "",
          status: (p.status || "pending").toLowerCase(),
          created_at: p.created_at,
          createdAt: p.created_at ?? new Date().toISOString(),
        }));

        setProjects(formatted);
      })
      .catch(() => setProjects([]));
  }, []);

  const getProjectStats = (projects: Project[]) => {
    const stats = {
      completed: 0,
      onhold: 0,
      inprogress: 0,
      pending: 0,
    };

    projects.forEach((p) => {
      const status = p.status || "";

      if (status.includes("completed")) stats.completed++;
      else if (status.includes("hold")) stats.onhold++;
      else if (
        status.includes("progress") ||
        status.includes("track") ||
        status.includes("risk")
      )
        stats.inprogress++;
      else stats.pending++;
    });

    return [
      { name: "Completed", value: stats.completed },
      { name: "On Hold", value: stats.onhold },
      { name: "In Progress", value: stats.inprogress },
      { name: "Pending", value: stats.pending },
    ];
  };

  const getPerformanceData = (projects: Project[]) => {
    const map: Record<string, { date: string; count: number; target: number }> =
      {};

    projects.forEach((p) => {
      if (!p.createdAt) return;

      const date = new Date(p.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });

      if (!map[date]) {
        map[date] = { date, count: 0, target: 5 };
      }

      map[date].count++;
    });

    return Object.values(map);
  };

  const pieData = getProjectStats(projects);
  const lineData = getPerformanceData(projects);

  const renderLabel = ({
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    percent = 0,
  }: PieLabelRenderProps) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;

    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
      >
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  return (
    <div className="min-h-screen bg-[#F2F6FF]">
      <Topbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 ml-64 mt-16 p-6">
          <h1 className="text-2xl font-semibold mb-6 text-black">
            Projects
          </h1>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 flex flex-col gap-6">

              <div className="grid grid-cols-2 gap-6">

                <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between h-[260px]">
                  <h2 className="text-sm font-semibold text-black">
                    Project
                  </h2>

                  {pieData.length > 0 && (
                    <PieChart width={200} height={200}>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        dataKey="value"
                        labelLine={false}
                        label={renderLabel}
                      >
                        {pieData.map((_, i) => (
                         <Cell
  key={i}
  fill={COLORS[i % COLORS.length] ?? "#000000"}
/>
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  )}

                  <div className="space-y-3">
                    {pieData.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-sm"
                          style={{
                            backgroundColor:
                              COLORS[i % COLORS.length],
                          }}
                        />
                        <span className="text-sm text-gray-700">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm h-[260px] flex flex-col justify-between">
                  <h2 className="text-sm font-semibold text-black">
                    Performance
                  </h2>

                  {lineData.length > 0 && (
                    <LineChart width={350} height={170} data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={10} />
                      <YAxis fontSize={10} />
                      <Tooltip />

                      <Line dataKey="count" stroke="#FF6B6B" dot={false} />
                      <Line dataKey="target" stroke="#6C63FF" dot={false} />
                    </LineChart>
                  )}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm">
                <div className="flex justify-between mb-4">
                  <h2 className="font-semibold text-black">
                    UI Developers ({projects.length})
                  </h2>

                  <span
                    onClick={() => setShowAllDevs(!showAllDevs)}
                    className="text-sm text-blue-600 cursor-pointer"
                  >
                    {showAllDevs ? "Show less" : "View all"}
                  </span>
                </div>

                <div
                  className={`grid grid-cols-6 gap-4 ${
                    showAllDevs
                      ? "max-h-[300px] overflow-y-auto"
                      : "max-h-[180px] overflow-hidden"
                  }`}
                >
                  {(showAllDevs ? projects : projects.slice(0, 18)).map(
                    (_, i) => (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden"
                      >
                        <img
                          src={`https://i.pravatar.cc/150?img=${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm h-[540px]">
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold text-black">Projects</h2>
                <Link href="/projects/all">
                  <span className="text-sm text-blue-600">View all</span>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 overflow-y-auto">
                {projects.slice(0, 10).map((project) => (
                  <Link key={project.id} href={`/projects/${project.id}`}>
                    <div className="cursor-pointer">
                      <div className="h-24 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={`https://picsum.photos/200?random=${project.id}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <p className="text-sm mt-2 font-medium">
                        {project.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}