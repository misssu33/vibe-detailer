/* Atelier Board — Prompt Output (5-Block Prompt Display) */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { type StoryboardResult } from "@/lib/sop-engine";
import { toast } from "sonner";

interface PromptOutputProps {
  storyboard: StoryboardResult;
  activeIndex: number;
  onSelectPage: (i: number) => void;
}

export default function PromptOutput({ storyboard, activeIndex, onSelectPage }: PromptOutputProps) {
  const [copied, setCopied] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const page = storyboard.pages[activeIndex];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(page.prompt);
    setCopied(true);
    toast.success('프롬프트가 클립보드에 복사되었습니다');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAll = async () => {
    const allPrompts = storyboard.pages
      .map((p, i) => `━━━ ${p.slot.id}: ${p.slot.pageName} ━━━\n\n${p.prompt}`)
      .join('\n\n\n');
    await navigator.clipboard.writeText(allPrompts);
    setCopiedAll(true);
    toast.success(`전체 ${storyboard.pages.length}컷 프롬프트가 복사되었습니다`);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const goPrev = () => {
    if (activeIndex > 0) onSelectPage(activeIndex - 1);
  };
  const goNext = () => {
    if (activeIndex < storyboard.pages.length - 1) onSelectPage(activeIndex + 1);
  };

  // Parse prompt into colored blocks
  const blocks = page.prompt.split(/(?=\[블록\d)/);

  return (
    <motion.section
      className="mt-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs tracking-[0.2em] uppercase text-primary font-medium">Output</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mt-1">AI 프롬프트</h2>
        </div>
        <button
          onClick={handleCopyAll}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-sm font-medium transition-colors"
        >
          {copiedAll ? <Check className="w-4 h-4 text-green-600" /> : <FileText className="w-4 h-4" />}
          {copiedAll ? '복사 완료' : '전체 복사'}
        </button>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={goPrev}
          disabled={activeIndex === 0}
          className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex gap-1 overflow-x-auto flex-1 px-1">
          {storyboard.pages.map((p, i) => (
            <button
              key={i}
              onClick={() => onSelectPage(i)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
                i === activeIndex
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {p.slot.id}
            </button>
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={activeIndex === storyboard.pages.length - 1}
          className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-30 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Prompt Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          {/* Prompt Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-primary">{page.slot.id}</span>
              <span className="text-sm font-medium">{page.slot.pageName}</span>
              {page.emoProfile && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {page.emoProfile.name}
                </span>
              )}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? '복사됨' : '복사'}
            </button>
          </div>

          {/* Prompt Body */}
          <div className="p-5 md:p-6 prompt-block">
            {blocks.map((block, i) => {
              const isNegative = block.includes('네거티브');
              const isLabel = block.startsWith('[블록');
              return (
                <div key={i} className={`${i > 0 ? 'mt-4 pt-4 border-t border-border/50' : ''}`}>
                  {renderBlock(block)}
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}

function renderBlock(text: string) {
  const lines = text.split('\n');
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2" />;

        // Block label
        if (trimmed.startsWith('[블록')) {
          return (
            <p key={i} className="block-label text-sm font-bold mb-1">
              {trimmed}
            </p>
          );
        }

        // Key: value pairs
        const colonIdx = trimmed.indexOf(':');
        if (colonIdx > 0 && colonIdx < 12 && !trimmed.startsWith('http')) {
          const key = trimmed.slice(0, colonIdx);
          const value = trimmed.slice(colonIdx + 1).trim();
          const isNeg = key.includes('네거티브') || key.includes('추가');
          return (
            <p key={i}>
              <span className={isNeg ? 'block-negative' : 'block-key'}>{key}:</span>{' '}
              <span className={isNeg ? 'block-negative opacity-80' : 'block-value'}>{value}</span>
            </p>
          );
        }

        // Negative content
        if (trimmed.includes('금지') || trimmed.includes('제외') || trimmed.includes('콜라주')) {
          return <p key={i} className="block-negative">{trimmed}</p>;
        }

        return <p key={i} className="block-value">{trimmed}</p>;
      })}
    </div>
  );
}
