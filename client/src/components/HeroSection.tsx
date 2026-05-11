/* Atelier Board — Hero Section */
import { motion } from "framer-motion";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663585810018/EfsUwxPDP5dRXVkiRQ93cT/hero-atelier-83aeei9sigKeEMDqSqq8QN.webp";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[420px] md:h-[480px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMG}
          alt="Atelier workspace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-sm tracking-[0.3em] uppercase text-foreground/60 mb-4 font-sans font-medium">
            AI E-commerce Detail Page Assistant
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
            Vibe Detailer
          </h1>
          <p className="text-base md:text-lg text-foreground/70 max-w-xl mx-auto font-sans leading-relaxed">
            상품명과 카테고리를 입력하면, SOP 기반으로<br className="hidden sm:block" />
            모델 DNA 추천부터 8페이지 스토리보드, AI 프롬프트까지 자동 생성합니다.
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-foreground/30 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-foreground/40" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
