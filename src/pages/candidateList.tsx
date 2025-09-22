import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Mail, Phone, Calendar } from "lucide-react";
import Layout from "@/components/layout";

export default function CandidatesList() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const jobs = api.getJobs();
  const job = jobs.find((j: any) => j.id.toString() === jobId);

  if (!job) return <div className="p-6 text-white">Job not found</div>;

  // Dummy candidates for now
  const candidates = [
    {
      id: 1,
      name: "Finley Thompson",
      email: "finley.thompson@example.com",
      phone: "+1-879-379-6024",
      appliedDate: "Sep 21, 2025",
      status: "Rejected",
    },
    {
      id: 2,
      name: "Avery Walker",
      email: "avery.walker@example.com",
      phone: "+1-789-444-1200",
      appliedDate: "Sep 22, 2025",
      status: "Hired",
    },
  ];

  return (
    
    <Layout>
    <div className="p-6 text-purple-500">
      <h1 className="text-2xl font-bold mb-4">Candidates for {job.title}</h1>
      <div className="space-y-4">
        {candidates.map((c) => (
          <Card
            key={c.id}
            onClick={() => navigate(`/candidates/${job.id}/${c.id}`)}
            className="p-4 bg-slate-900 border border-slate-800 cursor-pointer hover:shadow-lg"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg text-purple-700 font-semibold">{c.name}</h2>
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <Mail size={16} /> {c.email}
                </p>
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <Phone size={16} /> {c.phone}
                </p>
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <Calendar size={16} /> Applied {c.appliedDate}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  c.status === "Hired"
                    ? "bg-green-600"
                    : c.status === "Rejected"
                    ? "bg-red-600"
                    : "bg-slate-700"
                }`}
              >
                {c.status}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
    </Layout>
    
  );
}
