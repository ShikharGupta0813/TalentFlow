import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Assessment = {
  name: string;
  date: string;
  status: "Passed" | "Failed" | "Pending";
};

const assessments: Assessment[] = [
  { name: "React Skills Test", date: "2025-09-10", status: "Passed" },
  { name: "Node.js Assessment", date: "2025-09-07", status: "Passed" },
  { name: "System Design Quiz", date: "2025-09-05", status: "Failed" },
  { name: "SQL Challenge", date: "2025-09-02", status: "Passed" },
  { name: "JavaScript Basics", date: "2025-08-28", status: "Pending" },
];

export function RecentAssessments() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Recent Assessments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {assessments.map((a, idx) => (
            <div
              key={idx}
              className="h-20 rounded-md bg-purple-100 shadow-sm flex flex-col justify-center items-center hover:shadow-md transition"
            >
              <p className="text-sm font-medium text-gray-800 text-center">
                {a.name}
              </p>
              <p className="text-xs text-gray-500">{a.date}</p>
              <p
                className={`text-xs font-semibold mt-1 ${
                  a.status === "Passed"
                    ? "text-green-600"
                    : a.status === "Failed"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {a.status}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentAssessments;
