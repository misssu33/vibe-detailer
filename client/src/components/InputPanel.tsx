/* Atelier Board — Input Panel (Step 1: 재료 준비) */
import { motion } from "framer-motion";
import { Package, Tag, Banknote, Store, Layers } from "lucide-react";
import { type CategoryId, type GenerationMode, CATEGORY_DATABASE } from "@/lib/sop-engine";

interface InputPanelProps {
  productName: string;
  setProductName: (v: string) => void;
  category: CategoryId | null;
  setCategory: (v: CategoryId | null) => void;
  priceRange: string;
  setPriceRange: (v: string) => void;
  platform: string;
  setPlatform: (v: string) => void;
  mode: GenerationMode;
  setMode: (v: GenerationMode) => void;
  onSubmit: () => void;
}

const categories = Object.values(CATEGORY_DATABASE);

const modeOptions: { value: GenerationMode; label: string; desc: string }[] = [
  { value: 'full8', label: '풀세트 8컷', desc: '전 카테고리 표준' },
  { value: 'pas5', label: 'PAS 5컷', desc: '헬스·디지털 최적' },
  { value: 'ba2', label: 'B/A 2컷', desc: '비포·애프터 비교' },
  { value: 'custom', label: '커스텀', desc: '사용자 지정' },
];

const priceOptions = ['10~80k', '30~100k', '80~300k', '150k+'];
const platformOptions = ['무신사', '쿠팡', '스마트스토어', '마켓컬리', '올리브영', '29CM', 'W컨셉', '기타'];

export default function InputPanel({
  productName, setProductName,
  category, setCategory,
  priceRange, setPriceRange,
  platform, setPlatform,
  mode, setMode,
  onSubmit,
}: InputPanelProps) {
  const isValid = productName.trim().length > 0 && category !== null;

  return (
    <motion.section
      id="input-section"
      className="mt-12 md:mt-16"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Section Header */}
      <div className="mb-8">
        <span className="text-xs tracking-[0.2em] uppercase text-primary font-medium">Step 01</span>
        <h2 className="font-serif text-2xl md:text-3xl font-bold mt-1">재료 준비</h2>
        <p className="text-muted-foreground mt-2 text-sm">상품 정보를 입력하면 최적의 모델과 시나리오를 추천합니다.</p>
      </div>

      {/* Input Card */}
      <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Package className="w-4 h-4 text-primary" />
              상품명 <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              placeholder="예: 글로우 세럼 30ml, 캐시미어 니트, 유기농 흑돼지 세트..."
              className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          {/* Category */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
              <Tag className="w-4 h-4 text-primary" />
              카테고리 <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                    category === cat.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card hover:border-primary/40 text-foreground/70 hover:text-foreground'
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Banknote className="w-4 h-4 text-primary" />
              가격대 <span className="text-muted-foreground text-xs">(선택)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {priceOptions.map(p => (
                <button
                  key={p}
                  onClick={() => setPriceRange(priceRange === p ? '' : p)}
                  className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${
                    priceRange === p
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Store className="w-4 h-4 text-primary" />
              판매 플랫폼 <span className="text-muted-foreground text-xs">(선택)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {platformOptions.map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(platform === p ? '' : p)}
                  className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${
                    platform === p
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Generation Mode */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
              <Layers className="w-4 h-4 text-primary" />
              생성 모드
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {modeOptions.map(m => (
                <button
                  key={m.value}
                  onClick={() => setMode(m.value)}
                  className={`flex flex-col items-start px-4 py-3 rounded-lg border text-left transition-all ${
                    mode === m.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-primary/40'
                  }`}
                >
                  <span className={`text-sm font-medium ${mode === m.value ? 'text-primary' : 'text-foreground/70'}`}>
                    {m.label}
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onSubmit}
            disabled={!isValid}
            className={`px-10 py-3.5 rounded-lg font-medium text-sm tracking-wide transition-all ${
              isValid
                ? 'bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            모델 DNA 추천받기
          </button>
        </div>
      </div>
    </motion.section>
  );
}
