import {Card,CardContent,CardHeader,CardTitle} from "@/components/ui/card"
function TopJobs() {
  return (
    <div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Recent Job Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Job posts will be fetched from local API (coming soon).</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopJobs;
