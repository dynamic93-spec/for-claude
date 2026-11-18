"use client";

// 기관/기업 로고 마퀴.
// 로고 이미지가 준비되면 public/logos/<파일명>.png 를 넣고
// LOGO_FILES 매핑에 "기관명": "파일명.png" 을 추가하면 텍스트 대신 로고가 노출된다.
const LOGO_FILES = {
  // 예시: "CJ ENM": "cj-enm.png",
};

// 모든 줄이 같은 속도로 흐르도록, 칩 1개(폭 + 간격)가 지나가는 시간을 고정
// (칸이 커진 만큼 늘려서 읽기 편한 속도 유지)
const SECONDS_PER_ITEM = 4;

function Chip({ name }) {
  const file = LOGO_FILES[name];
  return (
    <span className="logo-chip" title={name}>
      {file ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={`/logos/${file}`} alt={name} />
      ) : (
        <span className="logo-chip-text">{name}</span>
      )}
    </span>
  );
}

export default function LogoMarquee({ items, reverse = false }) {
  // 트랙을 2회 반복해 무한 스크롤 (translateX -50%)
  const doubled = [...items, ...items];
  const duration = items.length * SECONDS_PER_ITEM;
  return (
    <div className={`marquee${reverse ? " reverse" : ""}`}>
      <div className="marquee-track" style={{ "--dur": `${duration}s` }}>
        {doubled.map((name, i) => (
          <Chip key={`${name}-${i}`} name={name} />
        ))}
      </div>
    </div>
  );
}
