"use client";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function PerformanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F2F6FF]">
      <Topbar />

      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}