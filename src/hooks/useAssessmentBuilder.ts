import { useState, useEffect } from "react";

export type QuestionType =
  | "single"
  | "multiple"
  | "short"
  | "long"
  | "numeric"
  | "file";

export type Question = {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required?: boolean;
  options?: string[];
};

export type Section = {
  id: string;
  title: string;
  questions: Question[];
};

export function useAssessmentBuilder(storageKey: string = "assessment-builder") {
  const [sections, setSections] = useState<Section[]>([]);

  // 🔹 Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setSections(JSON.parse(saved));
  }, [storageKey]);

  // 🔹 Save to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(sections));
  }, [sections, storageKey]);

  // Section actions
  const addSection = (title: string = "Untitled Section") => {
    setSections([...sections, { id: Date.now().toString(), title, questions: [] }]);
  };

  const renameSection = (id: string, title: string) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, title } : s)));
  };

  const removeSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  // Question actions
  const addQuestion = (sectionId: string, type: QuestionType) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: [
                ...s.questions,
                { id: Date.now().toString(), type, title: "Untitled Question" },
              ],
            }
          : s
      )
    );
  };

  const updateQuestion = (sectionId: string, qId: string, data: Partial<Question>) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) => (q.id === qId ? { ...q, ...data } : q)),
            }
          : s
      )
    );
  };

  const removeQuestion = (sectionId: string, qId: string) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, questions: s.questions.filter((q) => q.id !== qId) }
          : s
      )
    );
  };

  const clear = () => setSections([]);

  return {
    sections,
    addSection,
    renameSection,
    removeSection,
    addQuestion,
    updateQuestion,
    removeQuestion,
    clear,
  };
}
