import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Calendar } from "lucide-react";

export default function CandidateProfile() {
  const { jobId, candidateId } = useParams();

  // Dummy candidate fetch
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

  const candidate = candidates.find((c) => c.id.toString() === candidateId);

  if (!candidate) return <div className="p-6 text-white">Candidate not found</div>;

  return (
    <div className="p-6 text-white space-y-6">
      {/* Header */}
      <Card className="p-6 bg-slate-900 border border-slate-800">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{candidate.name}</h1>
            <p className="text-slate-400">Candidate Profile</p>
          </div>
          <span
            className={`px-4 py-1 text-sm rounded-full ${
              candidate.status === "Hired"
                ? "bg-green-600"
                : candidate.status === "Rejected"
                ? "bg-red-600"
                : "bg-slate-700"
            }`}
          >
            {candidate.status}
          </span>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6 bg-slate-900 border border-slate-800">
        <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
        <p className="flex items-center gap-2 text-slate-300">
          <Mail size={16} /> {candidate.email}
        </p>
        <p className="flex items-center gap-2 text-slate-300">
          <Phone size={16} /> {candidate.phone}
        </p>
        <p className="flex items-center gap-2 text-slate-300">
          <Calendar size={16} /> Applied {candidate.appliedDate}
        </p>
      </Card>

      {/* Application Summary */}
      <Card className="p-6 bg-slate-900 border border-slate-800">
        <h2 className="text-lg font-semibold mb-4">Application Summary</h2>
        <div className="grid grid-cols-2 gap-4 text-slate-300">
          <p>Current Stage: {candidate.status}</p>
          <p>Days Since Applied: 1</p>
          <p>Assessments: 0</p>
          <p>Notes: 0</p>
          <p>Timeline Events: 1</p>
        </div>
      </Card>
    </div>
  );
}
