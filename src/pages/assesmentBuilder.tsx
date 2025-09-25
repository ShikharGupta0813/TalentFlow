// AssessmentBuilder.tsx
import { useAssessmentBuilder } from "@/hooks/useAssessmentBuilder";
import Layout from "@/components/layout";
import Toolbar from "@/components/Toolbar";
import SectionList from "@/components/SectionList";
import QuestionList from "@/components/QuestionList";
import QuestionEditor from "@/components/QuestionEditor";
import Preview from "@/components/LivePreview";
import QuestionTypeModal from "@/components/QuestionTypeModal";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useParams } from "react-router-dom";

type AssessmentBuilderProps = {
  initialAssessment?: any; // passed directly when editing
  jobId?: number; // optional when creating new
};

export default function AssessmentBuilder({
  initialAssessment,
}: AssessmentBuilderProps) {
  const builder = useAssessmentBuilder(initialAssessment);
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  // --- Save handler (create or update) ---
  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = builder.assessment;
      delete payload.id; 

      let res;
      if (initialAssessment?.id) {
        // --- Edit mode (update existing assessment) ---
        res = await fetch(`/assessments/${initialAssessment.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else if (jobId) {
        // --- Create mode (new assessment for a job) ---
        res = await fetch(`/assessments/${jobId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res?.ok) throw new Error("Failed to save assessment");

      const saved = await res.json();
      builder.markSaved(saved); // ✅ reset unsaved state
      navigate("/assessments");
    } catch (e) {
      console.error("Save failed:", e);
      alert("Failed to save assessment. Try again.");
    } finally {
      setSaving(false);
    }
  };

  // --- Preview Mode ---
  if (builder.showPreview) {
    return (
      <Layout>
        <Preview
          builder={builder}
          onBack={() => builder.setShowPreview(false)}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col min-h-screen bg-slate-900 text-white">
        {/* Header with Back */}
        {/* Header with Back */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <button
            className="text-slate-400 hover:text-white text-sm"
            onClick={() => navigate(-1)} // ✅ Go back to previous page
          >
            ← Back
          </button>
          <h1 className="text-xl font-semibold truncate">
            {builder.assessment.title || "New Assessment"}
          </h1>
        </div>

        {/* Toolbar (Save, Preview, etc.) */}
        <Toolbar builder={builder} onSave={handleSave} saving={saving} />

        {/* Builder Workspace: 3-column layout */}
        <div className="flex flex-1 overflow-hidden">
          <SectionList builder={builder} />
          <QuestionList builder={builder} section={selectedSection(builder)} />
          <QuestionEditor
            builder={builder}
            section={selectedSection(builder)}
            question={selectedQuestion(builder)}
          />
        </div>

        {/* Question Type Modal */}
        <QuestionTypeModal builder={builder} />
      </div>
    </Layout>
  );
}

// --- Helpers to keep render clean ---
function selectedSection(builder: any) {
  return (
    builder.assessment.sections.find(
      (s: any) => s.id === builder.selectedSectionId
    ) || null
  );
}

function selectedQuestion(builder: any) {
  const section = selectedSection(builder);
  return (
    section?.questions.find((q: any) => q.id === builder.selectedQuestionId) ||
    null
  );
}
