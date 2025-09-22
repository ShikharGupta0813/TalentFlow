import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

type JobForm = {
  title: string;
  slug?: string;
  location: string;
  type: string;
  status: string;
  description: string;
  requirements: string[];
  tags: string[];
};

export default function CreateJobModal({
  open,
  onClose,
  onCreated, // parent callback after job is created
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}) {
  const [form, setForm] = useState<JobForm>({
    title: "",
    location: "",
    type: "Full-time",
    status: "Active",
    description: "",
    requirements: [""],
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof JobForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const updated = [...form.requirements];
    updated[index] = value;
    handleChange("requirements", updated);
  };

  const addRequirement = () => {
    handleChange("requirements", [...form.requirements, ""]);
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      handleChange("tags", [...form.tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    handleChange(
      "tags",
      form.tags.filter((t) => t !== tag)
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await fetch("/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create job");
      await res.json();

      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      console.error("Error creating job:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#0f172a] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Job</DialogTitle>
          <p className="text-sm text-gray-400">
            Fill in the details to create a new job posting.
          </p>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Job Title */}
          <div>
            <label className="text-sm">Job Title *</label>
            <Input
              placeholder="e.g. Senior Software Engineer"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="bg-gray-900 border-gray-700 mt-1"
            />
          </div>

          {/* Location + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Location *</label>
              <Input
                placeholder="e.g. San Francisco, CA"
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="bg-gray-900 border-gray-700 mt-1"
              />
            </div>
            <div>
              <label className="text-sm">Job Type *</label>
              <Select
                value={form.type}
                onValueChange={(val) => handleChange("type", val)}
              >
                <SelectTrigger className="bg-gray-900 border-gray-700 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm">Status</label>
            <Select
              value={form.status}
              onValueChange={(val) => handleChange("status", val)}
            >
              <SelectTrigger className="bg-gray-900 border-gray-700 mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job Description */}
          <div>
            <label className="text-sm">Job Description *</label>
            <Textarea
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="bg-gray-900 border-gray-700 mt-1"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="text-sm">Requirements *</label>
            <div className="space-y-2">
              {form.requirements.map((req, idx) => (
                <Input
                  key={idx}
                  placeholder={`Requirement ${idx + 1}`}
                  value={req}
                  onChange={(e) => handleRequirementChange(idx, e.target.value)}
                  className="bg-gray-900 border-gray-700"
                />
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              className="mt-2 bg-black border border-gray-700"
              onClick={addRequirement}
            >
              + Add Requirement
            </Button>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm">Tags</label>
            <Input
              placeholder="Type a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              className="bg-gray-900 border-gray-700 mt-1"
            />
            <div className="flex gap-2 flex-wrap mt-2">
              {form.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    className="text-red-400 text-xs"
                    onClick={() => removeTag(tag)}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
