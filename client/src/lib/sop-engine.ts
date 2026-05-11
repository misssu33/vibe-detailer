/**
 * SOP Engine — Vibe Detailer
 * 한국 이커머스 상세페이지 자동화를 위한 핵심 데이터 엔진
 * 모델 DNA, 감정곡선, 포즈, 의상, 네거티브, 8페이지 매트릭스 등
 * 사용자 SOP v4.1 기반 완전 구현
 */

// ─── Types ───────────────────────────────────────────

export type CategoryId = 'fashion' | 'beauty' | 'food' | 'living' | 'health' | 'digital' | 'appliance' | 'kids_pet';

export type DnaId = 'DNA-01' | 'DNA-02' | 'DNA-03' | 'DNA-04' | 'DNA-05';

export type EmoId = 'EMO-01' | 'EMO-02' | 'EMO-03' | 'EMO-04' | 'EMO-04.5' | 'EMO-05' | 'EMO-06' | 'EMO-07' | 'EMO-08';

export type PoseId = 'POSE-01' | 'POSE-02' | 'POSE-03' | 'POSE-04' | 'POSE-05' | 'POSE-06' | 'POSE-07' | 'POSE-08' | 'POSE-09' | 'POSE-10';

export type GenerationMode = 'full8' | 'pas5' | 'ba2' | 'custom';

export type PageId = 'P01' | 'P02' | 'P03' | 'P04' | 'P05' | 'P06a' | 'P06b' | 'P07' | 'P08';

export interface DnaProfile {
  id: DnaId;
  name: string;
  nameEn: string;
  ageRange: string;
  faceShape: string;
  skinTone: string;
  skinHex: string;
  hair: string;
  makeup: string;
  height: string;
  expressionBase: string;
  anchor: string;
  platforms: string[];
  priceRange: string;
  categories: string[];
  strength: string;
}

export interface EmoProfile {
  id: EmoId;
  name: string;
  description: string;
  eyeDetail: string;
  mouthDetail: string;
  bodyLanguage: string;
}

export interface PoseProfile {
  id: PoseId;
  name: string;
  description: string;
  suitableFor: string[];
}

export interface CategoryProfile {
  id: CategoryId;
  name: string;
  icon: string;
  toneIntensity: string;
  coreMood: string;
  emphasisEmo: EmoId[];
  recommendedDna: DnaId[];
  copyFormula: string;
  negativeExtra: string;
}

export interface PageSlot {
  id: PageId;
  pageName: string;
  distance: string;
  angle: string;
  emo: EmoId | string;
  action: string;
  background: string;
  lighting: string;
}

export interface StoryboardResult {
  pages: StoryboardPage[];
  mode: GenerationMode;
}

export interface StoryboardPage {
  slot: PageSlot;
  emoProfile: EmoProfile | null;
  prompt: string;
  copyDraft: string;
}

// ─── DNA Database ────────────────────────────────────

