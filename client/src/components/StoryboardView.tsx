/* Atelier Board — Storyboard View (Step 3) */
import { motion } from "framer-motion";
import { Camera, Eye, Smile, MapPin, Sun, Move } from "lucide-react";
import { type StoryboardResult, type DnaProfile, type CategoryId, CATEGORY_DATABASE, EMO_DATABASE } from "@/lib/sop-engine";

const STORYBOARD_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663585810018/EfsUwxPDP5dRXVkiRQ93cT/storyboard-bg-4njo2wWm5Pccvyvsxi96AB.webp";

interface StoryboardViewProps {
  storyboard: StoryboardResult;
  activeIndex: number;
  onSelectPage: (i: number) => void;
  dna: DnaProfile | null;
  category: CategoryId;
}

const distanceIcons: Record<string, string> = {
  'Bust': '👤',
  'Waist': '🧍',
  'Close-up': '🔍',
  'Ext. Close-up': '🔬',
  'Full body': '🧑‍🤝‍🧑',
};

export default function StoryboardView({
  storyboard, activeIndex, onSelectPage, dna, category,
}: StoryboardViewProps) {
  const cat = CATEGORY_DATABASE[category];

  return (
    <motion.section
      className="mt-16"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Section Header */}
      <div className="mb-8">
        <span className="text-xs tracking-[0.2em] uppercase text-primary font-medium">Step 03</span>
        <h2 className="font-serif text-2xl md:text-3xl font-bold mt-1">스토리보드</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          {cat.icon} {cat.name} 카테고리 ·
          <span className="font-medium text-foreground ml-1">{dna?.name}</span> ·
          <span className="ml-1">{storyboard.pages.length}컷 구성</span>
        </p>
      </div>

      {/* Emotion Curve */}
      <div className="bg-card rounded-xl border border-border p-5 mb-6">
        <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
          <Smile className="w-3.5 h-3.5" /> 감정곡선 흐름
        </p>
        <div className="flex items-end gap-1 h-16">
          {storyboard.pages.map((page, i) => {
            const emoLevel = getEmoLevel(page.slot.emo as string);
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                onClick={() => onSelectPage(i)}
                className={`flex-1 rounded-t-md transition-all relative group ${
                  isActive ? 'bg-primary' : 'bg-primary/20 hover:bg-primary/40'
                }`}
                style={{ height: `${Math.max(emoLevel * 12, 8)}%` }}
                title={`${page.slot.pageName} — ${page.emoProfile?.name || page.slot.emo}`}
              >
                <span className={`absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono whitespace-nowrap ${
                  isActive ? 'text-primary font-bold' : 'text-muted-foreground opacity-0 group-hover:opacity-100'
                } transition-opacity`}>
                  {page.slot.id}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex gap-1 mt-1">
          {storyboard.pages.map((page, i) => (
            <div key={i} className="flex-1 text-center">
              <span className="text-[9px] text-muted-foreground">
                {page.emoProfile?.name?.split('·')[0] || '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Storyboard Cards — Horizontal Scroll */}
      <div className="relative rounded-xl overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 opacity-20">
          <img src={STORYBOARD_BG} alt="" className="w-full h-full object-cover" />
        </div>

        <div className="relative p-4 md:p-6">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
            {storyboard.pages.map((page, i) => {
              const isActive = i === activeIndex;
              return (
                <motion.button
                  key={i}
                  onClick={() => onSelectPage(i)}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className={`flex-shrink-0 w-56 md:w-64 snap-center rounded-xl border-2 p-4 text-left transition-all ${
                    isActive
                      ? 'border-primary bg-card shadow-lg shadow-primary/10'
                      : 'border-border/60 bg-card/90 hover:border-primary/40'
                  }`}
                >
                  {/* Page Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-mono font-bold ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {page.slot.id}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {page.slot.pageName}
                    </span>
                  </div>

                  {/* 6 Elements Grid */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Camera className="w-3 h-3 text-primary/60 flex-shrink-0" />
                      <span className="text-muted-foreground">거리</span>
                      <span className="ml-auto font-medium">{page.slot.distance}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-3 h-3 text-primary/60 flex-shrink-0" />
                      <span className="text-muted-foreground">앵글</span>
                      <span className="ml-auto font-medium">{page.slot.angle}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smile className="w-3 h-3 text-primary/60 flex-shrink-0" />
                      <span className="text-muted-foreground">감정</span>
                      <span className="ml-auto font-medium text-primary">
                        {page.emoProfile?.name || page.slot.emo}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Move className="w-3 h-3 text-primary/60 flex-shrink-0" />
                      <span className="text-muted-foreground">행동</span>
                      <span className="ml-auto font-medium text-right max-w-[60%] truncate" title={page.slot.action}>
                        {page.slot.action.length > 20 ? page.slot.action.slice(0, 20) + '...' : page.slot.action}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-primary/60 flex-shrink-0" />
                      <span className="text-muted-foreground">배경</span>
                      <span className="ml-auto font-medium text-right max-w-[60%] truncate" title={page.slot.background}>
                        {page.slot.background.length > 16 ? page.slot.background.slice(0, 16) + '...' : page.slot.background}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun className="w-3 h-3 text-primary/60 flex-shrink-0" />
                      <span className="text-muted-foreground">조명</span>
                      <span className="ml-auto font-medium text-right max-w-[60%] truncate" title={page.slot.lighting}>
                        {page.slot.lighting.length > 16 ? page.slot.lighting.slice(0, 16) + '...' : page.slot.lighting}
                      </span>
                    </div>
                  </div>

                  {/* Copy Draft */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-[10px] text-muted-foreground mb-1">카피 초안</p>
                    <p className="text-xs font-serif italic text-foreground/80 leading-relaxed">
                      "{page.copyDraft}"
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function getEmoLevel(emo: string): number {
  const levels: Record<string, number> = {
    'EMO-01': 5, 'EMO-02': 2, 'EMO-03': 4, 'EMO-04': 5,
    'EMO-04.5': 6, 'EMO-05': 8, 'EMO-06': 1, 'EMO-07': 6, 'EMO-08': 7,
    '(손만)': 3,
  };
  return levels[emo] || 3;
}
