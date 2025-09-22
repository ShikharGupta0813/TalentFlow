import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

function TopCandidates ()  {
  const { data, isLoading, error } = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const res = await axios.get("/candidates");
      return res.data;
    },
  });

  if (isLoading) return <p>Loading candidates...</p>;
  if (error) return <p>Failed to load candidates.</p>;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Top Candidates</CardTitle>
      </CardHeader>
      <CardContent>
        {data?.data?.slice(0, 5).map((c: any) => (
          <div key={c.id} className="mb-2 border-b pb-2">
            <p className="font-medium">{c.name}</p>
            <p className="text-sm text-gray-500">{c.stage}</p>
            <p className="text-xs text-gray-400">
              Skills: {Array.isArray(c.skills) ? c.skills.join(", ") : "N/A"}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopCandidates;