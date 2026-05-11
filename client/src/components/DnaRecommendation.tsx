/* Atelier Board — DNA Recommendation (Step 2) */
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { type DnaId, type CategoryId, DNA_DATABASE, CATEGORY_DATABASE } from "@/lib/sop-engine";

interface DnaRecommendationProps {
  recommendedDnas: DnaId[];
  selectedDna: DnaId | null;
  onSelectDna: (dna: DnaId) => void;
  onConfirm: () => void;
  category: CategoryId;
}

const DNA_CARDS_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663585810018/EfsUwxPDP5dRXVkiRQ93cT/dna-cards-bg-Pe5kst4qT5aXhoFwp6EuQN.webp";

const allDnas: DnaId[] = ['DNA-01', 'DNA-02', 'DNA-03', 'DNA-04', 'DNA-05'];

export default function DnaRecommendation({
  recommendedDnas, selectedDna, onSelectDna, onConfirm, category,
}: DnaRecommendationProps) {
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
        <span className="text-xs tracking-[0.2em] uppercase text-primary font-medium">Step 02</span>
        <h2 className="font-serif text-2xl md:text-3xl font-bold mt-1">모델 DNA 선택</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          <span className="font-medium text-foreground">{cat.icon} {cat.name}</span> 카테고리에 최적화된 모델 DNA를 추천합니다.
          <span className="ml-1 text-primary font-medium">({cat.coreMood})</span>
        </p>
      </div>

      {/* DNA Swatch Banner */}
      <div className="relative rounded-xl overflow-hidden mb-8 h-32 md:h-40">
        <img src={DNA_CARDS_BG} alt="DNA swatches" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-background/80 flex items-center justify-center">
          <p className="font-serif text-lg md:text-xl text-foreground/80 italic">
            피부톤은 브랜드의 첫인상입니다
          </p>
        </div>
      </div>

      {/* DNA Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allDnas.map((dnaId, i) => {
          const dna = DNA_DATABASE[dnaId];
          const isRecommended = recommendedDnas.includes(dnaId);
          const isSelected = selectedDna === dnaId;

          return (
            <motion.button
              key={dnaId}
              onClick={() => onSelectDna(dnaId)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`relative text-left p-5 rounded-xl border-2 transition-all card-lift ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : isRecommended
                    ? 'border-primary/30 bg-card hover:border-primary/60'
                    : 'border-border bg-card/60 hover:border-border'
              }`}
            >
              {/* Recommended badge */}
              {isRecommended && (
                <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> 추천
                </span>
              )}

              {/* Selected check */}
              {isSelected && (
                <span className="absolute top-3 right-3 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}

              {/* Skin swatch + Name */}
              <div className="flex items-center gap-3 mb-3">
                <div className="skin-swatch" style={{ backgroundColor: dna.skinHex }} />
                <div>
                  <p className="font-serif font-bold text-base">{dna.name}</p>
                  <p className="text-xs text-muted-foreground">{dna.id} · {dna.ageRange}</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1.5 text-xs text-foreground/70">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">피부톤</span>
                  <span className="font-medium">{dna.skinTone} {dna.skinHex}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">표정</span>
                  <span>{dna.expressionBase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">앵커</span>
                  <span>{dna.anchor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">가격대</span>
                  <span>{dna.priceRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">강점</span>
                  <span className="text-right max-w-[60%]">{dna.strength}</span>
                </div>
              </div>

              {/* Platforms */}
              <div className="mt-3 flex flex-wrap gap-1">
                {dna.platforms.map(p => (
                  <span key={p} className="px-2 py-0.5 bg-muted rounded text-[10px] text-muted-foreground">
                    {p}
                  </span>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Confirm Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={onConfirm}
          disabled={!selectedDna}
          className={`px-10 py-3.5 rounded-lg font-medium text-sm tracking-wide transition-all ${
            selectedDna
              ? 'bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          스토리보드 생성하기
        </button>
      </div>
    </motion.section>
  );
}
