import { Button } from "@/components/ui/button";
import { useAssessmentBuilder } from "@/hooks/useAssessmentBuilder";

type Props = {
  builder: ReturnType<typeof useAssessmentBuilder>;
  selectedSection: string | null;
  onSelect: (id: string) => void;
};

export default function SectionList({ builder, selectedSection, onSelect }: Props) {
  return (
    <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
      <h2 className="text-lg font-semibold mb-2">Sections</h2>
      <Button onClick={() => builder.addSection()}>+ Add Section</Button>

      <ul className="mt-4 space-y-2">
        {builder.sections.map((s) => (
          <li
            key={s.id}
            className={`p-2 rounded cursor-pointer ${
              selectedSection === s.id ? "bg-purple-700 text-white" : "bg-slate-800"
            }`}
            onClick={() => onSelect(s.id)}
          >
            {s.title} ({s.questions.length} questions)
          </li>
        ))}
      </ul>
    </div>
  );
}
