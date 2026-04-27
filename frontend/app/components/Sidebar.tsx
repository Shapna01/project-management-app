"use client";

import {
  Folder,
  CheckSquare,
  Clock,
  BarChart2,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { LucideIcon } from "lucide-react";
type MenuItem = {
  name: string;
  icon: any;
  path: string;
  subMenu?: {
    name: string;
    path: string;
  }[];
};
export default function Sidebar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const menu: MenuItem[] = [
    {
      name: "Projects",
      icon: Folder,
      path: "/projects",
    },
    {
      name: "Tasks",
      icon: CheckSquare,
      path: "/tasks",
      subMenu: [
        { name: "Create Task", path: "/tasks/create" },
        { name: "Create SubTask", path: "/tasks/create-subtask" },
      ],
    },
    {
      name: "Work Log",
      icon: Clock,
      path: "/worklog",
    },
    {
      name: "Performance",
      icon: BarChart2,
      path: "/performance",
      subMenu: [
            { name: "Create Project", path: "/performance/create-project" },

        { name: "Create Task", path: "/performance/create" },

        { name: "Create SubTask", path: "/performance/create-subtask" },
      ],
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <div className="w-64 h-screen fixed bg-white shadow-sm flex flex-col p-5">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
        <span className="font-semibold text-[#1C4E80] text-lg">
          AProjectO
        </span>
      </div>
      <ul className="space-y-3">
        {menu.map((item, index) => {
          const isActive = pathname.startsWith(item.path);

          return (
            <li key={index}>
              <div
                onClick={() =>
                  item.subMenu
                    ? setOpenMenu(openMenu === index ? null : index)
                    : null
                }
              >
                <Link
                  href={item.path}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.name}
                  </div>
                </Link>
              </div>

              {item.subMenu && openMenu === index && (
                <ul className="ml-8 mt-2 space-y-2">
                  {item.subMenu.map((sub, i) => {
                    const isSubActive = pathname === sub.path;

                    return (
                      <li key={i}>
                        <Link
                          href={sub.path}
                          className={`block text-sm px-2 py-1 rounded ${
                            isSubActive
                              ? "text-blue-600 font-medium"
                              : "text-gray-600 hover:text-black"
                          }`}
                        >
                          {sub.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}