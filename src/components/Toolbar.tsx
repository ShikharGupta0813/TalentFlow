import { Eye, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ToolbarProps = {
  builder: any;
  onSave: () => Promise<void>;
  saving: boolean;
};

export default function Toolbar({ builder, onSave, saving }: ToolbarProps) {
  return (
    <div className="flex justify-between items-center border-b border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold">Assessment Builder</h2>
      </div>

      <div className="flex gap-2 items-center">
        {builder.unsavedChanges && (
          <span className="text-orange-500">Unsaved Changes</span>
        )}

        {/* Preview Button */}
        <Button
          variant="outline"
          onClick={() => builder.setShowPreview(true)}
          disabled={saving}
        >
          <Eye className="mr-2 h-4 w-4" /> Preview
        </Button>

        {/* Save Button */}
        <Button onClick={onSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
