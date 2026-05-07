"use client";

import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
type LineItem = {
  month: string;
  achieved: number;
  target: number;
};

type PieItem = {
  name: string;
  value: number;
};

type Task = {
  id?: number;
  title: string;
  status: string;
};
type DashboardResponse = {
  performance?: LineItem[];
  worklog?: PieItem[];
  tasks?: Task[];
};
export default function PerformancePage() {
  const [lineData, setLineData] = useState<LineItem[]>([]);
const [pieData, setPieData] = useState<PieItem[]>([]);
const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("month");

  useEffect(() => {
    fetchDashboard();
  }, [filter]);

  const fetchDashboard = async () => {
  try {
    const res = await fetch(
      `http://localhost:5001/api/dashboard?filter=${filter}`
    );

    const data: DashboardResponse = await res.json();

    setLineData(data.performance ?? []);
setPieData(data.worklog ?? []);
setTasks(data.tasks ?? []);

  } catch (err) {
    console.error("FETCH ERROR:", err);
  }
};

  const lineOption = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "#fff",
      borderColor: "#eee",
      textStyle: { color: "#000" },
    },
    legend: {
      right: 10,
      top: 0,
      textStyle: { color: "#6B7280" },
    },
    grid: {
      left: "3%",
      right: "3%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: lineData.map((d: LineItem) => d.month),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#9CA3AF" },
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: { color: "#F3F4F6" },
      },
      axisLabel: { color: "#9CA3AF" },
    },
    series: [
      {
        name: "Achieved",
        type: "line",
        smooth: true,
        data: lineData.map((d) => d.achieved),
        lineStyle: { color: "#FF6B6B", width: 3 },
        symbol: "circle",
        symbolSize: 6,
        itemStyle: { color: "#FF6B6B" },
      },
      {
        name: "Target",
        type: "line",
        smooth: true,
        data: lineData.map((d) => d.target),
        lineStyle: { color: "#6366F1", width: 3 },
        symbol: "circle",
        symbolSize: 6,
        itemStyle: { color: "#6366F1" },
      },
    ],
  };

  const pieOption = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      right: 10,
      top: "center",
      textStyle: { color: "#6B7280" },
    },
    series: [
      {
        type: "pie",
        radius: ["55%", "75%"],
        center: ["40%", "50%"],
        data: pieData,
        label: { show: false },
        itemStyle: {
          borderRadius: 6,
        },
      },
    ],
    color: ["#FF4D4F", "#36A2EB", "#FF9F40", "#FFCD56", "#4CAF50"],
  };

  return (
    <div className="p-6 bg-[#F5F7FB] min-h-screen flex-1 mt-16 p-6">

      <div className="grid grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-black mb-4">
            Performance Report
          </h2>
          <ReactECharts option={lineOption} style={{ height: 300 }} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold text-black">
              Work Log
            </h2>

            <div className="flex gap-2">
              <button
                onClick={() => setFilter("week")}
                className={`px-3 py-1 text-xs rounded-md font-medium transition ${
  filter === "week"
    ? "bg-blue-100 text-blue-600"
    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
}`}
              >
                This Week
              </button>

              <button
                onClick={() => setFilter("month")}
                className={`px-3 py-1 text-xs rounded ${
                  filter === "month"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-200"
                }`}
              >
                This Month
              </button>
            </div>
          </div>

          <ReactECharts option={pieOption} style={{ height: 300 }} />
        </div>

      </div>

      <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="mb-4 font-semibold text-gray-800 text-lg">Recent Tasks</h2>

        {tasks.length === 0 ? (
          <p className="text-gray-400 text-sm">No tasks found</p>
        ) : (
          tasks.map((task: Task, i: number) => (
            <div
              key={i}
              className="flex justify-between items-center px-4 py-3 rounded-lg hover:bg-gray-50 transition"
            >
              <span className="text-black">{task.title}</span>
              <span
  className={`px-3 py-1 text-xs font-medium rounded-full ${
    task.status === "Completed"
      ? "bg-green-100 text-green-600"
      : task.status === "Pending"
      ? "bg-red-100 text-red-500"
      : "bg-yellow-100 text-yellow-600"
  }`}
>
                {task.status}
              </span>
            </div>
          ))
        )}
      </div>

    </div>
  );
}