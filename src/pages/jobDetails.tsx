import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = api.getJobs().find((j: any) => j.id === Number(id));
  
  type Route = "dashboard" | "jobs" | "candidates" | "assignments";
    const [route, setRoute] = useState<Route>("dashboard");

  if (!job) return <p className="text-red-500">Job not found</p>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
          <Sidebar route={route} setRoute={setRoute} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-white">
            ← Back to Jobs
          </button>
          <h1 className="text-2xl font-bold mt-2">Job Details</h1>
          <p className="text-gray-400 text-sm">Manage and view job information</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">Edit</Button>
          <Button variant="outline">Archive</Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </div>

      {/* Gradient Job Card */}
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
        <span className="px-2 py-1 bg-green-600 rounded text-xs">{job.status}</span>
        <h2 className="text-2xl font-bold mt-2">{job.title}</h2>
        <p className="flex gap-4 text-sm mt-1">
          <span>{job.location}</span>
          <span className="px-2 py-0.5 bg-gray-800 rounded">{job.type}</span>
        </p>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        {/* Left section */}
        <div className="col-span-2 space-y-6">
          <Card className="p-6 bg-gray-900">
            <h3 className="text-lg font-semibold">Job Description</h3>
            <p className="text-gray-300 mt-2">{job.description}</p>
          </Card>

          <Card className="p-6 bg-gray-900">
            <h3 className="text-lg font-semibold">Requirements</h3>
            <ul className="mt-2 space-y-2">
              {job.requirements.map((req: string, idx: number) => (
                <li key={idx} className="bg-gray-800 px-3 py-2 rounded">{req}</li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 bg-gray-900">
            <h3 className="text-lg font-semibold">Skills & Tags</h3>
            <div className="flex flex-wrap gap-2 mt-3">
              {job.tags.map((tag: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-gray-800 rounded-full text-sm">{tag}</span>
              ))}
            </div>
          </Card>
        </div>

        {/* Right section */}
        <div className="space-y-6">
          <Card className="p-6 bg-gray-900">
            <h3 className="text-lg font-semibold">Candidate Pipeline</h3>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {[
                { label: "APPLIED", value: 6, color: "bg-blue-600" },
                { label: "SCREEN", value: 8, color: "bg-yellow-600" },
                { label: "TECH", value: 7, color: "bg-purple-600" },
                { label: "OFFER", value: 7, color: "bg-green-600" },
                { label: "HIRED", value: 5, color: "bg-teal-600" },
                { label: "REJECTED", value: 5, color: "bg-red-600" },
              ].map((stage) => (
                <div key={stage.label} className={`p-4 rounded-lg ${stage.color}`}>
                  <p className="text-xs">{stage.label}</p>
                  <p className="text-lg font-bold">{stage.value}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gray-900">
            <h3 className="text-lg font-semibold">Job Information</h3>
            <p className="mt-2 text-sm">📅 Created: {job.date}</p>
            <p className="mt-1 text-sm">🔗 Slug: {job.title.toLowerCase().replace(/\s+/g, "-")}</p>
          </Card>

          <Card className="p-6 bg-gray-900">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <Button className="w-full mt-3">👥 View Candidates</Button>
            <Button className="w-full mt-2" variant="outline">📑 View Assessments</Button>
          </Card>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}
