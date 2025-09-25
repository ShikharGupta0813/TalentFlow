import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Candidate, CandidateStage } from "@/mock/type";
import { db } from "@/mock/db";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Phone,
  Calendar,
  List,
  LayoutGrid,
  Users,
  CheckCircle2,
  XCircle,
  Hourglass,
  Search,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Plus,
} from "lucide-react";
import Layout from "@/components/layout";
import KannuBannu from "@/components/kannubannu";
import { format } from "date-fns";
import CandidateModal from "../components/CandidateModal";

const getStageBadgeStyle = (stage: CandidateStage) => {
  switch (stage) {
    case "hired": return "bg-green-100 text-green-800 border-green-200/80";
    case "rejected": return "bg-red-100 text-red-800 border-red-200/80";
    case "offer": return "bg-blue-100 text-blue-800 border-blue-200/80";
    case "tech": return "bg-purple-100 text-purple-800 border-purple-200/80";
    case "screen": return "bg-orange-100 text-orange-800 border-orange-200/80";
    case "applied":
    default: return "bg-slate-100 text-slate-800 border-slate-200/80";
  }
};

export default function CandidatesList() {
  // Mouse-move border glow effect for candidate cards
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const navigate = useNavigate();
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("All");
  const [job, setJob] = useState("All Jobs");
  const [view, setView] = useState<"list" | "kanban">("list");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const candidatesFromDb = await db.candidates.toArray();
      setAllCandidates(candidatesFromDb);
      setLoading(false);
    })();
  }, []);

  const refreshCandidates = async () => {
    setAllCandidates(await db.candidates.toArray());
  };

  const filteredCandidates = useMemo(() => {
    return allCandidates.filter((c) => {
      const searchLower = search.toLowerCase();
      const nameMatch = c.name.toLowerCase().includes(searchLower);
      const emailMatch = c.email.toLowerCase().includes(searchLower);
      const stageMatch = stage === "All" || c.stage.toLowerCase() === stage.toLowerCase();
      const jobMatch = job === "All Jobs" || c.jobTitle === job;
      return (nameMatch || emailMatch) && stageMatch && jobMatch;
    });
  }, [allCandidates, search, stage, job]);

  const paginatedCandidates = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCandidates.slice(start, start + pageSize);
  }, [filteredCandidates, page, pageSize]);

  const totalPages = Math.ceil(filteredCandidates.length / pageSize);
  const total = allCandidates.length;
  const hired = allCandidates.filter((c) => c.stage === "hired").length;
  const rejected = allCandidates.filter((c) => c.stage === "rejected").length;
  const inProgress = total - hired - rejected;

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } }, };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 }, };

  const startItem = filteredCandidates.length > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = Math.min(page * pageSize, filteredCandidates.length);

  return (
    <Layout>
      <style>{`
        .candidate-card-glow {
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.3s, border-color 0.3s;
        }
        .candidate-card-glow::before {
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
        .candidate-card-glow:hover::before {
          width: 420px;
          height: 420px;
          opacity: 1;
        }
        .candidate-card-glow:hover {
          border-color: #0ea5e9;
          box-shadow: 0 8px 32px -8px rgba(14,165,233,0.18), 0 2px 8px -2px rgba(20,184,166,0.10);
        }
      `}</style>
        <style>{`
          .add-candidate-btn {
            background: linear-gradient(90deg, #14b8a6 0%, #0d9488 100%);
            color: #fff;
            font-weight: 700;
            font-size: 1.08rem;
            padding: 0.7rem 1.6rem;
            border-radius: 0.9rem;
            border: none;
            outline: none;
            display: flex;
            align-items: center;
            gap: 0.7rem;
            cursor: pointer;
            transition: background 0.18s cubic-bezier(.4,0,.2,1), filter 0.18s cubic-bezier(.4,0,.2,1);
            box-shadow: 0 4px 15px -3px rgba(37,99,235,0.13);
          }
          .add-candidate-btn:hover, .add-candidate-btn:focus {
            background: linear-gradient(90deg, #14b8a6 0%, #0d9488 100%);
            filter: brightness(1.08);
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
        `}</style>
      <div className="p-6 space-y-6 bg-slate-50">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Candidates</h1>
            <p className="text-slate-500 mt-1">Manage and track your entire talent pipeline.</p>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="add-candidate-btn"
          >
            <Plus size={18} /> Add Candidate
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border-slate-200 flex items-center gap-4"><Users className="text-blue-500 h-8 w-8" /><div><p className="text-sm text-slate-500">Total Candidates</p><h2 className="text-2xl font-bold text-slate-800">{total}</h2></div></Card>
          <Card className="p-4 bg-white border-slate-200 flex items-center gap-4"><CheckCircle2 className="text-green-500 h-8 w-8" /><div><p className="text-sm text-slate-500">Hired</p><h2 className="text-2xl font-bold text-slate-800">{hired}</h2></div></Card>
          <Card className="p-4 bg-white border-slate-200 flex items-center gap-4"><XCircle className="text-red-500 h-8 w-8" /><div><p className="text-sm text-slate-500">Rejected</p><h2 className="text-2xl font-bold text-slate-800">{rejected}</h2></div></Card>
          <Card className="p-4 bg-white border-slate-200 flex items-center gap-4"><Hourglass className="text-yellow-500 h-8 w-8" /><div><p className="text-sm text-slate-500">In Progress</p><h2 className="text-2xl font-bold text-slate-800">{inProgress}</h2></div></Card>
        </div>

        {/* Filters */}
        <Card className="p-4 bg-white border-slate-200">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative w-full md:w-auto md:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                className="pl-10 bg-slate-50"
              />
            </div>
            <Select onValueChange={(val) => { setPage(1); setStage(val); }} defaultValue={stage}>
              <SelectTrigger className="w-full md:w-40 bg-slate-50">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Stages</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="screen">Screen</SelectItem>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(val) => { setPage(1); setJob(val); }} defaultValue={job}>
              <SelectTrigger className="w-full md:w-48 bg-slate-50">
                <SelectValue placeholder="Job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Jobs">All Jobs</SelectItem>
                {[...new Set(allCandidates.map((c) => c.jobTitle))].map((jobTitle) => (
                  <SelectItem key={jobTitle} value={jobTitle}>{jobTitle}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="ml-auto flex items-center gap-2">
              <button
                className={`selector-btn${view === "list" ? " active" : ""}`}
                onClick={() => setView("list")}
                aria-label="List view"
              >
                <List size={18} />
              </button>
              <button
                className={`selector-btn${view === "kanban" ? " active" : ""}`}
                onClick={() => setView("kanban")}
                aria-label="Grid view"
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        </Card>

        {/* Candidate List */}
        {view === "list" ? (
          <>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
              <motion.div variants={containerVariants} initial="hidden" animate="show">
                {paginatedCandidates.map((c) => (
                  <motion.div
                    key={c.id}
                    variants={itemVariants}
                    onClick={() => navigate(`/candidates/${c.id}`)}
                    style={{ '--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px` } as React.CSSProperties}
                    className="candidate-card-glow grid grid-cols-6 items-center p-4 border-b border-slate-100 last:border-b-0 cursor-pointer transition-all duration-300"
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for candidate ${c.name}`}
                    onMouseMove={handleMouseMove}
                  >
                    <div className="col-span-2 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 flex-shrink-0">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{c.name}</p>
                        <p className="text-sm text-slate-500 flex items-center gap-1.5"><Mail size={14} />{c.email}</p>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600 flex items-center gap-2"><Briefcase size={14} /> {c.jobTitle}</div>
                    <div><Badge className={`capitalize ${getStageBadgeStyle(c.stage)}`}>{c.stage}</Badge></div>
                    <div className="text-sm text-slate-600 flex items-center gap-2"><Phone size={14} /> {c.phone}</div>
                    <div className="text-sm text-slate-500 flex items-center gap-2 justify-end"><Calendar size={14} /> {format(new Date(c.appliedDate), "MMM d, yyyy")}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{filteredCandidates.length}</strong> candidates
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                  <ChevronLeft size={16} className="mr-1" /> Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page === totalPages || totalPages === 0}>
                  <ChevronRight size={16} className="ml-1" /> Next
                </Button>
              </div>
            </div>
          </>
        ) : (
          <KannuBannu candidates={filteredCandidates} />
        )}

        {/* Candidate Modal */}
        <CandidateModal open={openModal} onClose={() => setOpenModal(false)} onAdded={refreshCandidates} />
      </div>
    </Layout>
  );
}
