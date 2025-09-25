import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Toolbar({ builder, onSave, saving }: any) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-slate-800">
      {/* Assessment Title */}
      <input
        className="px-2 py-1 rounded bg-slate-800 text-white border border-slate-700"
        value={builder.assessment.title}
        onChange={(e) =>
          builder.setAssessment((prev: any) => ({
            ...prev,
            title: e.target.value,
          }))
        }
        placeholder="Assessment title"
      />

      {/* Job Title */}
      <input
        className="px-2 py-1 rounded bg-slate-800 text-white border border-slate-700"
        value={builder.assessment.role}
        onChange={(e) =>
          builder.setAssessment((prev: any) => ({
            ...prev,
            role: e.target.value,
          }))
        }
        placeholder="Job Title / Role"
      />

      {/* Status Badge */}
      <Badge
        className={
          builder.assessment.status === "Active"
            ? "bg-green-600 text-white"
            : "bg-slate-600 text-white"
        }
      >
        {builder.assessment.status === "Active" ? "Active" : "Draft"}
      </Badge>

      {/* Save (Publish) button */}
      <Button
        className="bg-green-600 hover:bg-green-700"
        onClick={onSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save"}
      </Button>

      {/* Save Draft button ONLY when draft (no navigation) */}
      {builder.assessment.status === "Draft" && (
        <Button
          className="bg-slate-600 hover:bg-slate-700"
          onClick={() => builder.saveDraft()}
        >
          Save Draft
        </Button>
      )}

      {/* Preview button */}
      <Button
        className="bg-blue-600 hover:bg-blue-700"
        onClick={() => builder.setShowPreview(true)}
      >
        Preview
      </Button>
    </div>
  );
}
