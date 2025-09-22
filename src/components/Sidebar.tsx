import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft,ChevronRight } from "lucide-react";
type Route = "dashboard" | "jobs" | "candidates" | "assignments";

function Sidebar({
   route,
  setRoute,
  collapsed,
  setCollapsed,
}: {
  route: Route;
  setRoute: (r: Route) => void;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();


  return (
      <div
      className={`h-screen border-r border-slate-800 flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
        <div className="flex items-center justify-between p-4">
     {!collapsed && <div className="font-bold text-xl text-indigo-600 mb-6">HR Portal</div>}

        </div>
      <nav className="space-y-2 flex-1">
           <Button
        variant={location.pathname === "/dashboard" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => navigate("/dashboard")}
      >
        {!collapsed && <span>Dashboard</span>}
      </Button>
        <Button
          variant={location.pathname.startsWith("/jobs") ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => navigate("/jobs")}
        >
          {!collapsed && <span>Jobs</span>}
        </Button>
        <Button
          variant={
            location.pathname.startsWith("/candidates") ? "default" : "ghost"
          }
          className="w-full justify-start"
          onClick={() => navigate("/candidates")}
        >
          {!collapsed && <span>Candidates</span>}
        </Button>
        <Button
          variant={
            location.pathname.startsWith("/assignments") ? "default" : "ghost"
          }
          className="w-full justify-start"
          onClick={() => navigate("/assignments")}
        >
          {!collapsed && <span>Assignments</span>}
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
  {collapsed ? <ChevronRight /> : <ChevronLeft />}
</Button>
      </nav>
    </div>
  );
}

export default Sidebar;
