// db.ts
import Dexie, { Table } from "dexie";

// ------------------ Types ------------------
export type JobStatus = "active" | "archived";
export type CandidateStage =
  | "applied"
  | "screen"
  | "tech"
  | "offer"
  | "hired"
  | "rejected";

export interface Job {
  id?: number;
  title: string;
  slug: string;
  status: JobStatus;
  tags: string[];
  order: number;
}

export interface Candidate {
  id?: number;
  jobId: number;
  name: string;
  email: string;
  stage: CandidateStage;
}

export interface Assessment {
  jobId: number;
  questions: { id: string; text: string; options: string[] }[];
  responses?: Record<string, string>;
}

// ------------------ Dexie DB ------------------
class AppDB extends Dexie {
  jobs!: Table<Job, number>;
  candidates!: Table<Candidate, number>;
  assessments!: Table<Assessment, number>;

  constructor() {
    super("MockHRDB");
    this.version(1).stores({
      jobs: "++id, title, slug, status, order",
      candidates: "++id, jobId, name, email, stage",
      assessments: "jobId"
    });
  }
}

export const db = new AppDB();

// ------------------ Helpers ------------------
function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-");
}

// Arrays for candidate generation
const FIRST_NAMES = [
  "John",
  "Alice",
  "David",
  "Sophia",
  "Michael",
  "Emma",
  "Daniel",
  "Olivia",
  "James",
  "Ava"
];

const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Brown",
  "Taylor",
  "Anderson",
  "Clark",
  "Lewis",
  "Walker",
  "Young",
  "King"
];

function generateName(i: number) {
  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  const last = LAST_NAMES[i % LAST_NAMES.length];
  return `${first} ${last}`;
}

// ------------------ Seed Data ------------------
export async function seed() {
  const jobCount = await db.jobs.count();
  if (jobCount > 0) return; // already seeded

  // 25 Jobs
  const jobs: Job[] = Array.from({ length: 25 }).map((_, i) => ({
    title: `Job ${i + 1}`,
    slug: slugify(`Job ${i + 1}`),
    status: Math.random() > 0.3 ? "active" : "archived",
    tags: ["tag1", "tag2"],
    order: i + 1
  }));

  const jobIds = await db.jobs.bulkAdd(jobs, { allKeys: true });

  // 1000 Candidates
  const stages: CandidateStage[] = [
    "applied",
    "screen",
    "tech",
    "offer",
    "hired",
    "rejected"
  ];

  const candidates: Candidate[] = Array.from({ length: 1000 }).map((_, i) => {
    const name = generateName(i);
    return {
      jobId: jobIds[Math.floor(Math.random() * jobIds.length)] as number,
      name,
      email: `${name.replace(/\s+/g, ".").toLowerCase()}@example.com`,
      stage: stages[Math.floor(Math.random() * stages.length)]
    };
  });

  await db.candidates.bulkAdd(candidates);

  // 3 Assessments
  const assessments: Assessment[] = jobIds.slice(0, 3).map((jobId) => ({
    jobId: jobId as number,
    questions: Array.from({ length: 12 }).map((_, i) => ({
      id: `q${i + 1}`,
      text: `Question ${i + 1}`,
      options: ["A", "B", "C", "D"]
    }))
  }));

  await db.assessments.bulkAdd(assessments);
}