export const DNA_DATABASE: Record<DnaId, DnaProfile> = {
  'DNA-01': {
    id: 'DNA-01', name: '내추럴 클린', nameEn: 'Natural Clean',
    ageRange: '24-26세', faceShape: 'V라인',
    skinTone: '21호 라이트 베이지', skinHex: '#F2D9C4',
    hair: '어깨 길이 흑갈색 단발', makeup: '누드 · MLBB 코랄핑크',
    height: '165-167cm 슬림', expressionBase: '부드러운 미소',
    anchor: '왼쪽 입꼬리 위 작은 점',
    platforms: ['무신사', '쿠팡', '스마트스토어', '마켓컬리'],
    priceRange: '30~100k원',
    categories: ['기본 의류', '데일리 뷰티', '식품'],
    strength: '클릭·전환 안정, 친근한 신뢰감',
  },
  'DNA-02': {
    id: 'DNA-02', name: '시크 모던', nameEn: 'Chic Modern',
    ageRange: '27-29세', faceShape: 'V라인 + 차가운 광대',
    skinTone: '뉴트럴 베이지', skinHex: '#EBC9B0',
    hair: '슬릭 또는 미디엄 다크', makeup: '매트 · 강한 시선 · 로즈브라운',
    height: '168-170cm 슬림', expressionBase: '무표정 · 강한 시선',
    anchor: '오른쪽 눈썹 끝 짧음',
    platforms: ['29CM', 'W컨셉', 'SSF샵', '더현대닷컴'],
    priceRange: '150k원+',
    categories: ['컨템포러리 의류', '럭셔리 뷰티', '주얼리'],
    strength: '프리미엄 · 도시적 무드',
  },
  'DNA-03': {
    id: 'DNA-03', name: '프레시 글로우', nameEn: 'Fresh Glow',
    ageRange: '22-25세', faceShape: '둥근 V라인',
    skinTone: '21호 라이트 베이지', skinHex: '#F4DCC7',
    hair: '어깨 길이 자연 갈색·웨이브', makeup: '윤기 · 코랄/살구 립',
    height: '162-165cm', expressionBase: '환한 미소·치아 살짝 보임',
    anchor: '콧대 중간 주근깨 1-2개',
    platforms: ['올리브영', 'CHICOR', '마켓컬리', '쿠팡'],
    priceRange: '10~80k원',
    categories: ['스킨케어', '컬러 메이크업', '헬시 푸드', '디저트'],
    strength: 'CTR 최고 (썸네일 클릭률)',
  },
  'DNA-04': {
    id: 'DNA-04', name: '엘레강스 미니멀', nameEn: 'Elegance Minimal',
    ageRange: '31-34세', faceShape: '성숙 V라인',
    skinTone: '22호 베이지', skinHex: '#EAD0BB',
    hair: '미디엄 · 차분한 톤', makeup: '세미매트 · 로즈브라운 립',
    height: '165-168cm', expressionBase: '차분한 무표정 · 옅은 미소',
    anchor: '왼쪽 눈 밑 미세 점',
    platforms: ['29CM', '오늘의집', '한샘몰', '마켓컬리 프리미엄'],
    priceRange: '80~300k원',
    categories: ['모던 클래식 의류', '안티에이징', '홈리빙', '건강식'],
    strength: '프리미엄 신뢰감',
  },
  'DNA-05': {
    id: 'DNA-05', name: '키즈맘 친근형', nameEn: 'Kids Mom Friendly',
    ageRange: '28-32세', faceShape: '부드러운 V라인',
    skinTone: '22호 베이지', skinHex: '#F0D5BE',
    hair: '단발 또는 미디엄·따뜻 톤', makeup: '따뜻한 톤 · 코랄/로즈 립',
    height: '162-166cm', expressionBase: '따뜻한 미소',
    anchor: '오른쪽 광대 위 점',
    platforms: ['쿠팡', '아이허브', '마켓컬리', '베이비페어'],
    priceRange: '20~150k원',
    categories: ['육아', '패밀리 의류', '주방', '헬스케어'],
    strength: '보호자 안심 · 진심 어린 추천 무드',
  },
};

// ─── EMO Database ────────────────────────────────────

export const EMO_DATABASE: Record<EmoId, EmoProfile> = {
  'EMO-01': {
    id: 'EMO-01', name: '신뢰·환영',
    description: '마스터 앵커. 정면 응시, 절제된 미소. 제품을 가슴 높이에 들고 있는 첫인상 컷.',
    eyeDetail: '정면 응시, 눈동자 11시 캐치라이트, 눈꼬리 살짝 올라간 부드러운 시선',
    mouthDetail: '입꼬리 3mm 올림, 치아 미노출 또는 살짝 보임',
    bodyLanguage: '어깨 자연스럽게 내림, 상체 약간 카메라 쪽 기울임',
  },
  'EMO-02': {
    id: 'EMO-02', name: '고민·페인',
    description: '공감 유도. 일상 속 불편함이나 고민을 표현하는 컷.',
    eyeDetail: '시선 약간 아래 또는 측면, 미간 살짝 모임',
    mouthDetail: '입술 자연 다물기, 한쪽 입꼬리 미세하게 내림',
    bodyLanguage: '한 손으로 턱 또는 이마 짚기, 약간 구부정한 자세',
  },
  'EMO-03': {
    id: 'EMO-03', name: '호기심·발견',
    description: '제품을 처음 발견하는 순간. 눈이 커지며 관심을 보이는 컷.',
    eyeDetail: '눈 약간 크게 뜨기, 시선이 제품 방향',
    mouthDetail: '입술 살짝 벌림 (2-3mm), 놀라움의 "오" 형태',
    bodyLanguage: '상체 약간 앞으로 기울임, 손이 제품 쪽으로 뻗음',
  },
  'EMO-04': {
    id: 'EMO-04', name: '집중·사용',
    description: '제품을 직접 사용하는 순간. 진지하게 집중하는 표정.',
    eyeDetail: '시선이 제품/사용 부위에 고정, 집중하는 눈빛',
    mouthDetail: '입술 자연 다물기, 약간 긴장감',
    bodyLanguage: '양손으로 제품 다루기, 손가락 섬세한 동작',
  },
  'EMO-04.5': {
    id: 'EMO-04.5', name: '발견·각성',
    description: '사용 중 효과를 느끼는 순간. EMO-04에서 EMO-05로 넘어가는 전환점.',
    eyeDetail: '눈이 밝아지며 시선이 거울/카메라로 이동',
    mouthDetail: '입꼬리가 올라가기 시작, 미소 시작점',
    bodyLanguage: '자세가 펴지며 자신감 회복',
  },
  'EMO-05': {
    id: 'EMO-05', name: '기쁨·만족',
    description: '사용 후 만족감. 환한 미소와 자신감 넘치는 표정.',
    eyeDetail: '눈웃음, 눈꼬리 올라감, 밝은 시선',
    mouthDetail: '환한 미소, 치아 자연스럽게 보임, 입꼬리 5mm+ 올림',
    bodyLanguage: '자세 곧게 펴짐, 어깨 뒤로, 자신감 있는 포즈',
  },
  'EMO-06': {
    id: 'EMO-06', name: 'Before 무표정',
    description: 'Before/After 비교의 Before. 무표정하고 피곤한 인상.',
    eyeDetail: '무기력한 시선, 정면 응시, 생기 없음',
    mouthDetail: '입꼬리 수평 또는 미세하게 내림',
    bodyLanguage: '어깨 약간 처짐, 전체적으로 활력 없는 자세',
  },
  'EMO-07': {
    id: 'EMO-07', name: '자연 일상 미소',
    description: '일상 속 자연스러운 모습. 후기/리뷰 느낌의 편안한 컷.',
    eyeDetail: '자연스러운 시선, 카메라 또는 약간 측면',
    mouthDetail: '자연스러운 미소, 과하지 않은 편안함',
    bodyLanguage: '편안한 자세, 일상 공간에서의 자연스러운 동작',
  },
  'EMO-08': {
    id: 'EMO-08', name: '권유·확신 (CTA)',
    description: '클로징 컷. 제품을 카메라 쪽으로 내밀며 구매를 권유하는 확신의 표정.',
    eyeDetail: '정면 강한 시선, 자신감, 눈동자 또렷',
    mouthDetail: '확신 있는 미소, 입꼬리 올림',
    bodyLanguage: '제품을 카메라 쪽으로 내밀기, 손짓 유형별 매칭',
  },
};

