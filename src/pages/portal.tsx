import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import SimpleStats from "@/components/SimpleStats";
import { useDashboardData } from "@/hooks/useDashboardData";
import Heatmap from "@/components/Heatmap";
import MiniAreaChart from "@/components/MiniAreaChart";
import TopJobs from "@/components/TopJobs";
import { TopCandidates } from "@/components/TopCandidates";

type Route = "dashboard" | "jobs" | "candidates" | "assignments";

export default function HRPortalApp() {
  const [route, setRoute] = useState<Route>("dashboard");
  const { stats, areaData, heatmapData } = useDashboardData();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <Sidebar route={route} setRoute={setRoute} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">
          {route === "dashboard" ? (
            <div className="space-y-6">
              <SimpleStats stats={stats} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <MiniAreaChart data={areaData} />
                  <Heatmap data={heatmapData} />
                </div>
                <div className="space-y-6">
                  <div className="space-y-6">
                  <TopJobs/>
                    <TopCandidates/>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <h1>coming soon</h1>
          )}
        </main>
      </div>
    </div>
  );
}
