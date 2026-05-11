/* ═══════════════════════════════════════════════
   Vibe Detailer — Home Page
   Design: Atelier Board / Craft Minimal
   ═══════════════════════════════════════════════ */
import { useState, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import InputPanel from "@/components/InputPanel";
import DnaRecommendation from "@/components/DnaRecommendation";
import StoryboardView from "@/components/StoryboardView";
import PromptOutput from "@/components/PromptOutput";
import ChecklistPanel from "@/components/ChecklistPanel";
import Footer from "@/components/Footer";
import {
  type CategoryId,
  type DnaId,
  type DnaProfile,
  type GenerationMode,
  type StoryboardResult,
  generateStoryboard,
  generateStoryboardWithProfile,
  recommendDna,
  DNA_DATABASE,
} from "@/lib/sop-engine";

export default function Home() {
  // ─── State ───
  const [step, setStep] = useState<'input' | 'dna' | 'storyboard'>('input');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [priceRange, setPriceRange] = useState('');
  const [platform, setPlatform] = useState('');
  const [mode, setMode] = useState<GenerationMode>('full8');
  const [selectedDna, setSelectedDna] = useState<DnaId | null>(null);
  const [recommendedDnas, setRecommendedDnas] = useState<DnaId[]>([]);
  const [storyboard, setStoryboard] = useState<StoryboardResult | null>(null);
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [customDna, setCustomDna] = useState<DnaProfile | null>(null);

  // ─── Handlers ───
  const handleInputSubmit = useCallback(() => {
    if (!productName.trim() || !category) return;
    const dnas = recommendDna(category, priceRange);
    setRecommendedDnas(dnas);
    setSelectedDna(dnas[0]);
    setStep('dna');
    setTimeout(() => {
      document.getElementById('dna-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [productName, category, priceRange]);

  const handleDnaConfirm = useCallback(() => {
    if (!selectedDna || !category) return;

    let result: StoryboardResult;
    if (selectedDna === 'CUSTOM' && customDna) {
      // Use custom DNA profile directly
      result = generateStoryboardWithProfile(category, customDna, mode, productName);
    } else {
      result = generateStoryboard(category, selectedDna, mode, productName);
    }

    setStoryboard(result);
    setActivePromptIndex(0);
    setStep('storyboard');
    setTimeout(() => {
      document.getElementById('storyboard-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [selectedDna, category, mode, productName, customDna]);

  const handleCustomDnaSave = useCallback((dna: DnaProfile) => {
    setCustomDna(dna);
  }, []);

  const handleReset = useCallback(() => {
    setStep('input');
    setProductName('');
    setCategory(null);
    setPriceRange('');
    setPlatform('');
    setMode('full8');
    setSelectedDna(null);
    setRecommendedDnas([]);
    setStoryboard(null);
    setActivePromptIndex(0);
    // Keep customDna across resets so user doesn't lose their work
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Resolve the active DNA profile for display
  const activeDnaProfile: DnaProfile | null =
    selectedDna === 'CUSTOM' ? customDna :
    selectedDna ? (DNA_DATABASE[selectedDna] || null) :
    null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <HeroSection />

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 pb-24">
        {/* Step 1: Input */}
        <InputPanel
          productName={productName}
          setProductName={setProductName}
          category={category}
          setCategory={setCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          platform={platform}
          setPlatform={setPlatform}
          mode={mode}
          setMode={setMode}
          onSubmit={handleInputSubmit}
        />

        {/* Step 2: DNA Recommendation */}
        {step !== 'input' && (
          <div id="dna-section">
            <DnaRecommendation
              recommendedDnas={recommendedDnas}
              selectedDna={selectedDna}
              onSelectDna={setSelectedDna}
              onConfirm={handleDnaConfirm}
              category={category!}
              customDna={customDna}
              onCustomDnaSave={handleCustomDnaSave}
            />
          </div>
        )}

        {/* Step 3: Storyboard + Prompts */}
        {step === 'storyboard' && storyboard && (
          <>
            <div id="storyboard-section">
              <StoryboardView
                storyboard={storyboard}
                activeIndex={activePromptIndex}
                onSelectPage={setActivePromptIndex}
                dna={activeDnaProfile}
                category={category!}
              />
            </div>
            <PromptOutput
              storyboard={storyboard}
              activeIndex={activePromptIndex}
              onSelectPage={setActivePromptIndex}
            />
            <ChecklistPanel category={category!} />
            {/* Reset Button */}
            <div className="mt-16 text-center">
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-craft text-espresso font-medium rounded-lg hover:bg-craft-dark transition-colors"
                style={{ backgroundColor: 'oklch(0.91 0.02 75)' }}
              >
                새 프로젝트 시작하기
              </button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