// ─── Pose Database ───────────────────────────────────

export const POSE_DATABASE: Record<PoseId, PoseProfile> = {
  'POSE-01': { id: 'POSE-01', name: '정석 앵커', description: '정면 응시, 양손 자연스럽게 내림, 어깨 약간 비틀기', suitableFor: ['fashion', 'beauty'] },
  'POSE-02': { id: 'POSE-02', name: '허리 손', description: '한 손 허리, 반대 손 자연 내림', suitableFor: ['fashion'] },
  'POSE-03': { id: 'POSE-03', name: '양손 주머니', description: '양손 주머니에 넣기, 캐주얼 무드', suitableFor: ['fashion'] },
  'POSE-04': { id: 'POSE-04', name: '한손 턱', description: '한 손으로 턱 가볍게 짚기', suitableFor: ['beauty', 'food'] },
  'POSE-05': { id: 'POSE-05', name: '측면 응시', description: '45도 측면, 시선은 카메라', suitableFor: ['fashion', 'beauty'] },
  'POSE-06': { id: 'POSE-06', name: '팔짱', description: '팔짱 끼기, 자신감 표현', suitableFor: ['health', 'digital'] },
  'POSE-07': { id: 'POSE-07', name: '한손 목걸이', description: '한 손으로 목걸이/칼라 만지기', suitableFor: ['fashion', 'beauty'] },
  'POSE-08': { id: 'POSE-08', name: '걷기 연출', description: '걷는 동작, 자연스러운 움직임', suitableFor: ['fashion'] },
  'POSE-09': { id: 'POSE-09', name: '의자 기댐', description: '의자에 기대거나 앉은 자세', suitableFor: ['living', 'food'] },
  'POSE-10': { id: 'POSE-10', name: '제품 홀딩', description: '제품을 자연스럽게 들고 있기', suitableFor: ['beauty', 'food', 'health'] },
};

// ─── Category Database ───────────────────────────────

