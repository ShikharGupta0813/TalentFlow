import { useState, useEffect } from "react";
import { Assessment, Section, Question } from "@/mock/type";
import { loadState, saveState } from "@/lib/storage";

export function useAssessmentBuilder() {
  const [assessment, setAssessment] = useState<Assessment>({
    id: Date.now(),
    jobId: Date.now(), // placeholder job link
    title: "New Assessment",
    description: "Describe what this assessment will evaluate...",
    role: "Untitled Role",
    duration: "0 mins", // now string
    submissions: 0,
    status: "Draft",
    sections: [],
    totalQuestions: 0
  });

  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewResponses, setPreviewResponses] = useState<Record<string, any>>({});
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Load saved state
  useEffect(() => {
    const saved = loadState<Assessment>("assessment-builder-state");
    if (saved) {
      setAssessment(saved);
      if (saved.sections.length > 0) {
        setSelectedSectionId(saved.sections[0].id);
      }
    }
  }, []);

  // Persist & recalc metrics
  useEffect(() => {
    const totalQuestions = assessment.sections.reduce((sum, s) => sum + s.questions.length, 0);
    const estimatedMinutes = Math.max(2, totalQuestions * 2);
    const newDuration = `${estimatedMinutes} mins`;

    if (assessment.totalQuestions !== totalQuestions || assessment.duration !== newDuration) {
      setAssessment(prev => ({ ...prev, totalQuestions, duration: newDuration }));
    }

    saveState("assessment-builder-state", assessment);
  }, [assessment.sections]);

  // --- actions ---
  const addSection = () => {
    const newSection: Section = {
      id: Date.now(),
      title: `Section ${assessment.sections.length + 1}`,
      questions: []
    };
    setAssessment(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
    setSelectedSectionId(newSection.id);
    setUnsavedChanges(true);
  };

  const updateSection = (id: number, updates: Partial<Section>) => {
    setAssessment(prev => ({
      ...prev,
      sections: prev.sections.map(s => (s.id === id ? { ...s, ...updates } : s))
    }));
    setUnsavedChanges(true);
  };

  const deleteSection = (id: number) => {
    setAssessment(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== id) }));
    if (selectedSectionId === id) setSelectedSectionId(null);
    setUnsavedChanges(true);
  };

  const addQuestion = (type: Question["type"]) => {
    if (!selectedSectionId) return;
    const section = assessment.sections.find(s => s.id === selectedSectionId);
    if (!section) return;

    const newQuestion: Question = {
      id: Date.now(),
      type,
      title: "",
      options: type.includes("choice") ? ["Option 1", "Option 2"] : undefined,
      validationRules:
        type === "numeric"
          ? { min: 0, max: 100, required: false }
          : type.includes("text")
          ? { maxLength: 200, required: false }
          : { required: false },
      conditional: undefined
    };

    updateSection(selectedSectionId, { questions: [...section.questions, newQuestion] });
    setSelectedQuestionId(newQuestion.id);
    setShowQuestionModal(false);
  };

  const updateQuestion = (qid: number, updates: Partial<Question>) => {
    if (!selectedSectionId) return;
    updateSection(selectedSectionId, {
      questions: assessment.sections
        .find(s => s.id === selectedSectionId)!
        .questions.map(q => (q.id === qid ? { ...q, ...updates } : q))
    });
  };

  const deleteQuestion = (qid: number) => {
    if (!selectedSectionId) return;
    updateSection(selectedSectionId, {
      questions: assessment.sections
        .find(s => s.id === selectedSectionId)!
        .questions.filter(q => q.id !== qid)
    });
    if (selectedQuestionId === qid) setSelectedQuestionId(null);
  };

  const saveAssessment = () => {
    saveState(`assessment-${assessment.id}`, assessment);
    setUnsavedChanges(false);
  };

  return {
    assessment,
    selectedSectionId,
    selectedQuestionId,
    showQuestionModal,
    showPreview,
    previewResponses,
    unsavedChanges,
    setSelectedSectionId,
    setSelectedQuestionId,
    setShowQuestionModal,
    setShowPreview,
    setPreviewResponses,
    addSection,
    updateSection,
    deleteSection,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    saveAssessment
  };
}
