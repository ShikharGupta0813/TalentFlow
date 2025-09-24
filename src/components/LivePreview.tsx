import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type PreviewProps = {
  assessment?: any; // from Assignments
  builder?: any;    // from Builder
  onBack?: () => void;
};

export default function Preview({ assessment, builder, onBack }: PreviewProps) {
  const data = builder ? builder.assessment : assessment;
  if (!data) return <p>No assessment found.</p>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="text-slate-300">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Assessments
            </Button>
          )}
          <h1 className="text-3xl font-bold text-purple-400">Assessment Preview</h1>
        </div>
        <Button variant="outline" className="border-purple-400 text-purple-400">
          Edit Assessment
        </Button>
      </div>

      {/* Assessment Info */}
      <Card className="bg-slate-900 p-6 mb-8 shadow-lg border border-slate-800">
        <h2 className="text-2xl font-bold mb-2">{data.title}</h2>
        {data.description && (
          <p className="text-slate-400 mb-4">{data.description}</p>
        )}

        <div className="flex gap-4 text-sm">
          <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300">
            {data.sections?.length || 0} sections
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300">
            {data.totalQuestions || 0} questions
          </span>
          {data.duration && (
            <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300">
              ~{data.duration}
            </span>
          )}
        </div>
      </Card>

      {/* Sections + Questions */}
      {data.sections?.map((s: any, si: number) => (
        <div key={s.id} className="mb-8">
          {/* Section Header */}
          <div className="rounded-t-xl p-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow">
            <h3 className="text-lg font-semibold">
              Section {si + 1}: {s.title}
            </h3>
            <p className="text-sm opacity-80">
              {s.questions?.length || 0} questions in this section
            </p>
          </div>

          {/* Section Questions */}
          <div className="bg-slate-900 p-4 rounded-b-xl border border-slate-800">
            {s.questions?.map((q: any, qi: number) => (
              <div
                key={q.id}
                className="mb-6 p-4 bg-slate-800 rounded-lg shadow"
              >
                {/* Question Title */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-300 font-semibold">
                    {si + 1}.{qi + 1}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">
                    {q.type || "text"}
                  </span>
                </div>

                <p className="font-medium text-white mb-1">{q.title}</p>
                {q.description && (
                  <p className="text-sm text-slate-400 mb-3">{q.description}</p>
                )}

                {/* Input placeholder (like candidate view) */}
                <input
                  type="text"
                  disabled
                  placeholder="Candidate’s response..."
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-slate-400 text-sm"
                />

                {/* Validation */}
                {q.validation && (
                  <div className="mt-3 bg-amber-900/20 border border-amber-700 text-amber-400 text-sm p-3 rounded">
                    <p className="font-semibold mb-1">Validation requirements:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {q.validation.required && <li>This field is required</li>}
                      {q.validation.min && (
                        <li>Minimum {q.validation.min} characters required</li>
                      )}
                      {q.validation.range && (
                        <li>
                          Please enter a value between {q.validation.range[0]} and{" "}
                          {q.validation.range[1]}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Submit (disabled preview) */}
      <div className="text-center mt-10">
        <Button disabled className="opacity-50 cursor-not-allowed">
          Submit Assessment
        </Button>
        <p className="text-sm text-slate-500 mt-2">
          This is a preview of how the assessment will appear to candidates
        </p>
      </div>
    </div>
  );
}
