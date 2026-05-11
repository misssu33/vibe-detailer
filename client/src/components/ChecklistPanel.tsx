/* Atelier Board — Checklist Panel (Phase 1~4 + Reject Criteria) */
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { type CategoryId, getChecklist, getRejectCriteria, CATEGORY_DATABASE } from "@/lib/sop-engine";

interface ChecklistPanelProps {
  category: CategoryId;
}

export default function ChecklistPanel({ category }: ChecklistPanelProps) {
  const checklist = getChecklist();
  const rejectCriteria = getRejectCriteria();
  const cat = CATEGORY_DATABASE[category];
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expandedPhase, setExpandedPhase] = useState<number>(0);
  const [showReject, setShowReject] = useState(false);

  const toggleCheck = (key: string) => {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePhase = (i: number) => {
    setExpandedPhase(expandedPhase === i ? -1 : i);
  };

  return (
    <motion.section
      className="mt-16"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Section Header */}
      <div className="mb-8">
        <span className="text-xs tracking-[0.2em] uppercase text-primary font-medium">Checklist</span>
        <h2 className="font-serif text-2xl md:text-3xl font-bold mt-1">작업 체크리스트</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Phase 1~4 단계별 체크리스트와 거부 컷 기준입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Phase Checklists */}
        <div className="lg:col-span-2 space-y-3">
          {checklist.map((phase, phaseIdx) => {
            const isExpanded = expandedPhase === phaseIdx;
            const completedCount = phase.items.filter((_, i) => checked[`${phaseIdx}-${i}`]).length;
            const progress = (completedCount / phase.items.length) * 100;

            return (
              <div key={phaseIdx} className="bg-card rounded-xl border border-border overflow-hidden">
                {/* Phase Header */}
                <button
                  onClick={() => togglePhase(phaseIdx)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8">
                      <svg className="w-8 h-8 -rotate-90">
                        <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted" />
                        <circle
                          cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2"
                          className="text-primary"
                          strokeDasharray={`${progress * 0.817} 100`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary">
                        {completedCount}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">{phase.phase}</p>
                      <p className="text-xs text-muted-foreground">{completedCount}/{phase.items.length} 완료</p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>

                {/* Phase Items */}
                {isExpanded && (
                  <div className="px-5 pb-4 space-y-2">
                    {phase.items.map((item, itemIdx) => {
                      const key = `${phaseIdx}-${itemIdx}`;
                      const isChecked = checked[key];
                      return (
                        <button
                          key={itemIdx}
                          onClick={() => toggleCheck(key)}
                          className="w-full flex items-start gap-3 py-1.5 text-left group"
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-muted-foreground/40 mt-0.5 flex-shrink-0 group-hover:text-primary/60 transition-colors" />
                          )}
                          <span className={`text-sm ${isChecked ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                            {item}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Reject Criteria */}
        <div>
          <div className="bg-card rounded-xl border border-destructive/30 overflow-hidden">
            <button
              onClick={() => setShowReject(!showReject)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-destructive/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">거부 컷 10대 기준</span>
              </div>
              {showReject ? <ChevronUp className="w-4 h-4 text-destructive/60" /> : <ChevronDown className="w-4 h-4 text-destructive/60" />}
            </button>

            {showReject && (
              <div className="px-5 pb-4 space-y-2">
                <p className="text-xs text-muted-foreground mb-3">다음 중 1개라도 해당 시 즉시 재생성</p>
                {rejectCriteria.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 py-1">
                    <span className="text-xs font-mono text-destructive/60 mt-0.5 flex-shrink-0 w-4">{i + 1}.</span>
                    <span className="text-sm text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Legal Notice */}
          <div className="mt-4 bg-muted/50 rounded-xl border border-border p-4">
            <p className="text-xs font-medium text-foreground mb-2">법적 주의사항</p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• 뷰티: 의학적 효능 표현 금지</li>
              <li>• 식품: 효능·치료 표현 금지</li>
              <li>• 헬스: 식약처 인증 사칭 금지</li>
              <li>• AI 생성 이미지 표기 의무 확인</li>
            </ul>
          </div>

          {/* Category-specific tip */}
          <div className="mt-4 bg-primary/5 rounded-xl border border-primary/20 p-4">
            <p className="text-xs font-medium text-primary mb-1">{cat.icon} {cat.name} 팁</p>
            <p className="text-xs text-foreground/70">
              톤 강도: <span className="font-medium">{cat.toneIntensity}</span><br />
              카피 공식: <span className="font-medium">{cat.copyFormula}</span>
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
