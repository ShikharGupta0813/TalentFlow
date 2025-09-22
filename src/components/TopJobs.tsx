import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define type (optional, but nice if you're using TypeScript)
type Job = {
  id: number;
  title: string;
  slug: string;
  status: "active" | "archived";
  tags: string[];
  order: number;
};

function TopJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function fetchJobs() {
    try {
      const res = await fetch("/jobs?page=1&pageSize=5&status=active");
      const result = await res.json();
      console.log("Fetched jobs:", result);
      setJobs(result.data); // ✅ only the array
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  }

  fetchJobs();
}, []);



  return (
    <div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Recent Job Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading jobs...</p>}
          {!loading && jobs.length === 0 && <p>No jobs found.</p>}
          <ul className="space-y-2">
            {jobs.map((job) => (
              <li key={job.id} className="p-2 border rounded-md">
                <p className="font-semibold">{job.title}</p>
                <p className="text-sm text-gray-500">{job.tags.join(", ")}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default TopJobs;
