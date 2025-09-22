import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Layout from "@/components/layout";

export default function CandidatesPage() {
  const navigate = useNavigate();
  const jobs = api.getJobs(); // fetch jobs from localStorage API
  type Route = "dashboard" | "jobs" | "candidates" | "assignments";
  const [route,setRoute] = useState<Route>("dashboard");

  return (

        <Layout>
        <div className="p-6 text-black-500">
      <h1 className="text-2xl font-bold mb-4">Select a Job</h1>
      <div className="grid gap-4">
        {jobs.map((job: any) => (
          <Card
            key={job.id}
            onClick={() => navigate(`/candidates/${job.id}`)}
            className="p-4 bg-slate-900 border border-slate-800 cursor-pointer hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold">{job.title}</h2>
            <p className="text-sm text-slate-400">{job.location}</p>
          </Card>
        ))}
      </div>
    </div>
    
    </Layout>

  );
}
