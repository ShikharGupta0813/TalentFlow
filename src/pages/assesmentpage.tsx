import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Users, FileCheck, Layers, Trash2 } from "lucide-react";
import Layout from "@/components/layout";
import NewAssignmentModal from "@/components/AssignmentModal";
import { useState, useEffect } from "react";
import Preview from "@/components/LivePreview"; // ✅ use shared Preview
import AssessmentBuilder from "./assesmentBuilder";
import { useNavigate } from "react-router";

type Assessment = {
  id: number;
  jobId: number;
  title: string;
  description: string;
  role: string;
  duration: string;
  submissions: number;
  status: "Active" | "Draft";
  sections: any[];
  totalQuestions: number;
  jobTitle?: string;
};

export default function Assignments() {
  const [open, setOpen] = useState(false);
  const [assignments, setAssignments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Assessment | null>(null);
  const [editing, setEditing] = useState<Assessment | null>(null);
  const [search, setSearch] = useState(""); // 🔍 search text
  const [statusFilter, setStatusFilter] = useState("All"); // 🔽 status dropdown
  const navigate = useNavigate();

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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this assessment?")) return;

    try {
      const res = await fetch(`/assessments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      setAssignments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error deleting assessment:", err);
      alert("Failed to delete assessment.");
    }
  };

  // ✅ Show Preview
  if (selected) {
    return (
      <Layout>
        <Preview assessment={selected} onBack={() => setSelected(null)} />
      </Layout>
    );
  }

  // ✅ Show Edit Builder
  if (editing) {
    return <AssessmentBuilder initialAssessment={editing} />;
  }

  // Stats
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
  const durations = assignments.map((a) => {
    if (!a.duration) return 0;
    const match = a.duration.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  });
  const avgDuration =
    durations.length > 0
      ? Math.round(durations.reduce((s, d) => s + d, 0) / durations.length)
      : 0;

  // 🔍 Filter by search + status
  const filteredAssignments = assignments.filter((a) => {
    const term = search.toLowerCase();
    const matchesSearch =
      a.title?.toLowerCase().includes(term) ||
      a.jobTitle?.toLowerCase().includes(term) ||
      a.role?.toLowerCase().includes(term) ||
      a.description?.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "All" || a.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" style={{ color: "#0d9488" }}>
            Assessments
          </h1>
          <Button
            className="text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#0d9488" }}
            onClick={() => setOpen(true)}
          >
            + New Assessment
          </Button>
          {open && <NewAssignmentModal onClose={() => setOpen(false)} />}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white border border-gray-200 shadow-sm">
            <h2 className="text-sm text-gray-500">Total Assessments</h2>
            <p className="text-2xl font-bold text-gray-900">{total}</p>
          </Card>
          <Card className="p-6 bg-white border border-gray-200 shadow-sm">
            <h2 className="text-sm text-gray-500">Active Assessments</h2>
            <p className="text-2xl font-bold text-green-600">{active}</p>
          </Card>
          <Card className="p-6 bg-white border border-gray-200 shadow-sm">
            <h2 className="text-sm text-gray-500">Avg Duration</h2>
            <p className="text-2xl font-bold text-amber-600">
              {avgDuration} min
            </p>
          </Card>
          <Card className="p-6 bg-white border border-gray-200 shadow-sm">
            <h2 className="text-sm text-gray-500">Total Submissions</h2>
            <p className="text-2xl font-bold text-blue-600">{submissions}</p>
          </Card>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by title, role, job..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-40 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        {/* List */}
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Your Assessments
        </h2>
        {loading ? (
          <p className="text-gray-500">Loading assessments...</p>
        ) : filteredAssignments.length === 0 ? (
          <p className="text-gray-500">No assessments found.</p>
        ) : (
          <div className="space-y-4">
            {filteredAssignments.map((a) => (
              <Card
                key={a.id}
                className="p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  {/* Left */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {a.title}
                    </h3>
                    <p className="text-gray-600">{a.role}</p>
                    {a.description && (
                      <p className="text-gray-500 text-sm mt-1">
                        {a.description}
                      </p>
                    )}

                    <div className="flex gap-4 mt-3 text-sm text-gray-500">
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
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                      }`}
                    >
                      {a.status}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => setSelected(a)}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(a.id)}
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => setEditing(a)} // 🔥 direct
                    >
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
