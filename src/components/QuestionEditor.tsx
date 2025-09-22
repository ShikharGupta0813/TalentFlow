import { useAssessmentBuilder } from "@/hooks/useAssessmentBuilder";

type Props = {
  builder: ReturnType<typeof useAssessmentBuilder>;
  sectionId: string;
  questionId: string;
};

export default function QuestionEditor({ builder, sectionId, questionId }: Props) {
  const question = builder.sections
    .find((s) => s.id === sectionId)
    ?.questions.find((q) => q.id === questionId);

  if (!question) return <div className="p-4">Select a question to edit</div>;

  return (
    <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
      <h2 className="text-lg font-semibold mb-2">Edit Question</h2>
      <input
        className="w-full p-2 mb-2 bg-slate-800 rounded"
        value={question.title}
        onChange={(e) => builder.updateQuestion(sectionId, questionId, { title: e.target.value })}
      />
      <textarea
        className="w-full p-2 mb-2 bg-slate-800 rounded"
        value={question.description ?? ""}
        onChange={(e) => builder.updateQuestion(sectionId, questionId, { description: e.target.value })}
      />
    </div>
  );
}
