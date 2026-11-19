// 2부 1:1 비즈니스 Meet-up 확정 참여사 카드 그리드
// 카드를 누르면 해당 참여사가 미리 선택된 밋업 신청 페이지로 이동
// 민간기업 OI(보라) / CVC·투자사(청록)는 색·칸으로 구분
import Link from "next/link";

function PartnerCard({ p, tags, tagLabel, cta }) {
  return (
    <li className="mp-item">
      <Link
        className="mp-card"
        href={`/meetup-apply?partner=${encodeURIComponent(p.name)}`}
        aria-label={`${p.name}와 ${cta} 신청하기`}
      >
        <div className={`mp-logo${p.logoDark ? " is-dark" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.logo} alt={`${p.name} 로고`} loading="lazy" />
        </div>
        <div className="mp-body">
          <h4 className="mp-name">{p.name}</h4>
          <span className="mp-tag-label">{tagLabel}</span>
          {tags.length > 0 ? (
            <ul className="mp-tags">
              {tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          ) : (
            // 정보 미확보 기업: 신청서 원본에 응답이 들어오면 1분 안에 자동으로 교체됨
            <span className="mp-tbd">공개 예정</span>
          )}
          {p.collabs?.length > 0 && (
            <>
              <span className="mp-tag-label mp-sub-label">협업 형태</span>
              <ul className="mp-tags mp-sub-tags mp-collabs">
                {p.collabs.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </>
          )}
          {p.focus?.length > 0 && (
            <>
              <span className="mp-tag-label mp-sub-label">주력 투자 분야</span>
              <ul className="mp-tags mp-sub-tags">
                {p.focus.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </>
          )}
          {p.note && <p className="mp-note">{p.note}</p>}
          <span className="mp-cta">{cta} 신청 →</span>
        </div>
      </Link>
    </li>
  );
}

function GroupHead({ badge, title, desc, count, info }) {
  return (
    <div className="mp-head">
      <span className="mp-badge en">{badge}</span>
      <div className="mp-head-text">
        <h3>
          {title} <span className="mp-count">{count}개사</span>
        </h3>
        <p>
          {desc} <span className="mp-info">· {info}</span>
        </p>
      </div>
    </div>
  );
}

export default function MeetupPartners({ partners }) {
  return (
    <>
      <div className="mp-group mp-oi">
        <GroupHead
          badge="OI"
          title="민간기업 OI 미팅"
          desc="대·중견기업과 실증·공동개발 등 사업 협력을 논의하는 미팅"
          count={partners.oi.length}
          info="카드에 관심 분야·협업 형태 표시"
        />
        <ul className="mp-grid">
          {partners.oi.map((p) => (
            <PartnerCard
              key={p.name}
              p={p}
              tags={p.fields || []}
              tagLabel="관심 분야"
              cta="OI 미팅"
            />
          ))}
        </ul>
      </div>

      <div className="mp-group mp-cvc">
        <GroupHead
          badge="CVC"
          title="CVC · 투자사 미팅"
          desc="CVC·투자사와 투자 유치를 상담하는 미팅"
          count={partners.cvc.length}
          info="카드에 투자 단계·주력 투자 분야 표시"
        />
        <ul className="mp-grid">
          {partners.cvc.map((p) =>
            p.stages?.length || !p.fields?.length ? (
              <PartnerCard
                key={p.name}
                p={p}
                tags={p.stages || []}
                tagLabel="투자 단계"
                cta="투자 미팅"
              />
            ) : (
              <PartnerCard key={p.name} p={p} tags={p.fields} tagLabel="관심 분야" cta="투자 미팅" />
            )
          )}
        </ul>
      </div>
    </>
  );
}