export const CATEGORY_DATABASE: Record<CategoryId, CategoryProfile> = {
  fashion: {
    id: 'fashion', name: '패션', icon: '👗',
    toneIntensity: '약함 (시크)',
    coreMood: '시크한 무심함',
    emphasisEmo: ['EMO-01', 'EMO-04', 'EMO-07', 'EMO-08'],
    recommendedDna: ['DNA-02', 'DNA-01'],
    copyFormula: '[상황] + [핏감/소재감] + [스타일링 포인트]',
    negativeExtra: '옷의 어색한 주름이나 솔기 왜곡, 단추·지퍼 위치 오류, 패턴이 끊기거나 비대칭으로 흐트러진 표현, 가방·신발의 형태 변형, 액세서리의 부자연스러운 부유, 다른 브랜드 로고 노출',
  },
  beauty: {
    id: 'beauty', name: '뷰티', icon: '🌸',
    toneIntensity: '중간 (청량)',
    coreMood: '절제된 청량감',
    emphasisEmo: ['EMO-05', 'EMO-06', 'EMO-08'],
    recommendedDna: ['DNA-03', 'DNA-01'],
    copyFormula: '[결과] + [기간] + [성분 키워드]',
    negativeExtra: '피부의 과장된 결점, 부자연스러운 모공 강조, 의학적 효능을 암시하는 시각적 표현, 과장된 비포애프터 차이, 인공적인 피부 광택, 입술 색의 비현실적 채도',
  },
  food: {
    id: 'food', name: '식품', icon: '🍱',
    toneIntensity: '강함 (활짝)',
    coreMood: '진심 어린 활짝',
    emphasisEmo: ['EMO-04', 'EMO-05', 'EMO-07'],
    recommendedDna: ['DNA-01', 'DNA-05'],
    copyFormula: '[감각어] + [원산지/공법] + [일상 장면]',
    negativeExtra: '음식 위 곰팡이·변색·이물질, 비위생적으로 보이는 손, 음식이 흘러내리는 어색한 묘사, 그릇·포장의 변형이나 찌그러짐, 비현실적인 음식 광택, 식재료의 부자연스러운 채도',
  },
  living: {
    id: 'living', name: '리빙', icon: '🛋',
    toneIntensity: '중간 (편안)',
    coreMood: '따뜻한 편안함',
    emphasisEmo: ['EMO-03', 'EMO-04'],
    recommendedDna: ['DNA-04', 'DNA-05'],
    copyFormula: '[공간 변화] + [감성 키워드] + [실용 수치]',
    negativeExtra: '가구의 비례 왜곡, 공간 원근법 오류, 벽·바닥의 부자연스러운 패턴 반복, 소품의 부유 또는 그림자 누락, 어수선하거나 더러워 보이는 디테일, 비현실적인 인테리어 조명',
  },
  health: {
    id: 'health', name: '헬스·건강', icon: '💪',
    toneIntensity: '강함 (활력)',
    coreMood: '활력 넘치는',
    emphasisEmo: ['EMO-06', 'EMO-05'],
    recommendedDna: ['DNA-01', 'DNA-03'],
    copyFormula: '[성분] + [효능 지표] + [Before/After 수치]',
    negativeExtra: '의학적 효능을 직접 암시하는 시각 표현, 과장된 비포애프터 신체 변화, 부자연스러운 근육 묘사, 알약·캡슐의 형태 왜곡, 식약처 인증을 사칭하는 가짜 마크',
  },
  digital: {
    id: 'digital', name: '디지털', icon: '💻',
    toneIntensity: '약함 (차분)',
    coreMood: '전문가 차분함',
    emphasisEmo: ['EMO-03', 'EMO-04'],
    recommendedDna: ['DNA-04', 'DNA-02'],
    copyFormula: '[Before/After] + [수치 개선] + [전문가 인용]',
    negativeExtra: '노트북·모니터 화면의 글자 깨짐, UI 요소의 비현실적 왜곡, 키보드 자판 배열 오류, 다른 소프트웨어 브랜드 노출, 비현실적인 모니터 발광이나 색상',
  },
  appliance: {
    id: 'appliance', name: '가전', icon: '🏠',
    toneIntensity: '중간',
    coreMood: '발견·만족',
    emphasisEmo: ['EMO-03', 'EMO-04', 'EMO-08'],
    recommendedDna: ['DNA-04', 'DNA-01'],
    copyFormula: '[Pain 해소] + [수치] + [공간 변화]',
    negativeExtra: '가구의 비례 왜곡, 공간 원근법 오류, 벽·바닥의 부자연스러운 패턴 반복, 소품의 부유 또는 그림자 누락',
  },
  kids_pet: {
    id: 'kids_pet', name: '유아·펫', icon: '🍼',
    toneIntensity: '강함 (진심)',
    coreMood: '따뜻한 진심',
    emphasisEmo: ['EMO-05', 'EMO-07', 'EMO-08'],
    recommendedDna: ['DNA-05'],
    copyFormula: '[안전] + [보호자 안심] + [진심 어린 추천]',
    negativeExtra: '아이의 신체 비례 왜곡, 위험해 보이는 자세나 환경, 보호자 없이 위험한 상황, 아이 표정의 부자연스러운 과장, 장난감·용품의 안전성 의심 표현',
  },
};

// ─── 8-Page Matrix Templates ─────────────────────────

