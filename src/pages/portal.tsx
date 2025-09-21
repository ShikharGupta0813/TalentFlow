import React, { useState } from "react";
import  Sidebar  from "@/components/Sidebar";
import  Navbar  from "@/components/Navbar";

type Route = "dashboard" | "jobs" | "candidates" | "assignments";

export default function HRPortalApp() {
  const [route, setRoute] = useState<Route>("dashboard");
  

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <Sidebar route={route} setRoute={setRoute} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">
          {route === "dashboard" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                 
                </div>
                <div className="space-y-6">
                  {/* Additional Cards (Recent Jobs, Candidates) */}
                </div>
              </div>
            </div>
          ) : (
            <h1>comin soon</h1>
          )}
        </main>
      </div>
    </div>
  );
}
