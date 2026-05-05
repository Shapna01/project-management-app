"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Dashboardwidgets from "../components/dashboardwidgets";
import keycloak from "../lib/keycloak";
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

type DashboardData = {
  tasks: Task[];
  performance: Performance[];
  worklog: Worklog[];
};
export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
  initKeycloak();
}, []);

const initKeycloak = async () => {
  try {
    const authenticated = await keycloak.init({
      onLoad: "check-sso",
      pkceMethod: "S256",
      checkLoginIframe: false,
    });

    if (!authenticated) {
      keycloak.login();
      return;
    }

    await fetchData();
  } catch (err) {
    console.error("Keycloak init error:", err);
  }
};


  const fetchData = async (): Promise<void> => {
  try {
    await keycloak.updateToken(30);

    const token = keycloak.token;

    const res1 = await fetch("http://localhost:5001/api/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const projectsData = await res1.json();

    const res2 = await fetch("http://localhost:5001/api/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const dashboardData = await res2.json();

    setProjects(Array.isArray(projectsData) ? projectsData : []);

    setDashboard({
      tasks: Array.isArray(dashboardData.tasks) ? dashboardData.tasks : [],
      performance: Array.isArray(dashboardData.performance)
        ? dashboardData.performance
        : [],
      worklog: Array.isArray(dashboardData.worklog)
        ? dashboardData.worklog
        : [],
    });
  } catch (err) {
    console.error("Fetch error:", err);

    setProjects([]);
    setDashboard({
      tasks: [],
      performance: [],
      worklog: [],
    });
  }
};

  if (!dashboard) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-[#F2F6FF]">
      <Topbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 ml-64 p-6">
          <Dashboardwidgets
            projects={projects}
            tasks={dashboard.tasks}
            performance={dashboard.performance}
            worklog={dashboard.worklog}
          />
        </div>
      </div>
    </div>
  );
}