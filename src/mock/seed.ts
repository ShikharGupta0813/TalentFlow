import { db } from "./db";
import {Assessment,Candidate,CandidateStage,Job,JobType,JobStatus,Note,TimelineEvent,UserResponse } from "@/mock/type";

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-");
}

const FIRST_NAMES = ["John", "Alice", "David", "Sophia", "Michael", "Emma", "Daniel", "Olivia", "James", "Ava"];
const LAST_NAMES = ["Smith", "Johnson", "Brown", "Taylor", "Anderson", "Clark", "Lewis", "Walker", "Young", "King"];

function generateName(i: number) {
  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  const last = LAST_NAMES[i % LAST_NAMES.length];
  return `${first} ${last}`;
}

function randomPhone() {
  return `+1-${Math.floor(100 + Math.random() * 900)}-${Math.floor(
    100 + Math.random() * 900
  )}-${Math.floor(1000 + Math.random() * 9000)}`;
}

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export async function seed() {
  const jobCount = await db.jobs.count();
  if (jobCount > 0) return; // already seeded

const jobTitles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Product Manager",
  "UX/UI Designer",
  "QA Engineer",
  "Technical Writer",
];

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
const statuses = ["active", "draft"] as const;
const locations = [
  "New York, USA",
  "San Francisco, USA",
  "Berlin, Germany",
  "Bangalore, India",
  "Remote",
];

const jobRequirements: Record<string, string[]> = {
  "Frontend Developer": [
    "Strong proficiency in React.js and TypeScript",
    "Experience with modern CSS frameworks (Tailwind, Styled Components)",
    "Understanding of RESTful APIs and GraphQL",
    "Knowledge of responsive design and accessibility standards",
    "Version control with Git and GitHub",
    "Familiarity with testing libraries (Jest, React Testing Library)",
  ],
  "Backend Developer": [
    "Proficiency in Node.js with Express or NestJS",
    "Experience with relational databases (PostgreSQL, MySQL)",
    "Understanding of REST and GraphQL APIs",
    "Knowledge of authentication and authorization (OAuth, JWT)",
    "Strong debugging and optimization skills",
    "Familiarity with Docker and cloud deployment (AWS, GCP, Azure)",
  ],
  "Full Stack Engineer": [
    "Solid experience with React.js and Node.js",
    "Understanding of database design (SQL & NoSQL)",
    "Building and consuming APIs",
    "Cloud deployment knowledge (AWS/GCP)",
    "CI/CD pipeline experience",
    "Strong problem-solving skills",
  ],
  "Data Scientist": [
    "Expertise in Python (NumPy, Pandas, Scikit-learn)",
    "Machine learning model development and evaluation",
    "Experience with deep learning frameworks (TensorFlow, PyTorch)",
    "Strong statistical and data visualization skills",
    "Knowledge of SQL and data pipelines",
    "Experience deploying ML models in production",
  ],
  "Machine Learning Engineer": [
    "Strong understanding of ML algorithms and optimization",
    "Hands-on with TensorFlow, PyTorch, or Keras",
    "Knowledge of MLOps practices",
    "Model deployment on cloud (AWS SageMaker, GCP AI Platform)",
    "Proficiency in Python and C++",
    "Strong problem-solving mindset",
  ],
  "DevOps Engineer": [
    "Expertise in CI/CD tools (GitHub Actions, Jenkins)",
    "Strong understanding of Docker and Kubernetes",
    "Cloud infrastructure management (AWS, GCP, Azure)",
    "Infrastructure as code (Terraform, Ansible)",
    "Monitoring tools (Prometheus, Grafana)",
    "Strong scripting skills (Bash, Python)",
  ],
  "Product Manager": [
    "Experience defining product roadmaps",
    "Strong understanding of Agile and Scrum",
    "Ability to translate business needs into tech requirements",
    "Excellent communication and stakeholder management",
    "Experience with tools like Jira, Trello",
    "Analytical mindset with data-driven decision-making",
  ],
  "UX/UI Designer": [
    "Proficiency in Figma, Sketch, or Adobe XD",
    "Strong portfolio demonstrating design systems",
    "Understanding of user research methods",
    "Ability to create wireframes, prototypes, and mockups",
    "Collaboration with developers on implementation",
    "Knowledge of accessibility and usability standards",
  ],
  "QA Engineer": [
    "Experience with automated testing (Selenium, Cypress, Playwright)",
    "Knowledge of manual testing processes",
    "Understanding of CI/CD integration",
    "Familiarity with bug tracking tools (Jira, Bugzilla)",
    "Ability to write clear test cases and reports",
    "Strong problem-solving skills",
  ],
  "Technical Writer": [
    "Excellent written communication skills",
    "Experience writing API and developer documentation",
    "Ability to simplify complex technical concepts",
    "Familiarity with Markdown and documentation tools",
    "Collaboration with developers and product managers",
    "Attention to detail and accuracy",
  ],
  default: [
    "Strong communication skills",
    "Problem-solving mindset",
    "Team collaboration",
    "Basic coding knowledge",
    "Adaptability to new technologies",
    "Time management",
  ],
};

