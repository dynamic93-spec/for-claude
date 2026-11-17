// 2026 CORI 행사 데이터
// 참여기업·기관 명단은 '2026 CORI 초청명단_TAPx비드리머' 시트 기준 (수동 갱신)

export const EVENT = {
  title: "CORI",
  fullTitle: "공공&민간 연계 오픈이노베이션 CORI",
  tagline: "Connect with Our Rising Innovation",
  edition: "4th",
  subtitle: "2026 공공-민간 오픈이노베이션 네트워킹",
  date: "2026. 12. 3 (목)",
  time: "13:00 – 18:00",
  venue: "드림플러스 강남 B1F Main Hall",
  address: "서울 서초구 강남대로 311",
  deadline: "2026. 11. 20 (금)",
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
export const KEYNOTES = {
  public: [
    { name: "연구개발특구진흥재단", desc: "공공 OI 사례" },
    { name: "경기도경제과학진흥원", desc: "공공 OI 사례" },
    { name: "서울시 관광산업과", desc: "공공 OI 사례" },
    { name: "인천테크노파크", desc: "공공 OI 사례" },
  ],
  private: [
    { name: "CJ ENM", desc: "민간 OI 사례" },
    { name: "HD현대삼호", desc: "민간 OI 사례" },
  ],
};

// 1:1 밋업 & 참여 기업·기관 (접수 기준, 지속 업데이트)
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

export const PROGRAM = [
  {
    no: "01",
    title: "공공 & 민간 OI 사례 발표",
    desc: "공공기관 · 대·중견기업의 오픈이노베이션 사례 키노트",
  },
  {
    no: "02",
    title: "네트워킹",
    desc: "참석자 소개 · 공공·민간 OI 담당자 간 자유 교류",
  },
  {
    no: "03",
    title: "1:1 비즈니스 Meet-up",
    desc: "민간기업 · 투자사 × 스타트업 1:1 밋업 (최대 100회 미팅)",
  },
];

// /api/stats 가 시트 연동에 실패할 때 쓰는 최근 스냅샷
export const STATS_FALLBACK = {
  total: 71,
  publicOrgs: 13,
  privateCorps: 16,
  cvc: 4,
  vc: 7,
  startups: 27,
  attendees: 96,
  updatedAt: "2026-11-17",
  source: "snapshot",
};
