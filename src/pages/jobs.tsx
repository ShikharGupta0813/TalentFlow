import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Grid, List } from "lucide-react";
import Layout from "@/components/layout";
import CreateJobModal from "@/components/JobModal";

type Job = {
  id: number;
  title: string;
  description: string;
  status: "Active" | "Archived";
  location: string;
  type: string;
  date: string;
  requirements?: string[];
  tags?: string[];
  order: number;
};

export default function JobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [status, setStatus] = useState<"All" | "Active" | "Archived">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const allTags = [
    ".NET",
    "AWS",
    "Agile",
    "Angular",
    "Azure",
    "C#",
    "CI/CD",
    "Django",
    "Express",
    "GCP",
    "Git",
    "Go",
    "GraphQL",
    "Java",
    "Jenkins",
    "Jest",
    "Kubernetes",
    "Microservices",
    "MongoDB",
    "Node.js",
    "PostgreSQL",
    "Python",
    "REST API",
    "React",
    "Redis",
    "Rust",
    "Scrum",
    "Spring Boot",
    "TDD",
    "Terraform",
    "TypeScript",
    "Vue.js",
  ];

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [open, setOpen] = useState(false);

  // ✅ Fetch jobs from backend
  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch(
          `/jobs?page=${page}&pageSize=${pageSize}&status=${
            status !== "All" ? status : ""
          }&search=${search}`
        );
        const result = await res.json();
        setJobs(result.data || []);
        setTotal(result.total || 0);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      }
    }
    fetchJobs();
  }, [page, pageSize, status, search]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // ✅ Filter by selected tags client-side
  const filteredJobs = jobs.filter(
    (job) =>
      selectedTags.length === 0 ||
      selectedTags.every((tag) => job.tags?.includes(tag))
  );

  const totalPages = Math.ceil(total / pageSize);

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Search + Actions */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg shadow-md space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Input
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="Search jobs by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Button
                variant={view === "grid" ? "default" : "outline"}
                onClick={() => setView("grid")}
              >
                <Grid size={16} />
              </Button>
              <Button
                variant={view === "list" ? "default" : "outline"}
                onClick={() => setView("list")}
              >
                <List size={16} />
              </Button>
              <div>
                {/* Create Job Button */}
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => setOpen(true)}
                >
                  + Create Job
                </Button>

                {/* Modal */}
                {open && (
                  <CreateJobModal
                    open={open}
                    onClose={() => setOpen(false)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="All" onValueChange={(v: any) => setStatus(v)}>
            <TabsList className="bg-slate-800 border border-slate-700">
              <TabsTrigger value="All">All Jobs</TabsTrigger>
              <TabsTrigger value="Active">Active</TabsTrigger>
              <TabsTrigger value="Archived">Archived</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Tag filters */}
          <div className="flex flex-wrap gap-2 mt-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  selectedTags.includes(tag)
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Job Results */}
        <div className="flex justify-between items-center text-slate-400 text-sm">
          <span>
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, total)} of {total} jobs
          </span>
          <div className="flex items-center gap-2">
            <span>Show:</span>
            <select
              className="bg-slate-800 text-white px-2 py-1 rounded"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[5, 10, 15, 20].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Jobs Grid/List */}
        <div
          className={
            view === "grid"
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              onClick={() => navigate(`/jobs/${job.id}`)}
              className="bg-slate-900 border border-slate-800 text-white shadow-lg hover:shadow-xl transition relative"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{job.title}</CardTitle>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      job.status === "Active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-orange-500/20 text-orange-400"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400">{job.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>{job.location}</span>
                  <span className="capitalize">{job.type}</span>
                </div>
                <div className="text-xs text-slate-500">{job.date}</div>

                <div>
                  <p className="font-medium text-sm mb-1 text-slate-200">
                    Key Requirements
                  </p>
                  <ul className="list-disc list-inside text-xs space-y-1 text-slate-400">
                    {(job.requirements || []).map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {(job.tags || []).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs bg-slate-800 rounded text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft size={16} /> Previous
          </Button>
          <span className="px-2 text-slate-300">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </Layout>
  );
}