const FULL_8_MATRIX: PageSlot[] = [
  { id: 'P01', pageName: '인트로 히어로', distance: 'Bust', angle: 'Eye-level', emo: 'EMO-01', action: '제품을 가슴 높이에 들고 정면 응시', background: '단색 그라데이션 (브랜드 메인컬러 10% 틴트)', lighting: '정면 소프트박스, 캐치라이트 11시' },
  { id: 'P02', pageName: '공감 Pain', distance: 'Waist', angle: 'Eye-level', emo: 'EMO-02', action: '거울/모니터 앞에서 고민하는 모습', background: '일상 공간 (욕실/주방/사무실)', lighting: '흐린 자연광, 약간 언더' },
  { id: 'P03', pageName: '강점① 사용', distance: 'Close-up', angle: 'High (15°)', emo: 'EMO-04', action: '제품을 직접 사용하는 동작', background: '보케 흐림 배경', lighting: '측면 하이라이트, 제품에 포커스' },
  { id: 'P04', pageName: '강점② 디테일', distance: 'Ext. Close-up', angle: 'Eye-level', emo: '(손만)', action: '손으로 제품 디테일 다루기', background: '흐림 배경', lighting: '톱라이트, 제품 질감 강조' },
  { id: 'P05', pageName: '강점③ 결과', distance: 'Full body', angle: 'Low (10°)', emo: 'EMO-05', action: '사용 후 일상/외출 모습', background: '라이프스타일 공간', lighting: '골든아워 자연광' },
  { id: 'P06a', pageName: 'Before', distance: 'Bust', angle: 'Eye-level', emo: 'EMO-06', action: '정면 응시, 무표정', background: '단색 배경', lighting: '평면 조명' },
  { id: 'P06b', pageName: 'After', distance: 'Bust', angle: 'Eye-level', emo: 'EMO-05', action: '정면 응시, 환한 미소', background: '단색 배경 (동일)', lighting: '평면 조명 (동일)' },
  { id: 'P07', pageName: '후기 인용', distance: 'Bust', angle: 'Eye-level', emo: 'EMO-07', action: '정면 또는 살짝 측면, 편안한 모습', background: '캐주얼 공간 (카페/거실)', lighting: '자연광' },
  { id: 'P08', pageName: '클로징 CTA', distance: 'Bust', angle: 'Eye-level', emo: 'EMO-08', action: '제품을 카메라 쪽으로 내밀며 권유', background: '브랜드 메인컬러 배경', lighting: '정면 소프트, 약간 드라마틱' },
];

// ─── Category-specific EMO flows ─────────────────────

const CATEGORY_EMO_FLOWS: Record<CategoryId, Record<GenerationMode, PageId[]>> = {
  beauty: {
    full8: ['P01', 'P02', 'P03', 'P04', 'P05', 'P06a', 'P06b', 'P07', 'P08'],
    pas5: ['P02', 'P03', 'P04', 'P05', 'P08'],
    ba2: ['P06a', 'P06b'],
    custom: [],
  },
  food: {
    full8: ['P01', 'P02', 'P03', 'P04', 'P05', 'P07', 'P08'],
    pas5: ['P02', 'P03', 'P04', 'P05', 'P08'],
    ba2: ['P06a', 'P06b'],
    custom: [],
  },
  fashion: {
    full8: ['P01', 'P02', 'P03', 'P04', 'P05', 'P07', 'P08'],
    pas5: ['P02', 'P03', 'P04', 'P05', 'P08'],
    ba2: ['P06a', 'P06b'],
    custom: [],
  },
  health: {
    full8: ['P01', 'P02', 'P06a', 'P06b', 'P05', 'P07', 'P08'],
    pas5: ['P02', 'P06a', 'P05', 'P07', 'P08'],
    ba2: ['P06a', 'P06b'],
    custom: [],
  },
  living: {
    full8: ['P01', 'P02', 'P03', 'P04', 'P05', 'P07', 'P08'],
    pas5: ['P02', 'P03', 'P04', 'P05', 'P08'],
    ba2: ['P06a', 'P06b'],
    custom: [],
  },
  digital: {
    full8: ['P01', 'P02', 'P03', 'P04', 'P05', 'P07', 'P08'],
    pas5: ['P02', 'P03', 'P04', 'P05', 'P08'],
    ba2: ['P06a', 'P06b'],
    custom: [],
  },
  appliance: {
    full8: ['P01', 'P02', 'P03', 'P04', 'P05', 'P07', 'P08'],
    pas5: ['P02', 'P03', 'P04', 'P05', 'P08'],
    ba2: ['P06a', 'P06b'],
    custom: [],
  },
  kids_pet: {
    full8: ['P01', 'P02', 'P05', 'P07', 'P08'],
    pas5: ['P02', 'P05', 'P07', 'P08'],
    ba2: ['P06a', 'P06b'],
    custom: [],
  },
};

// ─── Category-specific EMO overrides ─────────────────

