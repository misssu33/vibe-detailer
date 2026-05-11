/* ═══════════════════════════════════════════════
   Vibe Detailer — Custom DNA Editor
   Design: Atelier Board / Craft Minimal
   사용자가 피부톤, 표정, 앵커, 연령대, 헤어,
   메이크업, 체형 등을 직접 조합하는 편집 모드
   ═══════════════════════════════════════════════ */
import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Palette, Smile, Anchor, Scissors, Sparkles,
  User, Ruler, PenTool, Check, RotateCcw, ChevronDown, ChevronUp,
} from "lucide-react";
import {
  type DnaProfile,
  type DnaId,
  createDefaultCustomDna,
  SKIN_TONE_PRESETS,
  FACE_SHAPE_OPTIONS,
  EXPRESSION_PRESETS,
  HAIR_PRESETS,
  MAKEUP_PRESETS,
  ANCHOR_PRESETS,
  HEIGHT_PRESETS,
  DNA_DATABASE,
} from "@/lib/sop-engine";

interface CustomDnaEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dna: DnaProfile) => void;
  initialDna?: DnaProfile | null;
}

type EditorSection = 'skin' | 'face' | 'expression' | 'hair' | 'makeup' | 'anchor' | 'height' | 'meta';

const SECTIONS: { id: EditorSection; label: string; icon: React.ReactNode }[] = [
  { id: 'skin', label: '피부톤', icon: <Palette className="w-4 h-4" /> },
  { id: 'face', label: '얼굴형', icon: <User className="w-4 h-4" /> },
  { id: 'expression', label: '표정', icon: <Smile className="w-4 h-4" /> },
  { id: 'hair', label: '헤어', icon: <Scissors className="w-4 h-4" /> },
  { id: 'makeup', label: '메이크업', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'anchor', label: '앵커(특이점)', icon: <Anchor className="w-4 h-4" /> },
  { id: 'height', label: '체형', icon: <Ruler className="w-4 h-4" /> },
  { id: 'meta', label: '기본 정보', icon: <PenTool className="w-4 h-4" /> },
];

