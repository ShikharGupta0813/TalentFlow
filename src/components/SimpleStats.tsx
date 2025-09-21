import {Card,CardContent} from "@/components/ui/card"
function SimpleStats({ stats }: { stats: { title: string; value: number; change: string }[] }) {
return (
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
{stats.map((s) => (
<Card key={s.title} className="shadow-lg hover:shadow-xl transition">
<CardContent>
<div className="flex items-center justify-between">
<div>
<div className="text-sm text-muted-foreground">{s.title}</div>
<div className="text-2xl font-bold">{s.value}</div>
</div>
<div className="text-sm text-green-500">{s.change}</div>
</div>
</CardContent>
</Card>
))}
</div>
);
};

export default SimpleStats; 