const CATEGORY_EMO_OVERRIDES: Record<CategoryId, Partial<Record<PageId, { emo: EmoId; actionOverride?: string }>>> = {
  beauty: {
    P01: { emo: 'EMO-01', actionOverride: '제품을 가슴 높이에 들고, 절제된 청량감' },
    P02: { emo: 'EMO-02', actionOverride: '거울 앞에서 피부 고민' },
    P03: { emo: 'EMO-03', actionOverride: '제품 첫 발견, 호기심' },
    P04: { emo: 'EMO-04', actionOverride: '집중해서 제품 발라보기' },
    P05: { emo: 'EMO-05', actionOverride: '피부 좋아진 만족감' },
    P08: { emo: 'EMO-08', actionOverride: '양손으로 제품 내밀기 (프리미엄 손짓 A)' },
  },
  food: {
    P01: { emo: 'EMO-01', actionOverride: '가정적 친근함, 제품 들고 미소' },
    P02: { emo: 'EMO-02', actionOverride: '아침 식사 고민' },
    P03: { emo: 'EMO-03', actionOverride: '포장 열어보기, 기대감' },
    P04: { emo: 'EMO-04', actionOverride: '한 입 음미하는 모습' },
    P05: { emo: 'EMO-05', actionOverride: '활짝 웃음, 맛 만족' },
    P08: { emo: 'EMO-08', actionOverride: '한손+가슴 손짓 B (진심 추천)' },
  },
  fashion: {
    P01: { emo: 'EMO-01', actionOverride: '시크한 자신감, 제품 착용' },
    P02: { emo: 'EMO-02', actionOverride: '옷장 앞 스타일링 고민' },
    P03: { emo: 'EMO-03', actionOverride: '새 옷 발견, 관심' },
    P04: { emo: 'EMO-04', actionOverride: '거울 앞 옷매무새 매만짐' },
    P05: { emo: 'EMO-05', actionOverride: '외출 자신감, 절제된 미소' },
    P08: { emo: 'EMO-08', actionOverride: '어깨 으쓱 손짓 D (캐주얼)' },
  },
  health: {
    P01: { emo: 'EMO-01', actionOverride: '건강한 활기, 제품 들기' },
    P02: { emo: 'EMO-02', actionOverride: '피로한 일상 모습' },
    P05: { emo: 'EMO-05', actionOverride: '활력 회복, 환한 웃음' },
    P08: { emo: 'EMO-08', actionOverride: '엄지척 손짓 C (가성비·동기부여)' },
  },
  living: {},
  digital: {},
  appliance: {},
  kids_pet: {
    P01: { emo: 'EMO-01', actionOverride: '보호자 따뜻함, 제품 들기' },
    P02: { emo: 'EMO-02', actionOverride: '육아 피로 표현' },
    P05: { emo: 'EMO-05', actionOverride: '아이 즐거움에 환한 웃음' },
    P08: { emo: 'EMO-08', actionOverride: '한손+가슴 손짓 B (진심)' },
  },
};

// ─── Negative Prompt Base ────────────────────────────

const NEGATIVE_COMMON = `한 장면, 한 컷, 한 명의 인물만 그려줘.

콜라주, 분할 화면, 멀티패널, 두 명 이상의 인물 금지.
손가락·치아·눈동자·귀 비대칭, 팔다리 왜곡, 플라스틱 피부,
과한 광택, 워터마크, 텍스트 잔재, 다른 브랜드 로고 제외.`;

// ─── Hand Gesture Types (EMO-08) ─────────────────────

export const HAND_GESTURES: Record<string, { name: string; description: string; suitableCategories: CategoryId[] }> = {
  A: { name: '양손 제품 (프리미엄)', description: '양손으로 제품을 정면으로 내밀기', suitableCategories: ['beauty', 'digital', 'appliance'] },
  B: { name: '한손+가슴 (진심)', description: '한 손에 제품, 반대 손은 가슴에', suitableCategories: ['food', 'kids_pet', 'health'] },
  C: { name: '엄지척 (가성비)', description: '한 손 엄지척, 반대 손 제품', suitableCategories: ['health', 'food'] },
  D: { name: '어깨 으쓱 (캐주얼)', description: '어깨 으쓱하며 제품 들기', suitableCategories: ['fashion', 'living'] },
};

// ─── Outfit Library (simplified) ─────────────────────

