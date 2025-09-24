export type JobStatus = "active" | "archived";
export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";

export interface Job {
  id?: number;
  title: string;
  slug: string;
  status: JobStatus;
  type: JobType;
  location: string;
  description: string;
  requirements: string[];
  tags: string[];
  order: number;
}

export type CandidateStage =
  | "applied"
  | "screen"
  | "tech"
  | "offer"
  | "hired"
  | "rejected";

export interface Candidate {
  id?: number;
  jobId: number;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  appliedDate: string;
  stage: CandidateStage;
}

export interface Note {
  id?: number;
  candidateId: number;
  author: string;
  content: string;
  createdAt: string;
}
export interface Question {
  id: number;
  type: "single-choice" | "multiple-choice" | "short-text" | "long-text" | "numeric" | "file-upload";
  title: string;
  description? :string;
  options?: string[]; // for choice questions
  validationRules?: {
    required?: boolean;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  conditional?: {
    questionId: string;
    value: string | number;
  };
}
export interface Section {
  id: number;
  title: string;
  questions: Question[];
}

export interface UserResponse {
  id: number;
  assessmentId: number;
  questionId: number;
  answer: string | number | string[];
  createdAt: string;
}

// ✅ Notes

export interface Assessment {
  id: number;                // unique id
  jobId: number;             // link to job
  title: string;
  description:string,
  role: string;
  duration: string; // computed, can store
  submissions:number,
  status: "Active" | "Draft";
  sections: Section[];       // real structure
  totalQuestions: number;
}

// ✅ Timeline Events
export interface TimelineEvent {
  id?: number;
  candidateId: number;
  type: "system" | "note" | "stage-change";
  description: string;
  createdAt: string;
  author?: string;
  fromStage?: CandidateStage;
  toStage?: CandidateStage;
}