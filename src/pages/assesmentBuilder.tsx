import Layout from "@/components/layout";
import { useAssessmentBuilder } from "@/hooks/useAssessmentBuilder";
import SectionList from "@/components/SectionList";
import QuestionList from "@/components/QuestionList";
import LivePreview from "@/components/LivePreview";
import QuestionEditor from "@/components/QuestionEditor";
import { useState } from "react";

export default function AssessmentBuilderPage() {
  const builder = useAssessmentBuilder("assessment-builder");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  return (
    <Layout>
      <div className="p-6 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-purple-400">Assessment Builder</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Sections */}
          <SectionList
            builder={builder}
            selectedSection={selectedSection}
            onSelect={setSelectedSection}
          />

          {/* Middle: Questions */}
          {selectedSection && (
            <QuestionList
              builder={builder}
              sectionId={selectedSection}
              onSelect={setSelectedQuestion}
              selectedQuestion={selectedQuestion}
            />
          )}

          {/* Right: Editor or Preview */}
          {selectedQuestion ? (
            <QuestionEditor
              builder={builder}
              sectionId={selectedSection!}
              questionId={selectedQuestion}
            />
          ) : (
            <LivePreview builder={builder} />
          )}
        </div>
      </div>
    </Layout>
  );
}
