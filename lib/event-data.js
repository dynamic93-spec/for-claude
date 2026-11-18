// 2026 CORI 행사 데이터
// 참여기업·기관 명단은 '2026 CORI 초청명단_TAPx비드리머' 시트 기준 (수동 갱신)

export const EVENT = {
  title: "CORI",
  fullTitle: "공공&민간 연계 오픈이노베이션 CORI",
  tagline: "Connect with Our Rising Innovation",
  edition: "4th",
  subtitle: "2026 공공-민간 오픈이노베이션 네트워킹",
  date: "2026. 12. 3 (목)",
  time: "13:30 – 17:30",
  venue: "드림플러스 강남 B1F Main Hall",
  address: "서울 서초구 강남대로 311",
  host: "탭엔젤파트너스 (TAP Angel Partners)",
  applyUrl:
    "https://docs.google.com/forms/d/1mF7PVih_HppriEJ-pYMjrEPSR2pbpL6tcZUl3XsFAvM/viewform",
};

// 2023~2025 누적 실적 (3개년)
export const LEGACY = {
  editions: 3,
  companies: 59,
  attendees: 150,
};

// 키노트 스피치 (공공·민간 OI 사례 발표)
// 시간은 운영관리 시트 '02. 프로그램 운영' 기준
// parts: 좁은 화면에서 줄바꿈이 필요할 때 끊어도 되는 지점
// logo: public/keynote-logos/ 의 CI 파일 (없으면 이름만 표시, 자리는 비워 정렬 유지)
export const KEYNOTES = {
  public: [
    { name: "연구개발특구진흥재단", parts: ["연구개발특구", "진흥재단"], time: "13:45", logo: "/keynote-logos/innopolis.png" },
    { name: "경기도경제과학진흥원", parts: ["경기도경제", "과학진흥원"], time: "13:50", logo: "/keynote-logos/gbsa.png" },
    { name: "인천테크노파크", time: "13:55", logo: "/keynote-logos/itp.png" },
    { name: "서울시 관광산업과", time: "14:00", logo: "/keynote-logos/seoul.png" },
  ],
  private: [
    { name: "CJ ENM", time: "14:05", logo: "/keynote-logos/cjenm.png" },
    { name: "HD현대삼호", time: "14:15", logo: "/keynote-logos/hd-hyundai.png" },
    { name: "솔루엠", time: "14:25", logo: "/keynote-logos/solum.svg" },
    { name: "메르세데스-벤츠 코리아", time: "14:35", logo: "/keynote-logos/mercedes-benz.png" },
  ],
};

// 2부 1:1 비즈니스 Meet-up 확정 참여사 (20개사)
// 순서·로고: 드라이브 '03. 참여기업로고/2부(1대1 비즈니스밋업)' 폴더 기준
// fields(관심 스타트업 분야)·stages(희망 투자 단계): '접수 원본(자동)' 신청서 응답 기준
// 페이지는 1분마다 신청서 원본을 다시 읽어 자동 갱신하고, 아래 값은 시트를 못 읽을 때 쓰는 예비값
// aliases: 신청서에 다른 표기로 적힐 수 있는 회사명 (자동 매칭용)
// 응답이 없으면 카드에 '공개 예정' 표시
// logoDark: 흰색 로고만 있을 때 어두운 배지에 표시 (CKD는 흰 배경용으로 변환해 미사용)
// note: 신청서 자유 기재 내용 (관심 분야 보충)
// CVC 중 투자 단계 응답이 없고 관심 분야만 있는 곳은 fields 를 대신 표시
const L = (f) => `/meetup-logos/${f}`;
export const MEETUP_PARTNERS = {
  oi: [
    { name: "HD현대삼호", logo: L("hd-hyundai.png"), fields: ["AI·AX", "반도체·딥테크·모빌리티", "제조·소부장"] },
    { name: "CJ ENM", logo: L("cjenm.png"), fields: ["뷰티·바이오·헬스케어"] },
    {
      name: "메르세데스-벤츠 코리아",
      logo: L("mercedes-benz.png"),
      fields: ["콘텐츠·플랫폼", "AI·AX", "반도체·딥테크·모빌리티", "뷰티·바이오·헬스케어", "제조·소부장", "관광·레저"],
      note: "모빌리티·자동차 분야와 협업 가능성이 있는 아이템·기술 전반",
    },
    { name: "솔루엠", aliases: ["SOLUM"], logo: L("solum.svg"), fields: [] },
    { name: "조광페인트", logo: L("chokwang.png"), fields: ["AI·AX", "반도체·딥테크·모빌리티", "제조·소부장"] },
    { name: "GS리테일", logo: L("gs-retail.png"), fields: ["콘텐츠·플랫폼", "SaaS·엔터프라이즈 SW", "AI·AX", "뷰티·바이오·헬스케어"] },
    { name: "DRB동일", logo: L("drb.png"), fields: ["AI·AX", "반도체·딥테크·모빌리티", "뷰티·바이오·헬스케어", "제조·소부장"] },
    { name: "LS일렉트릭", aliases: ["LS ELECTRIC"], logo: L("ls-electric.png"), fields: ["AI·AX", "제조·소부장"] },
    { name: "폴라리스오피스", logo: L("polaris-office.png"), fields: ["SaaS·엔터프라이즈 SW", "AI·AX", "제조·소부장"] },
    { name: "삼성화재", aliases: ["삼성화재해상보험"], logo: L("samsung-fire.png"), fields: [] },
  ],
  cvc: [
    { name: "가온그룹", logo: L("kaon.png"), stages: [], fields: ["SaaS·엔터프라이즈 SW", "AI·AX"] },
    { name: "롯데벤처스", aliases: ["Lotte Ventures"], logo: L("lotte-ventures.png"), stages: [] },
    { name: "CKD창업투자", logo: L("ckd.png"), stages: ["Pre-A", "Series A", "Series B 이상"] },
    { name: "코오롱인베스트먼트", aliases: ["Kolon Investment"], logo: L("kolon-investment.png"), stages: [] },
    { name: "플랜에이치벤처스", aliases: ["Plan.H", "플랜H벤처스", "Plan H Ventures"], logo: L("planh-ventures.png"), stages: [] },
    { name: "현대차증권", logo: L("hyundai-securities.png"), stages: ["Seed", "Pre-A", "Series A", "Series B 이상"] },
    { name: "포스코기술투자", logo: L("posco-investment.png"), stages: ["Seed", "Pre-A", "Series A", "Series B 이상", "단계 무관"] },
    { name: "LX벤처스", aliases: ["LX Ventures"], logo: L("lx-ventures.png"), stages: [] },
    { name: "솔리드X", aliases: ["Solid X", "SolidX", "솔리드엑스"], logo: L("solidx.png"), stages: [] },
    { name: "콜마바이오텍", logo: L("kolmar-biotech.png"), stages: [], fields: ["뷰티·바이오·헬스케어"] },
  ],
};

