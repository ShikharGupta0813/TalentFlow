import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Heatmap({ data }: { data: { date: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <Card className="shadow-lg">
      <CardHeader><CardTitle>Applications Heatmap</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {data.map((d, idx) => {
            const alpha = 0.1 + (d.value / max) * 0.8;
            const bg = `rgba(37, 99, 235, ${alpha.toFixed(2)})`;
            return (
              <TooltipProvider key={idx}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="rounded-sm cursor-pointer hover:ring-1 hover:ring-indigo-500"
                      style={{ width: 20, height: 20, background: bg }}
                    />
                  </TooltipTrigger>
                  <TooltipContent><p>{d.date}: {d.value} candidates</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Heatmap;
