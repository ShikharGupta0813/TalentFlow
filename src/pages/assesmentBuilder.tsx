// AssessmentBuilder.tsx
import { useAssessmentBuilder } from "@/hooks/useAssessmentBuilder";
import Layout from "@/components/layout";
import Toolbar from "@/components/Toolbar";
import SectionList from "@/components/SectionList";
import QuestionList from "@/components/QuestionList";
import QuestionEditor from "@/components/QuestionEditor";
import Preview from "@/components/LivePreview";
import QuestionTypeModal from "@/components/QuestionTypeModal";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { removeState } from "@/lib/storage";
// MODIFIED: Imported the ArrowLeft icon
import { ArrowLeft } from "lucide-react";

type AssessmentBuilderProps = {
  initialAssessment?: any;
  jobId?: number;
};

export default function AssessmentBuilder({
  initialAssessment,
}: AssessmentBuilderProps) {
  const builder = useAssessmentBuilder(initialAssessment);
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        ...builder.assessment,
        status: "Active",
      };
      delete payload.id;

      let res;
      if (initialAssessment?.id) {
        res = await fetch(`/assessments/${initialAssessment.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else if (jobId) {
        res = await fetch(`/assessments/${jobId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res?.ok) throw new Error("Failed to save assessment");

      const saved = await res.json();
      builder.markSaved(saved);
      removeState("assessment-draft");
      navigate("/assessments");
    } catch (e) {
      console.error("Save failed:", e);
      alert("Failed to save assessment. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = () => {
    builder.setAssessment((prev: any) => ({
      ...prev,
      status: "Draft",
    }));
    builder.saveAssessment();
  };

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

  function onBack() {
    navigate(-1);
  }

  return (
    <Layout>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
        {/* Header with Back */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          {/* MODIFIED: Replaced the old button with the new styled Button component */}
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="text-slate-500">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          )}
          <h1 className="text-xl font-semibold truncate">
            {builder.assessment.title || "New Assessment"}
          </h1>
        </div>

        {/* Toolbar (Save, Preview, etc.) */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-200 bg-white">
          <Toolbar builder={builder} onSave={handleSave} saving={saving} />
        </div>

        {/* Builder Workspace: 3-column layout */}
        <div className="flex flex-1 overflow-hidden bg-slate-50">
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