export default function CustomDnaEditor({ isOpen, onClose, onSave, initialDna }: CustomDnaEditorProps) {
  const [dna, setDna] = useState<DnaProfile>(initialDna || createDefaultCustomDna());
  const [activeSection, setActiveSection] = useState<EditorSection>('skin');
  const [baseDna, setBaseDna] = useState<string>('none');

  // Update a single field
  const updateField = useCallback(<K extends keyof DnaProfile>(key: K, value: DnaProfile[K]) => {
    setDna(prev => ({ ...prev, [key]: value }));
  }, []);

  // Load from existing DNA preset
  const loadFromPreset = useCallback((presetId: string) => {
    if (presetId === 'none') {
      setDna(createDefaultCustomDna());
    } else {
      const preset = DNA_DATABASE[presetId];
      if (preset) {
        setDna({
          ...preset,
          id: 'CUSTOM' as DnaId,
          name: `${preset.name} (커스텀)`,
          nameEn: `${preset.nameEn} (Custom)`,
          strength: '사용자 커스텀',
        });
      }
    }
    setBaseDna(presetId);
  }, []);

  // Reset to default
  const handleReset = useCallback(() => {
    setDna(createDefaultCustomDna());
    setBaseDna('none');
  }, []);

  // Completeness check
  const completeness = useMemo(() => {
    let filled = 0;
    const total = 8;
    if (dna.skinTone && dna.skinHex) filled++;
    if (dna.faceShape) filled++;
    if (dna.expressionBase) filled++;
    if (dna.hair) filled++;
    if (dna.makeup) filled++;
    if (dna.anchor) filled++;
    if (dna.height) filled++;
    if (dna.name && dna.ageRange) filled++;
    return { filled, total, percent: Math.round((filled / total) * 100) };
  }, [dna]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-3xl max-h-[90vh] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col"
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: dna.skinHex }}>
                <User className="w-5 h-5 text-white/80" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold">커스텀 DNA 편집</h2>
                <p className="text-xs text-muted-foreground">피부톤, 표정, 앵커 등을 자유롭게 조합하세요</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                title="초기화"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col md:flex-row">
              {/* Left: Section Navigation */}
              <div className="md:w-52 border-b md:border-b-0 md:border-r border-border bg-muted/20 p-3 md:p-4">
                {/* Base DNA selector */}
                <div className="mb-4">
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5 block">
                    베이스 DNA
                  </label>
                  <select
                    value={baseDna}
                    onChange={(e) => loadFromPreset(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-border bg-card text-foreground"
                  >
                    <option value="none">처음부터 만들기</option>
                    <option value="DNA-01">DNA-01 내추럴 클린</option>
                    <option value="DNA-02">DNA-02 시크 모던</option>
                    <option value="DNA-03">DNA-03 프레시 글로우</option>
                    <option value="DNA-04">DNA-04 엘레강스 미니멀</option>
                    <option value="DNA-05">DNA-05 키즈맘 친근형</option>
                  </select>
                </div>

                {/* Section tabs */}
                <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
                  {SECTIONS.map(section => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                        activeSection === section.id
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {section.icon}
                      {section.label}
                    </button>
                  ))}
                </div>

                {/* Completeness */}
                <div className="mt-4 p-3 bg-card rounded-lg border border-border hidden md:block">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-muted-foreground">완성도</span>
                    <span className="text-xs font-bold text-primary">{completeness.percent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${completeness.percent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{completeness.filled}/{completeness.total} 항목</p>
                </div>
              </div>

              {/* Right: Editor Content */}
              <div className="flex-1 p-5 md:p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Skin Tone */}
                    {activeSection === 'skin' && (
                      <SkinToneEditor dna={dna} updateField={updateField} />
                    )}

                    {/* Face Shape */}
                    {activeSection === 'face' && (
                      <PresetSelector
                        title="얼굴형"
                        description="모델의 얼굴형을 선택하세요. AI 생성 시 얼굴 비율과 윤곽에 영향을 줍니다."
                        options={FACE_SHAPE_OPTIONS}
                        value={dna.faceShape}
                        onChange={(v) => updateField('faceShape', v)}
                        allowCustom
                      />
                    )}

                    {/* Expression */}
                    {activeSection === 'expression' && (
                      <PresetSelector
                        title="기본 표정"
                        description="마스터 컷의 기본 표정입니다. 스토리보드 각 페이지에서는 EMO 곡선에 따라 자동 변형됩니다."
                        options={EXPRESSION_PRESETS}
                        value={dna.expressionBase}
                        onChange={(v) => updateField('expressionBase', v)}
                        allowCustom
                      />
                    )}

                    {/* Hair */}
                    {activeSection === 'hair' && (
                      <PresetSelector
                        title="헤어 스타일"
                        description="모델의 헤어 길이, 색상, 스타일을 지정합니다. 모든 컷에서 일관되게 유지됩니다."
                        options={HAIR_PRESETS}
                        value={dna.hair}
                        onChange={(v) => updateField('hair', v)}
                        allowCustom
                      />
                    )}

                    {/* Makeup */}
                    {activeSection === 'makeup' && (
                      <PresetSelector
                        title="메이크업"
                        description="립 컬러, 질감, 전체 메이크업 톤을 지정합니다."
                        options={MAKEUP_PRESETS}
                        value={dna.makeup}
                        onChange={(v) => updateField('makeup', v)}
                        allowCustom
                      />
                    )}

                    {/* Anchor */}
                    {activeSection === 'anchor' && (
                      <div>
                        <PresetSelector
                          title="앵커 (특이점)"
                          description="점, 주근깨 등 모델의 고유 식별 포인트입니다. 모든 컷에서 동일 위치에 유지되어야 합니다."
                          options={ANCHOR_PRESETS}
                          value={dna.anchor}
                          onChange={(v) => updateField('anchor', v)}
                          allowCustom
                        />
                        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                          <p className="text-xs text-primary font-medium mb-1">앵커 규칙</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            앵커는 모든 컷에서 동일한 위치에 나타나야 합니다. 위치가 변하면 거부 컷 기준에 해당됩니다.
                            점, 주근깨, 눈썹 형태 등 미세한 특징을 선택하세요.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Height */}
                    {activeSection === 'height' && (
                      <PresetSelector
                        title="체형"
                        description="모델의 키와 체형을 지정합니다. 전신 컷에서 비율에 영향을 줍니다."
                        options={HEIGHT_PRESETS}
                        value={dna.height}
                        onChange={(v) => updateField('height', v)}
                        allowCustom
                      />
                    )}

                    {/* Meta */}
                    {activeSection === 'meta' && (
                      <MetaEditor dna={dna} updateField={updateField} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Footer: Preview + Save */}
          <div className="border-t border-border bg-muted/30 px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Mini Preview */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-border" style={{ backgroundColor: dna.skinHex }} />
                <div className="text-xs">
                  <p className="font-medium text-foreground">{dna.name || '커스텀 DNA'}</p>
                  <p className="text-muted-foreground">{dna.ageRange} · {dna.faceShape} · {dna.expressionBase}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={() => onSave(dna)}
                  className="px-6 py-2.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  DNA 적용하기
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Sub-components ─── */

function SkinToneEditor({ dna, updateField }: {
  dna: DnaProfile;
  updateField: <K extends keyof DnaProfile>(key: K, value: DnaProfile[K]) => void;
}) {
  const [customHex, setCustomHex] = useState(dna.skinHex);

  return (
    <div>
      <h3 className="font-serif text-base font-bold mb-1">피부톤</h3>
      <p className="text-xs text-muted-foreground mb-4">
        한국 파운데이션 호수 기반 프리셋을 선택하거나, 직접 HEX 코드를 입력하세요.
      </p>

      {/* Preset Swatches */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 mb-5">
        {SKIN_TONE_PRESETS.map(preset => {
          const isSelected = dna.skinHex === preset.hex;
          return (
            <button
              key={preset.hex}
              onClick={() => {
                updateField('skinTone', preset.tone);
                updateField('skinHex', preset.hex);
                setCustomHex(preset.hex);
              }}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all ${
                isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-transparent hover:border-border'
              }`}
            >
              <div
                className="w-10 h-10 rounded-full border border-border/50 shadow-inner"
                style={{ backgroundColor: preset.hex }}
              />
              <span className="text-[10px] text-center leading-tight text-muted-foreground">{preset.label}</span>
            </button>
          );
        })}
      </div>

      {/* Custom HEX */}
      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
        <label className="text-xs text-muted-foreground whitespace-nowrap">커스텀 HEX</label>
        <div className="flex items-center gap-2 flex-1">
          <input
            type="color"
            value={customHex}
            onChange={(e) => {
              setCustomHex(e.target.value);
              updateField('skinHex', e.target.value);
              updateField('skinTone', `커스텀 ${e.target.value}`);
            }}
            className="w-8 h-8 rounded border border-border cursor-pointer"
          />
          <input
            type="text"
            value={customHex}
            onChange={(e) => {
              const v = e.target.value;
              setCustomHex(v);
              if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
                updateField('skinHex', v);
                updateField('skinTone', `커스텀 ${v}`);
              }
            }}
            className="flex-1 px-3 py-1.5 text-xs bg-card border border-border rounded-lg font-mono"
            placeholder="#F2D9C4"
          />
        </div>
      </div>

      {/* Current value */}
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: dna.skinHex }} />
        현재: {dna.skinTone} ({dna.skinHex})
      </div>
    </div>
  );
}

function PresetSelector({ title, description, options, value, onChange, allowCustom }: {
  title: string;
  description: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  allowCustom?: boolean;
}) {
  const [isCustom, setIsCustom] = useState(!options.includes(value) && value !== '');
  const [customValue, setCustomValue] = useState(isCustom ? value : '');

  return (
    <div>
      <h3 className="font-serif text-base font-bold mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-4">{description}</p>

      {/* Preset chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => {
              onChange(opt);
              setIsCustom(false);
            }}
            className={`px-3 py-2 rounded-lg text-xs border transition-all ${
              value === opt && !isCustom
                ? 'border-primary bg-primary/10 text-primary font-medium shadow-sm'
                : 'border-border bg-card text-foreground/70 hover:border-primary/40'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Custom input */}
      {allowCustom && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCustom(true)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
              isCustom
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-dashed border-border text-muted-foreground hover:border-primary/40'
            }`}
          >
            직접 입력
          </button>
          {isCustom && (
            <input
              type="text"
              value={customValue}
              onChange={(e) => {
                setCustomValue(e.target.value);
                onChange(e.target.value);
              }}
              className="flex-1 px-3 py-1.5 text-xs bg-card border border-border rounded-lg"
              placeholder={`${title}을 직접 입력하세요...`}
              autoFocus
            />
          )}
        </div>
      )}

      {/* Current value */}
      <div className="mt-3 text-xs text-muted-foreground">
        현재: <span className="font-medium text-foreground">{value || '미설정'}</span>
      </div>
    </div>
  );
}

function MetaEditor({ dna, updateField }: {
  dna: DnaProfile;
  updateField: <K extends keyof DnaProfile>(key: K, value: DnaProfile[K]) => void;
}) {
  return (
    <div>
      <h3 className="font-serif text-base font-bold mb-1">기본 정보</h3>
      <p className="text-xs text-muted-foreground mb-4">
        DNA 이름과 연령대를 설정합니다.
      </p>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">DNA 이름</label>
          <input
            type="text"
            value={dna.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg"
            placeholder="예: 내추럴 시크"
          />
        </div>

        {/* English Name */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">영문 이름</label>
          <input
            type="text"
            value={dna.nameEn}
            onChange={(e) => updateField('nameEn', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg"
            placeholder="예: Natural Chic"
          />
        </div>

        {/* Age Range */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">연령대</label>
          <div className="flex flex-wrap gap-2">
            {['20-23세', '24-26세', '27-29세', '30-33세', '34-37세', '38-42세'].map(age => (
              <button
                key={age}
                onClick={() => updateField('ageRange', age)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                  dna.ageRange === age
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-border bg-card text-foreground/70 hover:border-primary/40'
                }`}
              >
                {age}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={dna.ageRange}
            onChange={(e) => updateField('ageRange', e.target.value)}
            className="mt-2 w-full px-3 py-1.5 text-xs bg-card border border-border rounded-lg"
            placeholder="직접 입력 (예: 25-28세)"
          />
        </div>
      </div>
    </div>
  );
}
