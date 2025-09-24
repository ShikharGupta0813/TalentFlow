import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Users, FileCheck, Layers } from "lucide-react";
import Layout from "@/components/layout";
import NewAssignmentModal from "@/components/AssignmentModal";
import { useState, useEffect } from "react";

type Assessment = {
  id: number;
  jobId: number;
  title: string;
  description: string;
  role: string;
  duration: string;
  submissions: number;
  status: "Active" | "Draft";
  sections: any[]; // you can type Section later
  totalQuestions: number;
  jobTitle?: string;
};

export default function Assignments() {
  const [open, setOpen] = useState(false);
  const [assignments, setAssignments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const load = async () => {
    try {
      const res = await fetch("/assessments");
      const json = await res.json();
      setAssignments(json.data);
    } catch (e) {
      console.error("Failed to fetch assessments", e);
    } finally {
      setLoading(false);
    }
  };
  load();
}, []);


  // ✅ Stats
const total = assignments.length;

const active = assignments.filter((a) => a.status === "Active").length;

const submissions = assignments.reduce(
  (sum, a) => sum + (a.submissions ?? 0),
  0
);

const totalQuestions = assignments.reduce(
  (sum, a) => sum + (a.totalQuestions ?? 0),
  0
);

// Extract minutes safely from duration (expects format like "45 mins")
const durations = assignments.map((a) => {
  if (!a.duration) return 0;
  const match = a.duration.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
});

const avgDuration =
  durations.length > 0
    ? Math.round(durations.reduce((s, d) => s + d, 0) / durations.length)
    : 0;


  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-400">Assignments</h1>
          <Button
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
            onClick={() => setOpen(true)}
          >
            + New Assignment
          </Button>
          {open && <NewAssignmentModal onClose={() => setOpen(false)} />}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-slate-900 border border-slate-800">
            <h2 className="text-sm text-slate-400">Total Assignments</h2>
            <p className="text-2xl font-bold">{total}</p>
          </Card>
          <Card className="p-6 bg-slate-900 border border-slate-800">
            <h2 className="text-sm text-slate-400">Active Assignments</h2>
            <p className="text-2xl font-bold text-green-400">{active}</p>
          </Card>
          <Card className="p-6 bg-slate-900 border border-slate-800">
            <h2 className="text-sm text-slate-400">Avg Duration</h2>
            <p className="text-2xl font-bold text-yellow-400">
              {avgDuration} min
            </p>
          </Card>
          <Card className="p-6 bg-slate-900 border border-slate-800">
            <h2 className="text-sm text-slate-400">Total Submissions</h2>
            <p className="text-2xl font-bold text-blue-400">{submissions}</p>
          </Card>
        </div>

        {/* List */}
        <h2 className="text-xl font-semibold mb-4">Your Assignments</h2>
        {loading ? (
          <p className="text-slate-400">Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <p className="text-slate-400">No assignments created yet.</p>
        ) : (
          <div className="space-y-4">
            {assignments.map((a) => (
              <Card
                key={a.id}
                className="p-6 bg-slate-900 border border-slate-800 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  {/* Left */}
                  <div>
                    <h3 className="text-lg font-bold text-white">{a.title}</h3>
                    <p className="text-slate-400">{a.role}</p>
                    {a.description && (
                      <p className="text-slate-500 text-sm mt-1">
                        {a.description}
                      </p>
                    )}

                    <div className="flex gap-4 mt-3 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <FileCheck size={14} /> {a.totalQuestions} questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers size={14} /> {a.sections?.length || 0} sections
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {a.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} /> {a.submissions} submissions
                      </span>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex gap-3 items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        a.status === "Active"
                          ? "bg-green-500/10 text-green-400 border border-green-400/30"
                          : "bg-yellow-500/10 text-yellow-400 border border-yellow-400/30"
                      }`}
                    >
                      {a.status}
                    </span>
                    <Button variant="outline" size="sm">
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
