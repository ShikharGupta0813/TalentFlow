import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  eachDayOfInterval,
  endOfWeek,
  startOfWeek,
  subMonths,
  format,
  isSameMonth,
} from "date-fns";

export function Heatmap({ data }: { data: { date: string; value: number }[] }) {
  // Map input data
  const dataMap = new Map(data.map((d) => [d.date, d.value]));

  // Last 26 weeks (6 months)
  const end = endOfWeek(new Date());
  const start = startOfWeek(subMonths(end, 6));
  const allDays = eachDayOfInterval({ start, end });

  // Build weeks
  const weeks: Date[][] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  // Fill missing days with random values (simulate activity)
  const filledData = allDays.map((day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const value = dataMap.get(dateStr) ?? Math.floor(Math.random() * 100); // simulate
    return { date: dateStr, value };
  });

  const max = Math.max(...filledData.map((d) => d.value), 1);
  const filledMap = new Map(filledData.map((d) => [d.date, d.value]));

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Applications Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Heatmap grid */}
        <div className="flex">
          <div className="grid grid-rows-7 grid-flow-col gap-1">
            {weeks.map((week, wIdx) =>
              week.map((day, dIdx) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const value = filledMap.get(dateStr) || 0;
                const alpha = 0.2 + (value / max) * 0.8; // stronger purple
                const bg = `rgba(139, 92, 246, ${alpha.toFixed(2)})`; // purple-500
                return (
                  <TooltipProvider key={`${wIdx}-${dIdx}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="rounded-sm cursor-pointer hover:ring-1 hover:ring-purple-500"
                          style={{
                            width: 12,
                            height: 12,
                            background: bg,
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {dateStr}: {value} candidates
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })
            )}
          </div>
        </div>

        {/* Month labels */}
        {/* Month labels */}
        <div className="flex mt-2 text-xs text-gray-500">
          {weeks.map((week, wIdx) => {
            const firstDay = week[0];
            const prevWeek = weeks[wIdx - 1]?.[0];
            if (!prevWeek || !isSameMonth(firstDay, prevWeek)) {
              return (
                <div key={wIdx} className="w-16 text-left">
                  {format(firstDay, "MMM")}
                </div>
              );
            }
            return <div key={wIdx} className="w-16" />;
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default Heatmap;
