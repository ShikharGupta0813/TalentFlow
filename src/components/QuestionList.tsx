import { Button } from "@/components/ui/button";
import { useAssessmentBuilder, QuestionType } from "@/hooks/useAssessmentBuilder";

type Props = {
  builder: ReturnType<typeof useAssessmentBuilder>;
  sectionId: string;
  selectedQuestion: string | null;
  onSelect: (id: string) => void;
};

const questionTypes: { type: QuestionType; label: string }[] = [
  { type: "single", label: "Single Choice" },
  { type: "multiple", label: "Multiple Choice" },
  { type: "short", label: "Short Text" },
  { type: "long", label: "Long Text" },
  { type: "numeric", label: "Numeric" },
  { type: "file", label: "File Upload" },
];

export default function QuestionList({ builder, sectionId, selectedQuestion, onSelect }: Props) {
  return (
    <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
      <h2 className="text-lg font-semibold mb-2">Questions</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {questionTypes.map((qt) => (
          <Button key={qt.type} size="sm" onClick={() => builder.addQuestion(sectionId, qt.type)}>
            {qt.label}
          </Button>
        ))}
      </div>

      <ul className="space-y-2">
        {builder.sections
          .find((s) => s.id === sectionId)
          ?.questions.map((q) => (
            <li
              key={q.id}
              className={`p-2 rounded cursor-pointer ${
                selectedQuestion === q.id ? "bg-purple-700 text-white" : "bg-slate-800"
              }`}
              onClick={() => onSelect(q.id)}
            >
              {q.title} ({q.type})
            </li>
          ))}
      </ul>
    </div>
  );
}
