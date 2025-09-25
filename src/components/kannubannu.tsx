// src/components/kanban.tsx

import { useEffect, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CandidateStage, Candidate } from "@/mock/type";
import { db } from "@/mock/db";

type KanbanCardProps = {
  id: number;
  name: string;
  jobTitle: string;
  stage: CandidateStage;
  order?: number;
  [key: string]: any;
};

function SortableKanbanCard({ candidate }: { candidate: KanbanCardProps }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: candidate.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white rounded-lg shadow p-4 mb-3 border cursor-grab transition hover:shadow-md hover:border-indigo-500">
      <div className="font-semibold text-slate-800">{candidate.name}</div>
      <div className="text-xs text-slate-500">{candidate.jobTitle}</div>
    </div>
  );
}

function KanbanColumn({ name, color, candidates, children }: { stage: CandidateStage; name: string; color: string; candidates: KanbanCardProps[]; children?: React.ReactNode; }) {
  return (
    <div className="flex-1 min-w-[280px]">
      <div className={`rounded-t-lg px-4 py-2 font-bold text-white shadow-inner ${color}`}>{name} <span className="ml-2 text-xs font-normal bg-white/20 px-2 py-0.5 rounded-full">{candidates.length}</span></div>
      <div className="bg-slate-100 rounded-b-lg p-3 min-h-screen">
        {children}
      </div>
    </div>
  );
}

async function patchCandidateStage(id: number, stage: CandidateStage) {
  await db.candidates.update(id, { stage });
}

// MODIFIED: The component now receives filtered candidates as a prop
export default function KannuBannu({ candidates: filteredCandidates }: { candidates: Candidate[] }) {
  // Local state is kept for optimistic UI updates during drag-and-drop
  const [localCandidates, setLocalCandidates] = useState(filteredCandidates);
  const sensors = useSensors(useSensor(PointerSensor));

  // Sync local state when the filtered prop from parent changes
  useEffect(() => {
    setLocalCandidates(filteredCandidates);
  }, [filteredCandidates]);

  const stages: { stage: CandidateStage; color: string; name: string }[] = [
    { stage: "applied", color: "bg-slate-500", name: "Applied" },
    { stage: "screen", color: "bg-orange-500", name: "Screen" },
    { stage: "tech", color: "bg-purple-500", name: "Tech Interview" },
    { stage: "offer", color: "bg-sky-500", name: "Offer" },
    { stage: "hired", color: "bg-green-500", name: "Hired" },
  ];

  const stageMap: Record<string, KanbanCardProps[]> = {};
  stages.forEach(({ stage }) => {
    stageMap[stage] = localCandidates.filter((c) => c.stage === stage);
  });

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || !active) return;

    const fromId = Number(active.id);
    const candidate = localCandidates.find((c) => c.id === fromId);
    if (!candidate) return;

    const toContainerId = over.id;
    let toStage: CandidateStage | null = null;
    
    if (stages.some(s => s.stage === toContainerId)) {
        toStage = toContainerId as CandidateStage;
    } else {
        for (const stage of Object.keys(stageMap)) {
            if (stageMap[stage].some(c => c.id === Number(toContainerId))) {
                toStage = stage as CandidateStage;
                break;
            }
        }
    }
    
    if (toStage && candidate.stage !== toStage) {
      // Optimistic UI update on local state
      setLocalCandidates(prev => prev.map(c => c.id === fromId ? { ...c, stage: toStage! } : c));
      
      // Update the database in the background
      await patchCandidateStage(candidate.id, toStage);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Kanban View</h2>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-6">
          {stages.map(({ stage, color, name }) => (
            <KanbanColumn key={stage} stage={stage} name={name} color={color} candidates={stageMap[stage]}>
              <SortableContext items={stageMap[stage].map((c) => c.id!)} strategy={verticalListSortingStrategy}>
                {stageMap[stage].map((candidate) => (
                  <SortableKanbanCard key={candidate.id} candidate={candidate} />
                ))}
              </SortableContext>
            </KanbanColumn>
          ))}
        </div>
      </DndContext>
    </div>
  );
}