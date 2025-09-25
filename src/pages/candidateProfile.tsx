// src/pages/candidateprofile.tsx

import { useEffect, useState } from "react";
// MODIFIED: Imported useNavigate and ArrowLeft
import { useParams, useNavigate } from "react-router";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Calendar, Briefcase, ChevronDown, ArrowLeft } from "lucide-react";
import {  Candidate, Note, TimelineEvent, CandidateStage } from "@/mock/type";
import { db } from "@/mock/db";
import Layout from "@/components/layout";
import CandidateTimeline from "@/components/CandidatesTimeline";
import CandidateNotes from "@/components/CandidatesNotes";
import { motion } from "framer-motion";

// --- Helper function for dynamic status badge styling ---
const getStatusBadgeClass = (stage: string) => {
  switch (stage.toLowerCase()) {
    case "hired":
      return "bg-green-100 text-green-800 border-green-200 focus:ring-green-500";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200 focus:ring-red-500";
    case "screen":
      return "bg-blue-100 text-blue-800 border-blue-200 focus:ring-blue-500";
    case "tech":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 focus:ring-yellow-500";
    case "offer":
        return "bg-purple-100 text-purple-800 border-purple-200 focus:ring-purple-500";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200 focus:ring-slate-500";
  }
};

// --- A simple skeleton component for a better loading experience ---
const LoadingSkeleton = () => (
  <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
    <div className="lg:col-span-3 h-8 w-1/4 bg-slate-200 rounded-lg mb-4"></div>
    <div className="lg:col-span-2 space-y-6">
      <div className="h-28 bg-slate-200 rounded-lg"></div>
      <div className="h-36 bg-slate-200 rounded-lg"></div>
      <div className="h-64 bg-slate-200 rounded-lg"></div>
    </div>
    <div className="space-y-6">
      <div className="h-48 bg-slate-200 rounded-lg"></div>
      <div className="h-64 bg-slate-200 rounded-lg"></div>
    </div>
  </div>
);

export default function CandidateProfile() {
  const { candidateId } = useParams();
  const navigate = useNavigate(); // ADDED: For navigation
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [stage, setStage] = useState<CandidateStage | "">("");
  const allStages: CandidateStage[] = [ "applied", "screen", "tech", "offer", "hired", "rejected" ];
  const [notes, setNotes] = useState<Note[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    if (!candidateId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const c = await db.candidates.get(Number(candidateId));
        if (c) {
          setCandidate(c);
          setStage(c.stage);
          const n = await db.notes.where("candidateId").equals(c.id!).reverse().sortBy("createdAt");
          const t = await db.timeline.where("candidateId").equals(c.id!).reverse().sortBy("createdAt");
          setNotes(n);
          setTimeline(t);
        }
      } catch (error) {
        console.error("Failed to load candidate data:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [candidateId]);

  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleStageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStage = e.target.value as CandidateStage;
    if (!candidate || !candidate.id) return;

    const prevStage = candidate.stage;
    setStage(newStage);

    await db.candidates.update(candidate.id, { stage: newStage });
    setCandidate({ ...candidate, stage: newStage });

    await db.timeline.add({
      candidateId: candidate.id,
      type: "stage-change",
      description: `Stage changed from ${prevStage} to ${newStage}`,
      createdAt: new Date().toISOString(),
      author: "Sarah Mitchell",
      fromStage: prevStage,
      toStage: newStage,
    });

    const updatedTimeline = await db.timeline
      .where("candidateId")
      .equals(candidate.id)
      .reverse()
      .sortBy("createdAt");
    setTimeline(updatedTimeline);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  if (loading) {
    return ( <Layout> <LoadingSkeleton /> </Layout> );
  }

  if (!candidate) {
    return (
      <Layout>
        <div className="p-6 text-center text-slate-600">
          <h2 className="text-2xl font-bold">Candidate Not Found</h2>
          <p>The candidate you are looking for does not exist.</p>
        </div>
      </Layout>
    );
  }

  const daysSinceApplied = Math.floor((Date.now() - new Date(candidate.appliedDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Layout>
      <motion.div
        onMouseMove={handleMouseMove}
        className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className="pointer-events-none fixed inset-0 z-30 transition duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${
              isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.04)'
            }, transparent 80%)`,
          }}
        />

        {/* ## NEW: Back Button ## */}
        <motion.button
          onClick={() => navigate("/candidates")}
          className="flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-500 transition-colors duration-300 mb-4"
          variants={itemVariants}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Candidates
        </motion.button>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <motion.div variants={itemVariants}>
              <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                      {candidate.name}
                    </h1>
                    <p className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mt-1">
                      <Briefcase size={16} /> {candidate.jobTitle}
                    </p>
                  </div>
                  <div className="relative">
                    <select
                      value={stage}
                      onChange={handleStageChange}
                      className={`pl-4 pr-10 py-1.5 text-sm font-semibold rounded-full capitalize border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${getStatusBadgeClass(
                        stage
                      )}`}
                    >
                      {allStages.map((s) => (
                        <option key={s} value={s} className="font-semibold text-slate-800">
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-current" />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Contact */}
            <motion.div variants={itemVariants}>
              <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                  Contact Information
                </h2>
                <div className="space-y-3">
                  <p className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <Mail size={18} className="text-slate-400" /> {candidate.email}
                  </p>
                  <p className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <Phone size={18} className="text-slate-400" /> {candidate.phone}
                  </p>
                  <p className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <Calendar size={18} className="text-slate-400" />
                    Applied on {new Date(candidate.appliedDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Timeline Component */}
            {candidate.id !== undefined && (
              <motion.div variants={itemVariants}>
                <CandidateTimeline candidateId={candidate.id} timeline={timeline} />
              </motion.div>
            )}
          </div>

          {/* Right Section */}
          <div className="space-y-6">
            {/* Application Summary */}
            <motion.div variants={itemVariants}>
              <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                  Application Summary
                </h2>
                <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                     <li className="flex justify-between"><span>Current Stage:</span> <span className="font-semibold text-slate-800 dark:text-slate-100 capitalize">{stage}</span></li>
                     <li className="flex justify-between"><span>Days Since Applied:</span> <span className="font-semibold text-slate-800 dark:text-slate-100">{daysSinceApplied}</span></li>
                     <li className="flex justify-between"><span>Assessments:</span> <span className="font-semibold text-slate-800 dark:text-slate-100">0</span></li>
                     <li className="flex justify-between"><span>Notes:</span> <span className="font-semibold text-slate-800 dark:text-slate-100">{notes.length}</span></li>
                     <li className="flex justify-between"><span>Timeline Events:</span> <span className="font-semibold text-slate-800 dark:text-slate-100">{timeline.length}</span></li>
                </ul>
              </Card>
            </motion.div>

            {/* Notes Component */}
            {candidate.id !== undefined && (
              <motion.div variants={itemVariants}>
                  <CandidateNotes candidateId={candidate.id} />
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}