export const OUTFIT_LIBRARY: Record<CategoryId, { items: Array<{ name: string; hex: string; material: string; fit: string }> }> = {
  fashion: {
    items: [
      { name: '화이트 슬랙스', hex: '#F5F2EA', material: '폴리·레이온', fit: '와이드' },
      { name: '화이트 셔츠', hex: '#F8F8F4', material: '면 100%', fit: '레귤러' },
      { name: '블랙 라운드티', hex: '#1C1C1C', material: '면', fit: '슬림' },
    ],
  },
  beauty: {
    items: [
      { name: '아이보리 라운드넥 니트', hex: '#F2EBDC', material: '울·아크릴', fit: '루즈' },
      { name: '화이트 코튼 티', hex: '#F8F8F4', material: '면', fit: '베이직' },
      { name: '누드 베이지 슬립', hex: '#E5C9B0', material: '새틴·모달', fit: '슬림' },
    ],
  },
  food: {
    items: [
      { name: '아이보리 와플 니트', hex: '#F0E8D6', material: '면·울', fit: '루즈' },
      { name: '라이트 베이지 셔츠', hex: '#DCC9A8', material: '면·린넨', fit: '레귤러' },
      { name: '화이트 면 셔츠', hex: '#F5F2EC', material: '면', fit: '베이직' },
    ],
  },
  living: {
    items: [
      { name: '그레이 라운지웨어', hex: '#C8C5BE', material: '면·모달', fit: '루즈' },
      { name: '아이보리 베이직', hex: '#EBE3D2', material: '면', fit: '베이직' },
    ],
  },
  health: {
    items: [
      { name: '화이트+블랙 액티브웨어', hex: '#F8F8F8', material: '폴리·스판덱스', fit: '슬림' },
      { name: '화이트 라운드넥', hex: '#FAFAFA', material: '면', fit: '클린 베이직' },
    ],
  },
  digital: {
    items: [
      { name: '화이트 셔츠', hex: '#F8F8F4', material: '면', fit: '레귤러' },
      { name: '차콜 니트', hex: '#3A3A3A', material: '울', fit: '레귤러' },
    ],
  },
  appliance: {
    items: [
      { name: '그레이 라운지웨어', hex: '#C8C5BE', material: '면·모달', fit: '루즈' },
      { name: '아이보리 베이직', hex: '#EBE3D2', material: '면', fit: '베이직' },
    ],
  },
  kids_pet: {
    items: [
      { name: '아이보리 와플 니트', hex: '#F0E8D6', material: '면·울', fit: '루즈' },
      { name: '화이트 면 셔츠', hex: '#F5F2EC', material: '면', fit: '베이직' },
    ],
  },
};

// ─── Core Engine Functions ───────────────────────────

/** 카테고리와 가격대 기반 DNA 자동 추천 */
export function recommendDna(category: CategoryId, priceRange?: string): DnaId[] {
  const cat = CATEGORY_DATABASE[category];
  return cat.recommendedDna;
}

/** 카테고리와 모드 기반 스토리보드 페이지 목록 반환 */
export function getPageFlow(category: CategoryId, mode: GenerationMode): PageSlot[] {
  const flow = CATEGORY_EMO_FLOWS[category][mode];
  if (!flow || flow.length === 0) return FULL_8_MATRIX.slice(0, -1); // fallback to full minus last
  
  return flow.map(pageId => {
    const slot = FULL_8_MATRIX.find(s => s.id === pageId);
    if (!slot) return FULL_8_MATRIX[0];
    
    // Apply category-specific EMO overrides
    const override = CATEGORY_EMO_OVERRIDES[category][pageId];
    if (override) {
      return {
        ...slot,
        emo: override.emo,
        action: override.actionOverride || slot.action,
      };
    }
    return slot;
  });
}

/** 5블록 프롬프트 조립 */
export function buildPrompt(
  dna: DnaProfile,
  page: PageSlot,
  emo: EmoProfile | null,
  category: CategoryProfile,
  productName: string,
  productColor?: string,
  outfitOverride?: string,
): string {
  const outfit = OUTFIT_LIBRARY[category.id]?.items[0];
  
  // Block 1: 첨부 동일 인물 명시
  const block1 = `[블록1 — 인물 고정]\n첨부한 마스터 이미지와 동일한 인물. 얼굴·헤어·피부·메이크업·체형 모두 일치시켜줘.`;

  // Block 2: 외형 유지
  const block2 = `[블록2 — 외형 유지]
얼굴형: ${dna.faceShape}
피부톤: ${dna.skinTone} ${dna.skinHex}, 자연 피부 질감
헤어: ${dna.hair}
메이크업: ${dna.makeup}
체형: ${dna.height}
특이점(앵커): ${dna.anchor}
의상: ${outfitOverride || (outfit ? `${outfit.name} ${outfit.hex} / ${outfit.material} / ${outfit.fit}` : '뉴트럴 톤 베이직')}`;

  // Block 3: 6요소 통합
  const emoDesc = emo ? `
표정: ${emo.name} — ${emo.eyeDetail}. ${emo.mouthDetail}. ${emo.bodyLanguage}.` : '';
  
  const block3 = `[블록3 — 6요소 통합 (한 문단)]
행동: ${page.action}${emoDesc}
거리: ${page.distance}
앵글: ${page.angle}
배경: ${page.background}
조명: ${page.lighting}
제품: "${productName}"${productColor ? ` (${productColor})` : ''}`;

  // Block 4: 한 장면 강조
  const block4 = `[블록4 — 단일 컷 강조]\n한 장면, 한 컷, 한 명의 인물만 그려줘. 콜라주나 분할 화면 절대 금지.`;

  // Block 5: 네거티브
  const block5 = `[블록5 — 네거티브]\n${NEGATIVE_COMMON}\n\n추가: ${category.negativeExtra}`;

  return `${block1}\n\n${block2}\n\n${block3}\n\n${block4}\n\n${block5}`;
}

