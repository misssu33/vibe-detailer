/* Atelier Board — Footer */

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-lg font-bold text-foreground">Vibe Detailer</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              AI 기반 이커머스 상세페이지 자동화 도구.<br />
              SOP 기반 모델 DNA 추천, 스토리보드 생성,<br />
              5블록 프롬프트 자동 조립.
            </p>
          </div>

          {/* SOP Coverage */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3">SOP 커버리지</p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>DNA 5종 (내추럴~키즈맘)</li>
              <li>EMO 9단계 감정곡선</li>
              <li>POSE 10종 프리셋</li>
              <li>카테고리 8종 매핑</li>
              <li>8페이지 매트릭스</li>
              <li>네거티브 프롬프트 자동 적용</li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3">정보</p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>SOP v4.1 기반</li>
              <li>8 카테고리 지원</li>
              <li>3가지 생성 모드 (풀세트/PAS/B·A)</li>
              <li>Phase 1~4 체크리스트 내장</li>
              <li>거부 컷 10대 기준 내장</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Vibe Detailer &mdash; AI E-commerce Detail Page Assistant
          </p>
          <p className="text-xs text-muted-foreground">
            SOP v4.1 &middot; Craft Minimal Design
          </p>
        </div>
      </div>
    </footer>
  );
}