// 함께하는 기업·기관 — 페이지는 시트 접수 탭에서 자동으로 불러오며,
// 아래 명단은 시트를 읽지 못할 때만 쓰는 예비용 (2026-11-18 기준)
export const PARTICIPANTS = {
  public: [
    "인천테크노파크",
    "경기도경제과학진흥원",
    "관악중소벤처진흥원",
    "인천관광공사",
    "화성산업진흥원",
    "수원시정연구원",
    "부산진해경제자유구역청",
    "고용노동부 사회적기업과",
    "한국산업단지공단",
    "한국핀테크지원센터",
    "예술경영지원센터",
    "김해의생명산업진흥원",
    "해양수산과학기술진흥원",
  ],
  private: [
    "CJ ENM",
    "HD현대삼호",
    "GS리테일",
    "LS일렉트릭",
    "호반그룹",
    "호반건설",
    "폴라리스오피스",
    "조광페인트",
    "MBC충북",
    "가온그룹",
    "아주",
    "코엑스",
    "효성NHCMS",
    "DRB동일",
    "동일고무벨트",
    "한국에자이",
    "코오롱글로벌",
    "엔켐",
  ],
  investors: [
    "포스코기술투자",
    "NH벤처투자",
    "원익투자파트너스",
    "플래티넘기술투자",
    "제이커브인베스트먼트",
    "효성벤처스",
    "CKD창업투자",
    "현대차증권",
    "한양대기술지주",
    "엑셀인베스트먼트",
    "플러그앤플레이 코리아",
  ],
};

// 세부 시간표 (운영관리 시트 '02. 프로그램 운영' 기준)
// keynotes: "public" | "private" 이면 KEYNOTES 의 기관별 시간이 함께 표시된다
export const SCHEDULE = [
  {
    time: "13:30 – 13:45",
    part: "개회",
    title: "개회사 및 TAP · CORI 소개",
  },
  {
    time: "13:45 – 14:05",
    part: "1부",
    title: "키노트 · 공공 OI 사례",
    keynotes: "public",
  },
  {
    time: "14:05 – 14:45",
    part: "1부",
    title: "키노트 · 민간 OI 사례",
    keynotes: "private",
  },
  {
    time: "14:45 – 15:10",
    part: "참가자 소개",
    title: "참가자 소개",
    desc: "공공기관 및 민간기업 대표자 중심 소개",
  },
  {
    time: "15:10 – 15:40",
    part: "네트워킹",
    title: "자유 네트워킹",
    desc: "공공 · 민간 OI 담당자와 참여자 간 자유 교류",
  },
  {
    time: "15:40 – 17:30",
    part: "2부",
    title: "1:1 비즈니스 Meet-up",
    desc: "민간기업 × 스타트업 · 투자사(CVC) × 스타트업 1:1 밋업 (회차별 20분, 멀티룸 A~E)",
  },
];

// /api/stats 가 시트 연동에 실패할 때 쓰는 최근 스냅샷
// corporates = '(2) 접수_민간기업' + '(3) 접수_투자사' 신청 기업 수 (중복 제외)
export const STATS_FALLBACK = {
  total: 74,
  publicOrgs: 13,
  corporates: 29,
  attendees: 102,
  updatedAt: "2026-11-18",
  source: "snapshot",
};
