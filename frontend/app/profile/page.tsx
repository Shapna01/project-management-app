"use client";

import ProfileCard from "../components/ProfileCard";
import MainProfile from "../components/MainProfile";
import RightPanel from "../components/RightPanel";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#F2F6FF]">
      <Topbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 ml-64 mt-16 p-6 bg-[#F2F6FF] min-h-screen">
          <div className="flex gap-6 w-full">
            <ProfileCard />

            <div className="flex-1">
              <MainProfile />
            </div>

            <div className="w-[320px]">
              <RightPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}