/** 카테고리별 카피 초안 생성 */
export function generateCopyDraft(
  category: CategoryProfile,
  page: PageSlot,
  productName: string,
): string {
  const templates: Record<PageId, (cat: CategoryProfile, prod: string) => string> = {
    P01: (cat, prod) => `${prod}, 당신의 일상을 바꿀 첫 만남`,
    P02: (cat, prod) => `매일 반복되는 고민, 이제 끝내세요`,
    P03: (cat, prod) => `${prod}만의 차별화된 강점`,
    P04: (cat, prod) => `디테일이 다릅니다`,
    P05: (cat, prod) => `${prod}와 함께한 변화`,
    P06a: (_cat, _prod) => `Before`,
    P06b: (_cat, _prod) => `After`,
    P07: (cat, prod) => `실제 사용자의 솔직한 후기`,
    P08: (cat, prod) => `지금 바로 ${prod}를 만나보세요`,
  };

  const fn = templates[page.id];
  return fn ? fn(category, productName) : '';
}

/** 전체 스토리보드 생성 */
export function generateStoryboard(
  categoryId: CategoryId,
  dnaId: DnaId,
  mode: GenerationMode,
  productName: string,
  productColor?: string,
): StoryboardResult {
  const dna = DNA_DATABASE[dnaId];
  const category = CATEGORY_DATABASE[categoryId];
  const pages = getPageFlow(categoryId, mode);

  const storyboardPages: StoryboardPage[] = pages.map(page => {
    const emoId = typeof page.emo === 'string' && page.emo.startsWith('EMO-')
      ? page.emo as EmoId
      : null;
    const emoProfile = emoId ? EMO_DATABASE[emoId] : null;

    return {
      slot: page,
      emoProfile,
      prompt: buildPrompt(dna, page, emoProfile, category, productName, productColor),
      copyDraft: generateCopyDraft(category, page, productName),
    };
  });

  return { pages: storyboardPages, mode };
}

/** Phase 체크리스트 반환 */
export function getChecklist(): Array<{ phase: string; items: string[] }> {
  return [
    {
      phase: 'Phase 1 — 준비 (1~2h)',
      items: [
        '카테고리에 맞는 DNA 선택',
        'DNA 피부톤 "21호/22호 베이지 + HEX" 형식 표기',
        'DNA 특이점(점·주근깨) 위치 확정',
        '페르소나(직업·취미·스타일·눈빛) 부여',
        '고급 팁 10규칙 적용 확인',
        '마스터 컷 1장 거부 기준 통과',
        '8페이지 변형 매트릭스 작성 완료',
        '제품 누끼 컷 확보',
        '카테고리 무드 키워드 3개 결정',
        '네거티브 표준 세트 정의',
      ],
    },
    {
      phase: 'Phase 2 — 생성 (2~3h)',
      items: [
        '매 변형 컷 생성 시 마스터 컷 이미지 첨부',
        'BLOCK A·B·C·D 의상·배경별 묶어서 일괄 생성',
        '5블록 구조 + 6요소 한 번에 묘사',
        '"한 장면·한 컷·한 명" 매번 명시',
        '카테고리 표정 라이브러리 적용',
        '카테고리 네거티브 적용',
        '손 비워둔 포즈로 모델 컷 생성',
        '모든 컷 거부 컷 10항목 통과',
      ],
    },
    {
      phase: 'Phase 3 — 합성 (1~2h)',
      items: [
        '인페인팅으로 제품 자연 통합',
        '광원 방향·색온도·강도 통일',
        '그림자 방향·블러 일치',
        '제품 크기 비율 점검 (손바닥 17cm 기준)',
        '100% 확대 합성 경계 확인',
        '모바일 썸네일에서도 자연스러움 확인',
      ],
    },
    {
      phase: 'Phase 4 — 검수 (30m~1h)',
      items: [
        '8~10컷 한 줄 나열 시 동일 인물로 보이는가',
        'DNA 특이점 위치 일관성',
        '거리 리듬: Close-up과 Wide 교차',
        '앵글 리듬: Eye-level만 연속되지 않는가',
        '컬러 리듬: 밝은/어두운 컷 교차',
        '모델 등장 리듬: 3~4컷마다 재등장',
        '표정 리듬: EMO 단계별 흐름',
        '배경 리듬: 같은 배경 3컷 이상 연속 없음',
        '모바일 썸네일 최종 확인',
        '한국 표시광고법 위반 요소 없음',
      ],
    },
  ];
}

/** 거부 컷 10대 기준 */
export function getRejectCriteria(): string[] {
  return [
    '콜라주·분할 화면',
    '한 화면에 인물 2명 이상',
    '얼굴 비율 변화 (눈 간격·코 길이·입 위치)',
    '헤어 5% 이상 변화 (컬러·길이)',
    '손가락 6개 이상/4개 이하',
    '치아 비대칭·왜곡',
    '눈동자 좌우 비대칭·초점 어긋남',
    '귀 위치 비대칭',
    '의상 베이스 톤 변화',
    '플라스틱 피부·과한 광택',
  ];
}
