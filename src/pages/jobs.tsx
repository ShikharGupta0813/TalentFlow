// src/pages/jobs.tsx
import * as React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
// Sortable Job Card for Grid View
function SortableJobCard({ job, id }: { job: Job; id: number | string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : "auto",
  };
  const navigate = useNavigate();
  // Handler for card click, always navigate to job details
  const handleCardClick = (e: React.MouseEvent) => {
    if (job.id && typeof job.id === 'number') {
      navigate(`/jobs/${job.id}`);
    }
  };
  // Mouse-move border glow effect
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  return (
    <div
      ref={setNodeRef}
      style={{ ...style, '--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px` } as React.CSSProperties}
      className="job-card-glow bg-white border border-slate-200 text-slate-800 shadow-sm cursor-pointer rounded-xl flex flex-col h-full group relative transition-all duration-300"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label={`View details for job ${job.title}`}
      onMouseMove={handleMouseMove}
    >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <div className="bg-slate-100 hover:bg-slate-200 rounded p-1 cursor-grab active:cursor-grabbing drag-handle" {...attributes} {...listeners}>
            <GripVertical className="h-4 w-4 text-slate-400" />
          </div>
        </div>
  <CardHeader className="space-y-2 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                {job.companyIcon}
              </div>
              <CardTitle className="text-lg font-bold text-slate-900">{job.title}</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              {job.status === 'active' ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100/80 border border-green-200/80 gap-1.5">
                  <CheckCircle2 size={14} /> Active
                </Badge>
              ) : (
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100/80 border border-amber-200/80 gap-1.5">
                  <Archive size={14} /> Archived
                </Badge>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8 more-btn">
                <MoreHorizontal size={16} />
              </Button>
            </div>
          </div>
          <p className="text-sm text-slate-500 pt-1">{job.description}</p>
        </CardHeader>
  <CardContent className="space-y-4 pt-0 flex flex-col flex-grow z-10">
          <div className="flex items-center flex-wrap text-sm text-slate-500 gap-x-4 gap-y-2">
            <div className="flex items-center gap-2">
              <MapPin size={16} /> <span>{job.location || 'Remote'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase size={16} /> <span className="capitalize">{job.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{job.date ? format(parseISO(job.date), 'MMM d, yyyy') : 'N/A'}</span>
            </div>
          </div>
          <div className="space-y-3 pt-4 border-t border-slate-100 flex flex-col flex-grow">
            {(job.requirements && job.requirements.length > 0) && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
                <h4 className="font-semibold text-xs text-slate-600 mb-2 flex items-center gap-2"><Star size={14}/> Key Requirements</h4>
                <ul className="list-disc list-inside space-y-1">
                  {job.requirements.slice(0, 2).map((req, i) => (
                    <li key={i} className="text-xs text-slate-500">{req}</li>
                  ))}
                </ul>
              </div>
            )}
            {(job.skills && job.skills.length > 0) && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 mt-auto">
                <h4 className="font-semibold text-xs text-slate-600 mb-2 flex items-center gap-1"><Dot/> Skills & Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {job.skills.slice(0, 4).map((skill, i) => (
                    <Badge key={i} variant="secondary" className="flex items-center gap-1.5 font-normal">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                      {skill}
                    </Badge>
                  ))}
                  {job.skills.length > 4 && (
                    <Badge variant="secondary" className="font-normal">+{job.skills.length - 4} more</Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
    </div>
  );
}

// Sortable Job Card for List View
function SortableListJobCard({ job, id }: { job: Job; id: number | string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : "auto",
  };
  const navigate = useNavigate();
  const handleCardClick = (e: React.MouseEvent) => {
    if (job.id && typeof job.id === 'number') {
      navigate(`/jobs/${job.id}`);
    }
  };
  // Mouse-move border glow effect
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  return (
    <div
      ref={setNodeRef}
      style={{ ...style, '--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px` } as React.CSSProperties}
      className="job-card-glow bg-white border border-slate-200 rounded-xl shadow-sm cursor-pointer"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label={`View details for job ${job.title}`}
      onMouseMove={handleMouseMove}
    >
      <div className="flex items-center gap-3 p-4">
        <GripVertical className="text-slate-400 cursor-grab active:cursor-grabbing drag-handle" {...attributes} {...listeners} />
        <div className="h-12 w-10 rounded-full bg-slate-100 flex items-center justify-center">
          {job.companyIcon}
        </div>
        <div className="flex-grow">
          <CardTitle className="text-lg font-bold text-slate-900">{job.title}</CardTitle>
          <p className="text-sm text-slate-500">{job.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {job.status === 'active' ? (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100/80 border border-green-200/80 gap-1.5">
              <CheckCircle2 size={14} /> Active
            </Badge>
          ) : (
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100/80 border border-amber-200/80 gap-1.5">
              <Archive size={14} /> Archived
            </Badge>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8 more-btn">
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Search,
  MapPin,
  Calendar,
  Briefcase,
  Plus,
  Star,
  Archive,
  CheckCircle2,
  Dot,
  MoreHorizontal,
  GripVertical,
} from "lucide-react";
import Layout from "@/components/layout";
import CreateJobModal from "@/components/JobModal";
import { format, parseISO } from "date-fns";

type Job = {
  id: number;
  title: string;
  description: string;
  status: "active" | "archived";
  location: string;
  type: string;
  order: number;
  date?: string;
  skills?: string[];
  requirements?: string[];
  companyIcon?: React.ReactNode;
};

const JobCardSkeleton = () => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 animate-pulse space-y-4">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="h-12 w-10 rounded-xl bg-slate-200"></div>
        <div>
          <div className="h-5 w-40 bg-slate-200 rounded"></div>
          <div className="h-4 w-48 bg-slate-200 rounded mt-2"></div>
        </div>
      </div>
      <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
    </div>
    <div className="flex items-center gap-4">
      <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
      <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
      <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
    </div>
    <div className="space-y-3 pt-2">
      <div className="h-16 bg-slate-100 rounded-lg"></div>
      <div className="h-16 bg-slate-100 rounded-lg"></div>
    </div>
  </div>
);

export default function JobsPage() {

  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [status, setStatus] = useState<"All" | "active" | "archived">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [open, setOpen] = useState(false);

  const allTags = [
    "React", "Angular", "Vue.js", "Python", "Node.js", "Docker", "AWS",
    "TypeScript", "JavaScript", "REST API", "GraphQL", "Kubernetes"
  ];
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Helper for pagination display (must be after state declarations)
  const startJob = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endJob = Math.min(page * pageSize, total);
  const pageSizes = [10, 20, 50];

  // --- Fetch jobs ---
  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const res = await fetch(
          `/jobs?page=${page}&pageSize=${pageSize}&search=${search}`
        );
        const result = await res.json();

          const processedData = result.data.map((job: Job) => ({
            ...job,
            companyIcon: <Briefcase className="h-5 w-5 text-indigo-500" />
          }));

        setJobs(processedData || []);
        setTotal(result.total || 0);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [page, pageSize, search]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Filter directly on jobs, not filteredJobs
  const filteredJobs = jobs.filter(job => {
    const statusMatch = status === 'All' || job.status === status;
    const tagMatch = selectedTags.length === 0 || selectedTags.every(tag => job.skills?.includes(tag));
    return statusMatch && tagMatch;
  });

  // Use dragList as the source of truth for order
  const [dragList, setDragList] = useState<Job[]>([]);
  // Only set dragList when jobs or filters change, not on every render
  useEffect(() => {
    setDragList(filteredJobs);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs, status, selectedTags, search, page, pageSize]);

  const handleReorder = async (newOrder: Job[], fromIdx?: number, toIdx?: number) => {
    const prevOrder = [...dragList];
    setDragList(newOrder);
    setJobs(newOrder);

    if (typeof fromIdx === 'number' && typeof toIdx === 'number' && fromIdx !== toIdx) {
      const fromJob = prevOrder[fromIdx];
      const toJob = prevOrder[toIdx];
      try {
        // Call backend reorder API
        const res = await fetch(`/jobs/${fromJob.id}/reorder`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fromOrder: fromJob.order, toOrder: toJob.order })
        });
        if (!res.ok) throw new Error('Failed to reorder jobs');
        // Update the moved job's order in backend
        await fetch(`/jobs/${fromJob.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: toJob.order })
        });
        // Refetch jobs to ensure UI matches backend
        setLoading(true);
        const jobsRes = await fetch(
          `/jobs?page=${page}&pageSize=${pageSize}&search=${search}`
        );
        const result = await jobsRes.json();
        const processedData = result.data.map((job: Job) => ({
          ...job,
          companyIcon: <Briefcase className="h-5 w-5 text-indigo-500" />
        }));
        setJobs(processedData || []);
        setTotal(result.total || 0);
        setDragList(processedData || []);
        toast.success('Job order updated!');
      } catch (err) {
        setDragList(prevOrder);
        setJobs(prevOrder);
        toast.error('Failed to update job order. Reverting.');
      } finally {
        setLoading(false);
      }
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100 } },
  };

  return (
    <Layout>
      <style>{`
        .job-card-glow {
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.3s, border-color 0.3s;
        }
        .job-card-glow::before {
          content: '';
          position: absolute;
          top: var(--mouse-y, 50%);
          left: var(--mouse-x, 50%);
          width: 0;
          height: 0;
          background: radial-gradient(circle, rgba(20,184,166,0.18) 0%, rgba(14,165,233,0.10) 60%, rgba(20,184,166,0) 100%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.4s, height 0.4s, opacity 0.4s;
          opacity: 0;
          z-index: 0;
        }
        .job-card-glow:hover::before {
          width: 420px;
          height: 420px;
          opacity: 1;
        }
        .job-card-glow:hover {
          border-color: #0ea5e9;
          box-shadow: 0 8px 32px -8px rgba(14,165,233,0.18), 0 2px 8px -2px rgba(20,184,166,0.10);
        }
        .selector-btn {
          background: #f0fdfa;
          color: #0d9488;
          border: 1.5px solid #14b8a6;
          border-radius: 0.5rem;
          padding: 0.45rem 1.1rem;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.2s cubic-bezier(.4,0,.2,1);
          margin-right: 0.2rem;
        }
        .selector-btn.active, .selector-btn:focus, .selector-btn:hover {
          background: linear-gradient(90deg, #14b8a6 0%, #0ea5e9 100%);
          color: #fff;
          border-color: #0ea5e9;
          outline: none;
        }
        .selector-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .status-tab-btn {
          background: #f0fdfa;
          color: #0d9488;
          border: 1.5px solid #14b8a6;
          border-radius: 0.5rem;
          padding: 0.45rem 1.1rem;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.2s cubic-bezier(.4,0,.2,1);
        }
        .status-tab-btn.active, .status-tab-btn:focus, .status-tab-btn:hover {
          background: linear-gradient(90deg, #14b8a6 0%, #0ea5e9 100%);
          color: #fff;
          border-color: #0ea5e9;
          outline: none;
        }
        .tag-btn {
          background: #f5f5f4;
          color: #57534e;
          border-radius: 9999px;
          padding: 0.25rem 0.85rem;
          font-size: 0.95rem;
          font-weight: 500;
          border: 1.5px solid #e0e7ef;
          transition: all 0.2s cubic-bezier(.4,0,.2,1);
        }
        .tag-btn.selected, .tag-btn:focus, .tag-btn:hover {
          background: linear-gradient(90deg, #14b8a6 0%, #0ea5e9 100%);
          color: #fff;
          border-color: #0ea5e9;
          outline: none;
        }
        .page-btn {
          background: #f0fdfa;
          color: #0d9488;
          border: 1.5px solid #14b8a6;
          border-radius: 0.5rem;
          padding: 0.35rem 0.9rem;
          font-weight: 600;
          font-size: 1rem;
          margin: 0 0.1rem;
          transition: all 0.2s cubic-bezier(.4,0,.2,1);
        }
        .page-btn.active, .page-btn:focus, .page-btn:hover {
          background: linear-gradient(90deg, #14b8a6 0%, #0ea5e9 100%);
          color: #fff;
          border-color: #0ea5e9;
          outline: none;
        }
        .primary-btn {
          background-image: linear-gradient(45deg, #14b8a6, #0d9488);
          color: white;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px -3px rgba(13, 148, 136, 0.3);
        }
        .primary-btn:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 10px 20px -5px rgba(13, 148, 136, 0.4);
        }
        .create-job-btn {
          background: linear-gradient(90deg, #14b8a6 0%, #0ea5e9 100%);
          color: #fff;
          font-weight: 700;
          font-size: 1.1rem;
          padding: 0.7rem 1.6rem;
          border-radius: 0.9rem;
          border: none;
          outline: none;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          cursor: pointer;
          transition: background 0.18s cubic-bezier(.4,0,.2,1), filter 0.18s cubic-bezier(.4,0,.2,1);
        }
        .create-job-btn:hover, .create-job-btn:focus {
          background: linear-gradient(90deg, #0ea5e9 0%, #14b8a6 100%);
          filter: brightness(1.08);
        }
      `}</style>
      <div className="p-6 space-y-6 bg-slate-50">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                className="bg-slate-50 border-slate-200 pl-10 text-slate-800 placeholder:text-slate-400 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search jobs by title, skills, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button className={`selector-btn${view === "grid" ? " active" : ""}`} onClick={() => setView("grid")}> <Grid size={16} /> </button>
              <button className={`selector-btn${view === "list" ? " active" : ""}`} onClick={() => setView("list")}> <List size={16} /> </button>
              <button className="primary-btn gap-2" onClick={() => setOpen(true)}><span style={{display:'flex',alignItems:'center',gap:'0.5rem'}}><Plus size={18} />Create Job</span></button>
            </div>
          </div>
          <div className="flex gap-2 mt-2 mb-2">
            {['All', 'active', 'archived'].map(tab => (
              <button
                key={tab}
                className={`status-tab-btn${status === tab ? ' active' : ''}`}
                onClick={() => setStatus(tab as any)}
              >
                {tab === 'All' ? 'All Jobs' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`tag-btn${selectedTags.includes(tag) ? ' selected' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          {/* Pagination Bar - light mode, below search/tags/view */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="text-slate-700 text-sm">
              Showing <span className="font-semibold">{startJob}</span> to <span className="font-semibold">{endJob}</span> of <span className="font-semibold">{total}</span> jobs
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-700 text-sm">Show:</span>
              <select
                className="bg-slate-50 text-slate-700 rounded px-3 py-1 border border-slate-200 focus:outline-none"
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
              >
                {pageSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              {/* Pagination Buttons */}
              <div className="flex items-center gap-1">
                <button
                  className={`page-btn${page === 1 ? ' opacity-50 cursor-not-allowed' : ''}`}
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  &lt; Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`page-btn${page === i + 1 ? ' active' : ''}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className={`page-btn${page === totalPages ? ' opacity-50 cursor-not-allowed' : ''}`}
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Drag-and-drop for LIST view (using dnd-kit) --- */}
        {view === "list" ? (
          <DndContext
            sensors={useSensors(useSensor(PointerSensor))}
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (active.id !== over?.id) {
                const oldIndex = dragList.findIndex((j) => j.id === active.id);
                const newIndex = dragList.findIndex((j) => j.id === over?.id);
                const newOrder = arrayMove(dragList, oldIndex, newIndex);
                handleReorder(newOrder, oldIndex, newIndex);
              }
            }}
          >
            <SortableContext items={dragList.map((j) => j.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {loading
                  ? Array.from({ length: pageSize }).map((_, index) => <JobCardSkeleton key={index} />)
                  : dragList.map((job) => (
                      <SortableListJobCard key={job.id} job={job} id={job.id} />
                    ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          /* --- Drag-and-drop for GRID view (using dnd-kit) --- */
          <DndContext
            sensors={useSensors(useSensor(PointerSensor))}
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (active.id !== over?.id) {
                const oldIndex = dragList.findIndex((j) => j.id === active.id);
                const newIndex = dragList.findIndex((j) => j.id === over?.id);
                const newOrder = arrayMove(dragList, oldIndex, newIndex);
                handleReorder(newOrder, oldIndex, newIndex);
              }
            }}
          >
            <SortableContext items={dragList.map((j) => j.id)} strategy={rectSortingStrategy}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading
                  ? Array.from({ length: pageSize }).map((_, index) => <JobCardSkeleton key={index} />)
                  : dragList.map((job) => (
                      <SortableJobCard key={job.id} job={job} id={job.id} />
                    ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {open && <CreateJobModal open={open} onClose={() => setOpen(false)} />}
      </div>
    </Layout>
  );
}