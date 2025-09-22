import { useAssessmentBuilder } from "@/hooks/useAssessmentBuilder";

type Props = {
  builder: ReturnType<typeof useAssessmentBuilder>;
};

export default function LivePreview({ builder }: Props) {
  return (
    <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
      <h2 className="text-lg font-semibold mb-4">Live Preview</h2>

      {builder.sections.map((s) => (
        <div key={s.id} className="mb-4">
          <h3 className="font-bold mb-2">{s.title}</h3>
          {s.questions.map((q) => (
            <div key={q.id} className="mb-2">
              <p className="font-medium">{q.title}</p>
              {q.type === "short" && <input className="w-full p-2 bg-slate-800 rounded" />}
              {q.type === "long" && <textarea className="w-full p-2 bg-slate-800 rounded" />}
              {q.type === "single" &&
                q.options?.map((o, i) => (
                  <label key={i} className="block">
                    <input type="radio" name={q.id} /> {o}
                  </label>
                ))}
              {q.type === "multiple" &&
                q.options?.map((o, i) => (
                  <label key={i} className="block">
                    <input type="checkbox" /> {o}
                  </label>
                ))}
              {q.type === "numeric" && <input type="number" className="p-2 bg-slate-800 rounded" />}
              {q.type === "file" && <input type="file" />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
