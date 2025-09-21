import { Button } from "@/components/ui/button";
type Route = "dashboard" | "jobs" | "candidates" | "assignments";

function Sidebar({ route, setRoute }: { route: Route; setRoute: (r: Route) => void }) {

return (
<aside className="w-64 bg-white shadow-lg min-h-screen p-4 border-r flex flex-col">
<div className="font-bold text-xl text-indigo-600 mb-6">HR Portal</div>
<nav className="space-y-2 flex-1">
<Button variant={route === "dashboard" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setRoute("dashboard")}>Dashboard</Button>
<Button variant={route === "jobs" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setRoute("jobs")}>Jobs</Button>
<Button variant={route === "candidates" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setRoute("candidates")}>Candidates</Button>
<Button variant={route === "assignments" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setRoute("assignments")}>Assignments</Button>
</nav>

</aside>
);
}

export default Sidebar;