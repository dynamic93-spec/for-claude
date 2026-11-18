// 2026 CORI 행사 데이터
// 참여기업·기관 명단은 '2026 CORI 초청명단_TAPx비드리머' 시트 기준 (수동 갱신)

export const EVENT = {
  title: "CORI",
  fullTitle: "공공&민간 연계 오픈이노베이션 CORI",
  tagline: "Connect with Our Rising Innovation",
  edition: "4th",
  subtitle: "2026 공공-민간 오픈이노베이션 네트워킹",
  date: "2026. 12. 3 (목)",
  time: "13:30 – 17:00",
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
// 시간은 운영관리 시트 '02. 프로그램 운영' 기준
// parts: 좁은 화면에서 줄바꿈이 필요할 때 끊어도 되는 지점
// logo: public/keynote-logos/ 의 CI 파일 (없으면 이름만 표시, 자리는 비워 정렬 유지)
export const KEYNOTES = {
  public: [
    { name: "성남산업진흥원", time: "13:40", logo: "/keynote-logos/snip.png" },
    { name: "연구개발특구진흥재단", parts: ["연구개발특구", "진흥재단"], time: "13:45", logo: "/keynote-logos/innopolis.png" },
    { name: "경기도경제과학진흥원", parts: ["경기도경제", "과학진흥원"], time: "13:50", logo: "/keynote-logos/gbsa.png" },
    { name: "인천테크노파크", time: "13:55", logo: "/keynote-logos/itp.png" },
    { name: "서울시 관광산업과", time: "14:00", logo: "/keynote-logos/seoul.png" },
  ],
  private: [
    { name: "CJ ENM", time: "14:05", logo: "/keynote-logos/cjenm.png" },
    { name: "HD현대삼호", time: "14:10", logo: "/keynote-logos/hd-hyundai.png" },
    { name: "솔루엠", time: "14:15", logo: "/keynote-logos/solum.svg" },
    { name: "메르세데스-벤츠 코리아", time: "14:20", logo: "/keynote-logos/mercedes-benz.png" },
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
    time: "13:30 – 13:40",
    part: "개회",
    title: "개회사 및 TAP · CORI 소개",
  },
  {
    time: "13:40 – 14:05",
    part: "1부",
    title: "키노트 · 공공 OI 사례",
    keynotes: "public",
  },
  {
    time: "14:05 – 14:25",
    part: "1부",
    title: "키노트 · 민간 OI 사례",
    keynotes: "private",
  },
  {
    time: "14:25 – 14:50",
    part: "참가자 소개",
    title: "참가자 소개",
    desc: "공공기관 및 민간기업 대표자 중심 소개",
  },
  {
    time: "14:50 – 15:20",
    part: "네트워킹",
    title: "자유 네트워킹",
    desc: "공공 · 민간 OI 담당자와 참여자 간 자유 교류",
  },
  {
    time: "15:20 – 17:00",
    part: "2부",
    title: "1:1 비즈니스 Meet-up",
    desc: "민간기업 × 스타트업 · 투자사(CVC) × 스타트업 1:1 밋업 (멀티룸 A~E)",
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
