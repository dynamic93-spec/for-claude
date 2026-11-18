// 2부 1:1 비즈니스 Meet-up 확정 참여사 카드 그리드
function PartnerCard({ p, tags, tagLabel }) {
  return (
    <li className="mp-card">
      <div className={`mp-logo${p.logoDark ? " is-dark" : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.logo} alt={`${p.name} 로고`} loading="lazy" />
      </div>
      <div className="mp-body">
        <h4 className="mp-name">{p.name}</h4>
        {tags.length > 0 && (
          <>
            <span className="mp-tag-label">{tagLabel}</span>
            <ul className="mp-tags">
              {tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </>
        )}
        {p.note && <p className="mp-note">{p.note}</p>}
      </div>
    </li>
  );
}

export default function MeetupPartners({ partners }) {
  return (
    <>
      <div className="mp-group">
        <div className="mp-head">
          <h3>민간기업 OI</h3>
          <span>{partners.oi.length}개사 · 관심 스타트업 분야</span>
        </div>
        <ul className="mp-grid">
          {partners.oi.map((p) => (
            <PartnerCard key={p.name} p={p} tags={p.fields || []} tagLabel="관심 분야" />
          ))}
        </ul>
      </div>

      <div className="mp-group">
        <div className="mp-head">
          <h3>CVC · 투자사</h3>
          <span>{partners.cvc.length}개사 · 희망 투자 단계</span>
        </div>
        <ul className="mp-grid">
          {partners.cvc.map((p) => (
            <PartnerCard key={p.name} p={p} tags={p.stages || []} tagLabel="투자 단계" />
          ))}
        </ul>
      </div>
    </>
  );
}
