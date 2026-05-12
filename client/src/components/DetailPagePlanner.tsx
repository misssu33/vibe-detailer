/* ═══════════════════════════════════════════════
   Vibe Detailer — Detail Page Planner (Step 04)
   7-Section Framework 기반 상세페이지 기획 플래너
   SOP v5.0 — 한국 이커머스 트렌드 반영
   ═══════════════════════════════════════════════ */
   import { useState, useCallback } from "react";
   import { motion, AnimatePresence } from "framer-motion";
   import {
     Layout, Copy, Check, ChevronRight, ChevronLeft,
     AlertTriangle, Target, Smartphone, FileText,
     TrendingUp, Shield, Zap,
   } from "lucide-react";
   import {
     type CategoryId,
     type SectionId,
     type StoryboardResult,
     type DnaProfile,
     type DetailPagePlan,
     DETAIL_PAGE_SECTIONS,
     PLATFORM_NAME_TO_ID,
     PLATFORM_SPECS,
     generateDetailPagePlan,
     CATEGORY_DATABASE,
   } from "@/lib/sop-engine";
   import { toast } from "sonner";
   
   interface DetailPagePlannerProps {
     category: CategoryId;
     productName: string;
     platform: string;
     storyboard: StoryboardResult;
     dna: DnaProfile | null;
   }
   
   const SECTION_COLORS: Record<SectionId, { bg: string; border: string; badge: string }> = {
     S1_HERO:      { bg: 'bg-violet-50 dark:bg-violet-950/20',  border: 'border-violet-200 dark:border-violet-800',  badge: 'bg-violet-500' },
     S2_PAIN:      { bg: 'bg-orange-50 dark:bg-orange-950/20',  border: 'border-orange-200 dark:border-orange-800',  badge: 'bg-orange-500' },
     S3_BENEFIT:   { bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-200 dark:border-emerald-800', badge: 'bg-emerald-500' },
     S4_SPEC:      { bg: 'bg-blue-50 dark:bg-blue-950/20',      border: 'border-blue-200 dark:border-blue-800',      badge: 'bg-blue-500' },
     S5_LIFESTYLE: { bg: 'bg-amber-50 dark:bg-amber-950/20',    border: 'border-amber-200 dark:border-amber-800',    badge: 'bg-amber-500' },
     S6_SOCIAL:    { bg: 'bg-pink-50 dark:bg-pink-950/20',      border: 'border-pink-200 dark:border-pink-800',      badge: 'bg-pink-500' },
     S7_CTA:       { bg: 'bg-red-50 dark:bg-red-950/20',        border: 'border-red-200 dark:border-red-800',        badge: 'bg-red-500' },
   };
   
   const SECTION_ICONS: Record<SectionId, React.ReactNode> = {
     S1_HERO:      <Zap className="w-4 h-4" />,
     S2_PAIN:      <AlertTriangle className="w-4 h-4" />,
     S3_BENEFIT:   <TrendingUp className="w-4 h-4" />,
     S4_SPEC:      <Shield className="w-4 h-4" />,
     S5_LIFESTYLE: <Target className="w-4 h-4" />,
     S6_SOCIAL:    <FileText className="w-4 h-4" />,
     S7_CTA:       <ChevronRight className="w-4 h-4" />,
   };
   
   export default function DetailPagePlanner({
     category, productName, platform, storyboard, dna,
   }: DetailPagePlannerProps) {
     const plan: DetailPagePlan = generateDetailPagePlan(
       productName, category, platform, storyboard
     );
   
     const [activeIdx, setActiveIdx] = useState(0);
     const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
     const [copiedKey, setCopiedKey] = useState<string | null>(null);
     const [viewMode, setViewMode] = useState<'detail' | 'overview'>('detail');
   
     const cat = CATEGORY_DATABASE[category];
     const activePlanItem = plan.sections[activeIdx];
     const activeSection = activePlanItem?.section;
     const activeCopy = activePlanItem?.copy;
     const colors = activeSection ? SECTION_COLORS[activeSection.id] : SECTION_COLORS.S1_HERO;
   
     const totalCheckpoints = plan.sections.reduce((acc, s) => acc + s.section.checkpoints.length, 0);
     const completedCheckpoints = Object.values(checkedItems).filter(Boolean).length;
     const progressPct = totalCheckpoints > 0 ? Math.round((completedCheckpoints / totalCheckpoints) * 100) : 0;
   
     const handleCopy = useCallback(async (text: string, key: string) => {
       await navigator.clipboard.writeText(text);
       setCopiedKey(key);
       toast.success('복사되었습니다');
       setTimeout(() => setCopiedKey(null), 2000);
     }, []);
   
     const toggleCheck = useCallback((key: string) => {
       setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
     }, []);
   
     const handleCopyAllCopy = useCallback(async () => {
       const allCopy = plan.sections.map(({ section, copy }) =>
         `【${section.title} (${section.titleEn})】\n헤드라인: ${copy.headline}\n서브카피: ${copy.subCopy}\n카피공식: ${section.copyFormula}\n금지패턴: ${section.forbiddenPatterns.join(', ')}`
       ).join('\n\n' + '─'.repeat(40) + '\n\n');
       await navigator.clipboard.writeText(allCopy);
       toast.success('전체 섹션 카피가 복사되었습니다');
     }, [plan]);
   
     return (
       <motion.section
         className="mt-16"
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6 }}
       >
         {/* ── Section Header ── */}
         <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
           <div>
             <span className="text-xs tracking-[0.2em] uppercase text-primary font-medium">Step 04</span>
             <h2 className="font-serif text-2xl md:text-3xl font-bold mt-1">상세페이지 기획</h2>
             <p className="text-muted-foreground mt-2 text-sm">
               7-Section Framework 기반 · {cat.icon} {cat.name} ·
               <span className="font-medium text-foreground ml-1">{platform || '플랫폼 미선택'}</span>
             </p>
           </div>
           <div className="flex items-center gap-2">
             {/* View Mode Toggle */}
             <div className="flex bg-muted rounded-lg p-1">
               <button
                 onClick={() => setViewMode('detail')}
                 className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                   viewMode === 'detail' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
                 }`}
               >
                 상세 보기
               </button>
               <button
                 onClick={() => setViewMode('overview')}
                 className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                   viewMode === 'overview' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
                 }`}
               >
                 전체 보기
               </button>
             </div>
             <button
               onClick={handleCopyAllCopy}
               className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted text-xs font-medium transition-colors"
             >
               <FileText className="w-3.5 h-3.5" />
               전체 카피 복사
             </button>
           </div>
         </div>
   
         {/* ── Progress Bar ── */}
         <div className="bg-card rounded-xl border border-border p-4 mb-6">
           <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-medium text-muted-foreground">체크리스트 진행률</span>
             <span className="text-sm font-bold text-primary">{progressPct}%</span>
           </div>
           <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
             <motion.div
               className="h-full bg-primary rounded-full"
               initial={{ width: 0 }}
               animate={{ width: `${progressPct}%` }}
               transition={{ duration: 0.5 }}
             />
           </div>
           <p className="text-xs text-muted-foreground mt-1">{completedCheckpoints} / {totalCheckpoints} 항목 완료</p>
         </div>
   
         {/* ── 7-Section Tab Bar ── */}
         <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2 scrollbar-thin">
           {plan.sections.map(({ section }, i) => {
             const color = SECTION_COLORS[section.id];
             const isActive = i === activeIdx;
             const sectionChecked = section.checkpoints.filter(
               (_, ci) => checkedItems[`${section.id}-${ci}`]
             ).length;
             return (
               <button
                 key={section.id}
                 onClick={() => { setActiveIdx(i); setViewMode('detail'); }}
                 className={`flex-shrink-0 flex flex-col items-start px-3 py-2.5 rounded-xl border-2 transition-all min-w-[100px] ${
                   isActive
                     ? `${color.bg} ${color.border} shadow-sm`
                     : 'border-border bg-card hover:border-primary/30'
                 }`}
               >
                 <div className="flex items-center gap-1.5 mb-1">
                   <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${color.badge}`}>
                     {section.index}
                   </span>
                   <span className={`text-[10px] font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                     {section.titleEn}
                   </span>
                 </div>
                 <span className={`text-xs font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                   {section.title}
                 </span>
                 <div className="mt-1.5 w-full h-1 bg-muted/60 rounded-full overflow-hidden">
                   <div
                     className={`h-full rounded-full transition-all ${color.badge}`}
                     style={{ width: `${section.checkpoints.length > 0 ? (sectionChecked / section.checkpoints.length) * 100 : 0}%` }}
                   />
                 </div>
               </button>
             );
           })}
         </div>
   
         {/* ── Overview Mode ── */}
         {viewMode === 'overview' && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="space-y-3"
           >
             {plan.sections.map(({ section, copy, linkedPages }, i) => {
               const color = SECTION_COLORS[section.id];
               return (
                 <div
                   key={section.id}
                   className={`rounded-xl border p-4 ${color.bg} ${color.border}`}
                 >
                   <div className="flex items-start justify-between gap-4">
                     <div className="flex items-center gap-3">
                       <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${color.badge}`}>
                         {section.index}
                       </span>
                       <div>
                         <p className="font-bold text-sm">{section.title}
                           <span className="text-muted-foreground font-normal ml-2 text-xs">({section.titleEn})</span>
                         </p>
                         <p className="text-xs text-muted-foreground mt-0.5">{section.purpose}</p>
                       </div>
                     </div>
                     <button
                       onClick={() => { setActiveIdx(i); setViewMode('detail'); }}
                       className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium hover:bg-muted transition-colors"
                     >
                       상세 보기
                     </button>
                   </div>
                   <div className="mt-3 pl-10">
                     <p className="text-xs text-muted-foreground mb-1">카피 예시</p>
                     <p className="text-sm font-serif italic">"{copy.subCopy}"</p>
                     <div className="flex items-center gap-2 mt-2 flex-wrap">
                       {section.linkedPageIds.map(pid => (
                         <span key={pid} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-mono rounded-md">{pid}</span>
                       ))}
                       <span className="text-[10px] text-muted-foreground">KPI: {section.kpiTarget}</span>
                     </div>
                   </div>
                 </div>
               );
             })}
           </motion.div>
         )}
   
         {/* ── Detail Mode ── */}
         {viewMode === 'detail' && activeSection && activeCopy && (
           <AnimatePresence mode="wait">
             <motion.div
               key={activeIdx}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.25 }}
               className="grid grid-cols-1 lg:grid-cols-3 gap-5"
             >
               {/* ── Left: Main Section Content ── */}
               <div className="lg:col-span-2 space-y-4">
   
                 {/* Section Header Card */}
                 <div className={`rounded-xl border-2 p-5 ${colors.bg} ${colors.border}`}>
                   <div className="flex items-start justify-between mb-4">
                     <div className="flex items-center gap-3">
                       <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${colors.badge}`}>
                         {SECTION_ICONS[activeSection.id]}
                       </span>
                       <div>
                         <div className="flex items-center gap-2">
                           <h3 className="font-serif font-bold text-lg">{activeSection.title}</h3>
                           <span className="text-xs text-muted-foreground font-normal">({activeSection.titleEn})</span>
                         </div>
                         <p className="text-sm text-primary font-medium mt-0.5">{activeSection.purpose}</p>
                       </div>
                     </div>
                     <div className="text-right">
                       <span className="text-3xl font-mono font-bold text-muted-foreground/20">
                         {activeSection.index}/7
                       </span>
                     </div>
                   </div>
   
                   {/* KPI Target */}
                   <div className="flex items-center gap-2 px-3 py-2 bg-card/80 rounded-lg border border-border/50 w-fit">
                     <TrendingUp className="w-3.5 h-3.5 text-primary" />
                     <span className="text-xs text-muted-foreground">KPI 목표:</span>
                     <span className="text-xs font-bold text-primary">{activeSection.kpiTarget}</span>
                   </div>
                 </div>
   
                 {/* Copy Formula + Examples */}
                 <div className="bg-card rounded-xl border border-border p-5">
                   <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                     <Copy className="w-3.5 h-3.5" /> 카피라이팅 가이드
                   </h4>
   
                   {/* Formula */}
                   <div className="bg-muted/50 rounded-lg p-3 mb-3">
                     <p className="text-[10px] text-muted-foreground mb-1">카피 공식</p>
                     <p className="text-sm font-medium">{activeSection.copyFormula}</p>
                   </div>
   
                   {/* Headline */}
                   <div className={`rounded-lg p-4 border mb-3 ${colors.bg} ${colors.border}`}>
                     <div className="flex items-center justify-between mb-2">
                       <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">헤드라인</p>
                       <button
                         onClick={() => handleCopy(activeCopy.headline, `headline-${activeIdx}`)}
                         className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/70 transition-colors"
                       >
                         {copiedKey === `headline-${activeIdx}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                         복사
                       </button>
                     </div>
                     <p className="font-serif font-bold text-base">{activeCopy.headline}</p>
                   </div>
   
                   {/* Sub Copy */}
                   <div className="bg-primary/5 rounded-lg p-4 border border-primary/20 mb-3">
                     <div className="flex items-center justify-between mb-2">
                       <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">카피 예시 ({cat.name})</p>
                       <button
                         onClick={() => handleCopy(activeCopy.subCopy, `sub-${activeIdx}`)}
                         className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/70 transition-colors"
                       >
                         {copiedKey === `sub-${activeIdx}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                         복사
                       </button>
                     </div>
                     <p className="font-serif italic text-sm leading-relaxed">"{activeCopy.subCopy}"</p>
                   </div>
   
                   {/* CTA Copy */}
                   <div className="flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2">
                     <div>
                       <p className="text-[10px] text-muted-foreground">CTA 문구</p>
                       <p className="text-sm font-bold text-primary">{activeCopy.ctaCopy}</p>
                     </div>
                     <button
                       onClick={() => handleCopy(activeCopy.ctaCopy, `cta-${activeIdx}`)}
                       className="p-1.5 rounded hover:bg-muted transition-colors"
                     >
                       {copiedKey === `cta-${activeIdx}` ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                     </button>
                   </div>
                 </div>
   
                 {/* Layout + Mobile Spec */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   <div className="bg-card rounded-xl border border-border p-4">
                     <div className="flex items-center gap-1.5 mb-2">
                       <Layout className="w-3.5 h-3.5 text-primary" />
                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">레이아웃 가이드</p>
                     </div>
                     <p className="text-xs text-foreground/80 leading-relaxed">{activeSection.layoutGuide}</p>
                   </div>
                   <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800 p-4">
                     <div className="flex items-center gap-1.5 mb-2">
                       <Smartphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                       <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">모바일 스펙</p>
                     </div>
                     <p className="text-xs text-foreground/80 leading-relaxed">{activeSection.mobileSpec}</p>
                   </div>
                 </div>
   
                 {/* Forbidden Patterns */}
                 <div className="bg-card rounded-xl border border-destructive/30 p-4">
                   <div className="flex items-center gap-1.5 mb-3">
                     <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                     <p className="text-xs font-bold text-destructive uppercase tracking-wider">금지 패턴</p>
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {activeSection.forbiddenPatterns.map((fp, i) => (
                       <span key={i} className="px-2 py-1 bg-destructive/5 border border-destructive/20 text-destructive text-xs rounded-lg">
                         ✕ {fp}
                       </span>
                     ))}
                   </div>
                 </div>
   
                 {/* Checkpoints */}
                 <div className="bg-card rounded-xl border border-border p-5">
                   <div className="flex items-center justify-between mb-4">
                     <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                       <Check className="w-3.5 h-3.5" /> 섹션 체크포인트
                     </p>
                     <span className="text-xs text-primary font-medium">
                       {activeSection.checkpoints.filter((_, ci) => checkedItems[`${activeSection.id}-${ci}`]).length}
                       /{activeSection.checkpoints.length}
                     </span>
                   </div>
                   <div className="space-y-2">
                     {activeSection.checkpoints.map((cp, ci) => {
                       const key = `${activeSection.id}-${ci}`;
                       const isChecked = checkedItems[key];
                       return (
                         <button
                           key={ci}
                           onClick={() => toggleCheck(key)}
                           className="w-full flex items-start gap-3 py-2 text-left group hover:bg-muted/30 rounded-lg px-2 transition-colors"
                         >
                           <div className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                             isChecked ? 'bg-primary border-primary' : 'border-muted-foreground/30 group-hover:border-primary/60'
                           }`}>
                             {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
                           </div>
                           <span className={`text-sm transition-colors ${isChecked ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                             {cp}
                           </span>
                         </button>
                       );
                     })}
                   </div>
                 </div>
   
                 {/* Linked Storyboard Pages */}
                 {activePlanItem.linkedPages.length > 0 && (
                   <div className="bg-card rounded-xl border border-border p-5">
                     <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                       연결된 스토리보드 컷
                     </p>
                     <div className="flex gap-3 overflow-x-auto pb-2">
                       {activePlanItem.linkedPages.map((page, i) => (
                         <div key={i} className={`flex-shrink-0 w-52 rounded-xl border p-3 ${colors.bg} ${colors.border}`}>
                           <div className="flex items-center justify-between mb-2">
                             <span className="font-mono text-xs font-bold text-primary">{page.slot.id}</span>
                             <span className="text-[10px] px-2 py-0.5 bg-card rounded-full text-muted-foreground">
                               {page.slot.pageName}
                             </span>
                           </div>
                           <div className="space-y-1 text-xs">
                             <p><span className="text-muted-foreground">감정:</span> <span className="font-medium text-primary">{page.emoProfile?.name || page.slot.emo}</span></p>
                             <p><span className="text-muted-foreground">거리:</span> {page.slot.distance}</p>
                             <p><span className="text-muted-foreground">앵글:</span> {page.slot.angle}</p>
                             <p><span className="text-muted-foreground">조명:</span> {page.slot.lighting.length > 20 ? page.slot.lighting.slice(0, 20) + '...' : page.slot.lighting}</p>
                           </div>
                           <div className="mt-2 pt-2 border-t border-border/50">
                             <p className="text-[10px] text-muted-foreground mb-0.5">카피 초안</p>
                             <p className="text-xs font-serif italic text-foreground/70">"{page.copyDraft}"</p>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
   
                 {/* Navigation */}
                 <div className="flex items-center justify-between">
                   <button
                     onClick={() => setActiveIdx(Math.max(0, activeIdx - 1))}
                     disabled={activeIdx === 0}
                     className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-sm transition-colors disabled:opacity-30"
                   >
                     <ChevronLeft className="w-4 h-4" />
                     이전 섹션
                   </button>
                   <span className="text-xs text-muted-foreground">{activeIdx + 1} / {plan.sections.length}</span>
                   <button
                     onClick={() => setActiveIdx(Math.min(plan.sections.length - 1, activeIdx + 1))}
                     disabled={activeIdx === plan.sections.length - 1}
                     className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-sm transition-colors disabled:opacity-30"
                   >
                     다음 섹션
                     <ChevronRight className="w-4 h-4" />
                   </button>
                 </div>
               </div>
   
               {/* ── Right Panel ── */}
               <div className="space-y-4">
                 {/* Platform Spec Card */}
                 {plan.platformSpec ? (
                   <div className="bg-card rounded-xl border border-border p-5">
                     <p className="text-xs font-bold uppercase tracking-wider text-primary mb-4">
                       📦 {plan.platformSpec.name} 가이드
                     </p>
                     <div className="space-y-2 text-xs mb-4">
                       <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                         <span className="text-muted-foreground">권장 해상도</span>
                         <span className="font-bold">{plan.platformSpec.imageWidthPx}px</span>
                       </div>
                       <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                         <span className="text-muted-foreground">최대 용량</span>
                         <span className="font-bold">{plan.platformSpec.maxFileSizeMB === 999 ? '제한 없음' : `${plan.platformSpec.maxFileSizeMB}MB`}</span>
                       </div>
                       <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                         <span className="text-muted-foreground">포맷</span>
                         <span className="font-bold">{plan.platformSpec.formats.join(' / ')}</span>
                       </div>
                       <div className="flex items-start gap-2 py-1.5">
                         <span className="text-muted-foreground flex-shrink-0">컬러</span>
                         <span className="text-right">{plan.platformSpec.colorNote}</span>
                       </div>
                     </div>
                     <div className="bg-muted/30 rounded-lg p-3 mb-3">
                       <p className="text-[10px] text-muted-foreground mb-1 font-bold uppercase">SEO 전략</p>
                       <p className="text-xs leading-relaxed">{plan.platformSpec.seoStrategy}</p>
                     </div>
                     {plan.platformSpec.prohibitions.length > 0 && (
                       <div className="bg-destructive/5 rounded-lg p-3 border border-destructive/20">
                         <p className="text-[10px] text-destructive font-bold mb-2">⛔ 금지 사항</p>
                         {plan.platformSpec.prohibitions.map((p, i) => (
                           <p key={i} className="text-xs text-destructive/80 mb-1">• {p}</p>
                         ))}
                       </div>
                     )}
                     {/* Section Priority for this platform */}
                     <div className="mt-3 pt-3 border-t border-border">
                       <p className="text-[10px] text-muted-foreground font-bold mb-2">이 플랫폼 섹션 우선순위</p>
                       <div className="flex flex-wrap gap-1">
                         {plan.platformSpec.sectionPriority.map((sid, i) => {
                           const s = DETAIL_PAGE_SECTIONS[sid];
                           const c = SECTION_COLORS[sid];
                           return (
                             <button
                               key={sid}
                               onClick={() => {
                                 const idx = plan.sections.findIndex(ps => ps.section.id === sid);
                                 if (idx >= 0) { setActiveIdx(idx); setViewMode('detail'); }
                               }}
                               className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium border ${c.bg} ${c.border}`}
                             >
                               <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[8px] font-bold ${c.badge}`}>
                                 {i + 1}
                               </span>
                               {s.titleEn}
                             </button>
                           );
                         })}
                       </div>
                     </div>
                   </div>
                 ) : (
                   <div className="bg-muted/30 rounded-xl border border-dashed border-border p-5 text-center">
                     <p className="text-sm text-muted-foreground">플랫폼을 선택하면</p>
                     <p className="text-sm text-muted-foreground">최적화 가이드가 표시됩니다</p>
                   </div>
                 )}
   
                 {/* DNA Tip Card */}
                 {dna && (
                   <div className="bg-primary/5 rounded-xl border border-primary/20 p-5">
                     <p className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                       💡 {dna.name} 연출 팁
                     </p>
                     <div className="space-y-2 text-xs">
                       <div className="flex justify-between py-1 border-b border-primary/10">
                         <span className="text-muted-foreground">표정 베이스</span>
                         <span className="font-medium text-right max-w-[55%]">{dna.expressionBase}</span>
                       </div>
                       <div className="flex justify-between py-1 border-b border-primary/10">
                         <span className="text-muted-foreground">피부톤</span>
                         <span className="font-medium flex items-center gap-1">
                           <span className="w-3 h-3 rounded-full border border-border inline-block" style={{ backgroundColor: dna.skinHex }} />
                           {dna.skinTone}
                         </span>
                       </div>
                       <div className="flex justify-between py-1 border-b border-primary/10">
                         <span className="text-muted-foreground">앵커 위치</span>
                         <span className="font-medium text-right max-w-[55%]">{dna.anchor}</span>
                       </div>
                       <div className="flex justify-between py-1 border-b border-primary/10">
                         <span className="text-muted-foreground">메이크업</span>
                         <span className="font-medium text-right max-w-[55%]">{dna.makeup}</span>
                       </div>
                       <div className="py-1">
                         <span className="text-muted-foreground">강점</span>
                         <p className="font-medium mt-0.5 text-primary/80">{dna.strength}</p>
                       </div>
                     </div>
                   </div>
                 )}
   
                 {/* Category-specific Tip */}
                 <div className="bg-card rounded-xl border border-border p-5">
                   <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                     {cat.icon} {cat.name} 카테고리 팁
                   </p>
                   <div className="space-y-2 text-xs">
                     <div>
                       <p className="text-muted-foreground mb-0.5">톤 강도</p>
                       <p className="font-medium">{cat.toneIntensity}</p>
                     </div>
                     <div>
                       <p className="text-muted-foreground mb-0.5">핵심 무드</p>
                       <p className="font-medium">{cat.coreMood}</p>
                     </div>
                     <div>
                       <p className="text-muted-foreground mb-0.5">카피 공식</p>
                       <p className="font-medium text-primary">{cat.copyFormula}</p>
                     </div>
                   </div>
                 </div>
   
                 {/* Legal Notice */}
                 <div className="bg-muted/50 rounded-xl border border-border p-4">
                   <p className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                     <Shield className="w-3.5 h-3.5" /> 법적 주의사항
                   </p>
                   <ul className="space-y-1 text-xs text-muted-foreground">
                     <li>• 뷰티: 의학적 효능 표현 금지</li>
                     <li>• 식품: 효능·치료 표현 금지</li>
                     <li>• 헬스: 식약처 인증 사칭 금지</li>
                     <li>• AI 생성 이미지 표기 의무 확인</li>
                     <li>• 공정거래위원회 표시광고법 준수</li>
                   </ul>
                 </div>
               </div>
             </motion.div>
           </AnimatePresence>
         )}
       </motion.section>
     );
   }
   