const departments = [
  "Engineering",
  "Product",
  "Data Science",
  "Design",
  "Operations",
  "Quality Assurance",
];

const hiringManagers = [
  "Alice Johnson",
  "Bob Smith",
  "Clara Davis",
  "David Lee",
  "Emily Zhang",
  "Frank Wilson",
];

const salaryRanges = [
  "$60,000 - $80,000",
  "$80,000 - $100,000",
  "$100,000 - $120,000",
  "$120,000 - $150,000",
  "$150,000 - $180,000",
];

 const jobs: Job[] = Array.from({ length: 25 }).map((_, i) => {
  const title = jobTitles[i % jobTitles.length];
  const type = jobTypes[i % jobTypes.length] as Job["type"];
  const status = statuses[Math.random() > 0.3 ? 0 : 1] as Job["status"];
  const location = locations[i % locations.length];
  const requirements = jobRequirements[title] ?? jobRequirements.default;

  return {
    id: i + 1,
    title,
    slug: slugify(title),
    status,
    type,
    location,
    description: `We are looking for a passionate ${title} to join our ${departments[i % departments.length]} team. You will work closely with cross-functional teams to deliver high-quality solutions, contribute to innovation, and help us achieve our mission.`,
    requirements,
    tags: [
      title.split(" ")[0].toLowerCase(),
      type.toLowerCase(),
      location.includes("Remote") ? "remote" : "onsite",
    ],
    order: i + 1,
    department: departments[i % departments.length],
    hiringManager: hiringManagers[i % hiringManagers.length],
    salaryRange: salaryRanges[i % salaryRanges.length],
  };
});

  const jobIds = await db.jobs.bulkAdd(jobs, { allKeys: true });

  // 1000 Candidates
  const stages: CandidateStage[] = ["applied", "screen", "tech", "offer", "hired", "rejected"];

  const candidates: Candidate[] = Array.from({ length: 1000 }).map((_, i) => {
    const name = generateName(i);
    const jobId = jobIds[Math.floor(Math.random() * jobIds.length)] as number;
    const job = jobs.find((j) => j.id === jobId);
    const jobTitle = job ? job.title : "Unknown Role";

    return {
      jobId,
      jobTitle,
      name,
      email: `${name.replace(/\s+/g, ".").toLowerCase()}@example.com`,
      phone: randomPhone(),
      appliedDate: daysAgo(Math.floor(Math.random() * 60)),
      stage: stages[Math.floor(Math.random() * stages.length)],
    };
  });

  const candidateIds = await db.candidates.bulkAdd(candidates, { allKeys: true });

  // Seed Notes + Timeline for each candidate
  for (const id of candidateIds) {
    const notes: Note[] = [
      {
        candidateId: id as number,
        author: "Sarah Johnson",
        content:
          "Initial phone screening completed. Candidate shows strong technical background and good communication skills. @John Smith please review for next steps.",
        createdAt: daysAgo(35),
      },
      {
        candidateId: id as number,
        author: "Mike Chen",
        content:
          "Technical assessment results look promising. Scored well on algorithms and system design. Ready for technical interview round.",
        createdAt: daysAgo(33),
      },
    ];
    await db.notes.bulkAdd(notes);

    const timeline: TimelineEvent[] = [
      {
        candidateId: id as number,
        type: "system",
        description: "Application received",
        createdAt: daysAgo(36),
      },
      {
        candidateId: id as number,
        type: "note",
        description: "Added initial screening notes",
        author: "Sarah Johnson",
        createdAt: daysAgo(35),
      },
      {
        candidateId: id as number,
        type: "stage-change",
        description: "Stage changed from applied to screen",
        fromStage: "applied",
        toStage: "screen",
        author: "HR Team",
        createdAt: daysAgo(35),
      },
      {
        candidateId: id as number,
        type: "stage-change",
        description: "Stage changed from screen to tech",
        fromStage: "screen",
        toStage: "tech",
        author: "HR Team",
        createdAt: daysAgo(33),
      },
    ];
    await db.timeline.bulkAdd(timeline);
  }

 const assessments: Assessment[] = [
  {
    id: 1,
    jobId: 101,
    title: "JavaScript Fundamentals Test",
    description:"will evaluate",
    role: "Frontend Developer",
    duration: "45 mins",
    submissions: 35,
    status: "Active",
    totalQuestions: 3,
    sections: [
      {
        id: 1,
        title: "Basics",
        questions: [
          {
            id: 1,
            type: "single-choice",
            title: "Which keyword declares a constant in JavaScript?",
            options: ["let", "var", "const", "static"],
            validationRules: { required: true }
          },
          {
            id: 2,
            type: "multiple-choice",
            title: "Which of the following are valid JavaScript data types?",
            options: ["String", "Boolean", "Character", "Undefined"],
            validationRules: { required: true }
          },
          {
            id: 3,
            type: "short-text",
            title: "What is the output of `typeof null`?",
            validationRules: { required: true, maxLength: 50 }
          }
        ]
      }
    ]
  },
  {
    id: 2,
    jobId: 102,
    title: "React.js Practical Assessment",
    description:"will evaluate",
    role: "Frontend Developer",
    duration: "60 mins",
    submissions: 28,
    status: "Active",
    totalQuestions: 3,
    sections: [
      {
        id: 2,
        title: "Components & Hooks",
        questions: [
          {
            id: 4,
            type: "single-choice",
            title: "Which hook replaces `componentDidMount`?",
            options: ["useEffect", "useState", "useContext", "useRef"],
            validationRules: { required: true }
          },
          {
            id: 5,
            type: "long-text",
            title: "Explain reconciliation in React.",
            validationRules: { required: true, maxLength: 500 }
          },
          {
            id: 6,
            type: "file-upload",
            title: "Upload a React project screenshot showing state usage.",
            validationRules: { required: true }
          }
        ]
      }
    ]
  },
  {
    id: 3,
    jobId: 103,
    title: "Node.js & Express Backend Quiz",
    description:"will evaluate",
    role: "Backend Developer",
    duration: "50 mins",
    submissions: 22,
    status: "Draft",
    totalQuestions: 3,
    sections: [
      {
        id: 3,
        title: "APIs & Middleware",
        questions: [
          {
            id: 7,
            type: "short-text",
            title: "What method handles GET requests in Express?",
            validationRules: { required: true }
          },
          {
            id: 8,
            type: "numeric",
            title: "What is the default port for HTTP?",
            validationRules: { required: true, min: 1, max: 65535 }
          },
          {
            id: 9,
            type: "multiple-choice",
            title: "Which middleware are built-in with Express?",
            options: ["express.json()", "express.static()", "bodyParser()", "cors()"],
            validationRules: { required: true }
          }
        ]
      }
    ]
  }
];

await db.assessments.bulkAdd(assessments);

const responses: UserResponse[] = [
  {
    id: 1,
    assessmentId: 1,
    questionId: 101,
    answer: "Option A",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    assessmentId: 1,
    questionId: 102,
    answer: "42",
    createdAt: new Date().toISOString(),
  },
];

await db.responses.bulkAdd(responses);
}