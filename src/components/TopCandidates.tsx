import {Card,CardContent,CardHeader,CardTitle} from "@/components/ui/card"

export const TopCandidates = ()=>{
    return(
<Card className="shadow-lg">
  <CardHeader>
    <CardTitle>Top Candidates</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Candidates will be fetched from local API (coming soon).</p>
  </CardContent>
</Card>
    );
};
