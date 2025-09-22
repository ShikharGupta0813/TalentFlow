// handlers.ts
import { http, HttpResponse, delay } from "msw";
import { db, Job, Candidate, Assessment } from "./db";

// ------------------ Utils ------------------
function randomDelay() {
  return delay(200 + Math.random() * 1000); // 200–1200ms
}
function maybeError() {
  if (Math.random() < 0.1) {
    throw HttpResponse.json({ error: "Random server error" }, { status: 500 });
  }
}

// ------------------ Handlers ------------------
export const handlers = [
  // ---- Jobs ----
  http.get("/jobs", async ({ request }) => {
    await randomDelay();
    const url = new URL(request.url);
    const search = url.searchParams.get("search") ?? "";
    const status = url.searchParams.get("status");
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") ?? "10", 10);
    const sort = url.searchParams.get("sort") ?? "order";

    let jobs = await db.jobs.toArray();
    if (search) jobs = jobs.filter((j) => j.title.includes(search));
    if (status) jobs = jobs.filter((j) => j.status === status);

    jobs.sort((a, b) =>
      sort === "title" ? a.title.localeCompare(b.title) : a.order - b.order
    );

    const start = (page - 1) * pageSize;
    const paginated = jobs.slice(start, start + pageSize);

    return HttpResponse.json({ data: paginated, total: jobs.length });
  }),

  http.post("/jobs", async ({ request }) => {
    await randomDelay();
    maybeError();
    const body = (await request.json()) as Omit<Job, "id" | "slug">;
    const job: Job = {
      ...body,
      slug: body.title.toLowerCase().replace(/\s+/g, "-"),
      status: body.status || "active"
    };
    const id = await db.jobs.add(job);
    return HttpResponse.json({ ...job, id });
  }),

  http.patch("/jobs/:id", async ({ params, request }) => {
    await randomDelay();
    maybeError();
    const id = Number(params.id);
    const patch = (await request.json()) as Partial<Job>;
    await db.jobs.update(id, patch);
    const job = await db.jobs.get(id);
    return HttpResponse.json(job);
  }),

  http.patch("/jobs/:id/reorder", async ({ request }) => {
    await randomDelay();
    maybeError();
    const { fromOrder, toOrder } = (await request.json()) as {
      fromOrder: number;
      toOrder: number;
    };

    const jobs = await db.jobs.toArray();
    const moving = jobs.find((j) => j.order === fromOrder);
    if (!moving) return HttpResponse.json({ error: "Job not found" }, { status: 404 });

    jobs.forEach((j) => {
      if (fromOrder < toOrder && j.order > fromOrder && j.order <= toOrder) j.order--;
      else if (fromOrder > toOrder && j.order < fromOrder && j.order >= toOrder) j.order++;
    });
    moving.order = toOrder;

    await db.jobs.bulkPut(jobs);
    return HttpResponse.json(moving);
  }),

  // ---- Candidates ----
  http.get("/candidates", async ({ request }) => {
    await randomDelay();
    const url = new URL(request.url);
    const search = url.searchParams.get("search") ?? "";
    const stage = url.searchParams.get("stage");
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const pageSize = 20;

    let candidates = await db.candidates.toArray();
    if (search) candidates = candidates.filter((c) => c.name.includes(search));
    if (stage) candidates = candidates.filter((c) => c.stage === stage);

    const start = (page - 1) * pageSize;
    const paginated = candidates.slice(start, start + pageSize);

    return HttpResponse.json({ data: paginated, total: candidates.length });
  }),

  http.post("/candidates", async ({ request }) => {
    await randomDelay();
    maybeError();
    const body = (await request.json()) as Candidate;
    const id = await db.candidates.add(body);
    return HttpResponse.json({ ...body, id });
  }),

  http.patch("/candidates/:id", async ({ params, request }) => {
    await randomDelay();
    maybeError();
    const id = Number(params.id);
    const patch = (await request.json()) as Partial<Candidate>;
    await db.candidates.update(id, patch);
    const candidate = await db.candidates.get(id);
    return HttpResponse.json(candidate);
  }),

  http.get("/candidates/:id/timeline", async ({ params }) => {
    await randomDelay();
    const id = Number(params.id);
    const candidate = await db.candidates.get(id);
    if (!candidate) return HttpResponse.json({ error: "Not found" }, { status: 404 });

    const timeline = [
      { stage: "applied", date: new Date().toISOString() },
      { stage: candidate.stage, date: new Date().toISOString() }
    ];
    return HttpResponse.json(timeline);
  }),

  // ---- Assessments ----
  http.get("/assessments/:jobId", async ({ params }) => {
    await randomDelay();
    const jobId = Number(params.jobId);
    const assessment = await db.assessments.get(jobId);
    return HttpResponse.json(assessment);
  }),

  http.put("/assessments/:jobId", async ({ params, request }) => {
    await randomDelay();
    maybeError();
    const jobId = Number(params.jobId);
    const body = (await request.json()) as Assessment;
    await db.assessments.put({ ...body, jobId });
    return HttpResponse.json(body);
  }),

  http.post("/assessments/:jobId/submit", async ({ params, request }) => {
    await randomDelay();
    maybeError();
    const jobId = Number(params.jobId);
    const body = (await request.json()) as Record<string,string>;
    const assessment = await db.assessments.get(jobId);
    if (!assessment) return HttpResponse.json({ error: "Not found" }, { status: 404 });

    assessment.responses = body;
    await db.assessments.put(assessment);
    return HttpResponse.json({ success: true });
  })
];
