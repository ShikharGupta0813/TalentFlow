import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Candidate, CandidateStage } from "@/mock/type";
import { db } from "@/mock/db";

interface CandidateModalProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export default function CandidateModal({
  open,
  onClose,
  onAdded,
}: CandidateModalProps) {
  const [jobs, setJobs] = useState<string[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [newCandidate, setNewCandidate] = useState<Candidate>({
    jobId: 0,
    jobTitle: "",
    name: "",
    email: "",
    phone: "",
    appliedDate: new Date().toISOString(),
    stage: "applied",
  });

  // fetch jobs from db
  useEffect(() => {
    (async () => {
      const jobsFromDb = await db.jobs.toArray();
      const sortedTitles = jobsFromDb
        .map((j) => j.title)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));
      setJobs(sortedTitles);
    })();
  }, []);

  // validation check
  const isValid =
    newCandidate.name.trim() &&
    newCandidate.email.trim() &&
    newCandidate.phone.trim() &&
    newCandidate.jobTitle.trim() &&
    newCandidate.stage.trim();

  const handleSave = async () => {
    if (!isValid) return;
    await db.candidates.add({
      ...newCandidate,
      appliedDate: new Date().toISOString(),
    });
    setNewCandidate({
      jobId: 0,
      jobTitle: "",
      name: "",
      email: "",
      phone: "",
      appliedDate: new Date().toISOString(),
      stage: "applied",
    });
    onAdded();
    onClose();
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white border border-slate-200 rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-slate-800">Add Candidate</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Name */}
          <div>
            <Label className="text-slate-600">Name</Label>
            <Input
              value={newCandidate.name}
              onChange={(e) =>
                setNewCandidate({ ...newCandidate, name: e.target.value })
              }
              onBlur={() => handleBlur("name")}
              placeholder="Enter full name"
              className={`bg-slate-50 ${
                touched.name && !newCandidate.name.trim()
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
            />
            {touched.name && !newCandidate.name.trim() && (
              <p className="text-xs text-red-500 mt-1">Name is required.</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label className="text-slate-600">Email</Label>
            <Input
              type="email"
              value={newCandidate.email}
              onChange={(e) =>
                setNewCandidate({ ...newCandidate, email: e.target.value })
              }
              onBlur={() => handleBlur("email")}
              placeholder="Enter email"
              className={`bg-slate-50 ${
                touched.email && !newCandidate.email.trim()
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
            />
            {touched.email && !newCandidate.email.trim() && (
              <p className="text-xs text-red-500 mt-1">Email is required.</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label className="text-slate-600">Phone</Label>
            <Input
              value={newCandidate.phone}
              onChange={(e) =>
                setNewCandidate({ ...newCandidate, phone: e.target.value })
              }
              onBlur={() => handleBlur("phone")}
              placeholder="Enter phone number"
              className={`bg-slate-50 ${
                touched.phone && !newCandidate.phone.trim()
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
            />
            {touched.phone && !newCandidate.phone.trim() && (
              <p className="text-xs text-red-500 mt-1">Phone is required.</p>
            )}
          </div>

          {/* Job Title */}
          <div>
            <Label className="text-slate-600">Job Title</Label>
            <Select
              value={newCandidate.jobTitle}
              onValueChange={(val) =>
                setNewCandidate({ ...newCandidate, jobTitle: val })
              }
              onOpenChange={() => handleBlur("jobTitle")}
            >
              <SelectTrigger
                className={`bg-slate-50 ${
                  touched.jobTitle && !newCandidate.jobTitle.trim()
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
              >
                <SelectValue placeholder="Select Job" />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {touched.jobTitle && !newCandidate.jobTitle.trim() && (
              <p className="text-xs text-red-500 mt-1">Job title is required.</p>
            )}
          </div>

          {/* Stage */}
          <div>
            <Label className="text-slate-600">Stage</Label>
            <Select
              value={newCandidate.stage}
              onValueChange={(val) =>
                setNewCandidate({ ...newCandidate, stage: val as CandidateStage })
              }
              onOpenChange={() => handleBlur("stage")}
            >
              <SelectTrigger
                className={`bg-slate-50 ${
                  touched.stage && !newCandidate.stage.trim()
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
              >
                <SelectValue placeholder="Select Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="screen">Screen</SelectItem>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            {touched.stage && !newCandidate.stage.trim() && (
              <p className="text-xs text-red-500 mt-1">Stage is required.</p>
            )}
          </div>
        </div>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSave}
            disabled={!isValid}
          >
            Save Candidate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
