import Link from "next/link";
import {
  EVENT,
  KEYNOTES,
  PARTICIPANTS,
  MEETUP_PARTNERS,
  SCHEDULE,
  STATS_FALLBACK,
} from "../lib/event-data";
import { SIGNUP_TABS, matchKey, readSignupDetails, readSignupNames } from "../lib/sheets";
import StatsCounter from "./components/StatsCounter";
import LogoMarquee from "./components/LogoMarquee";
import MeetupPartners from "./components/MeetupPartners";

// 페이지를 60초마다 다시 만들어 '함께하는 기업·기관' 명단을 시트와 맞춘다
export const revalidate = 60;

// 접수 탭의 신청 기관명을 불러오고, 실패하거나 비어 있으면 event-data.js 의 명단을 쓴다
async function loadParticipants() {
  const groups = Object.keys(SIGNUP_TABS);
  const results = await Promise.allSettled(
    groups.map((g) => readSignupNames(SIGNUP_TABS[g], { next: { revalidate } }))
  );
  return Object.fromEntries(
    groups.map((g, i) => {
      const r = results[i];
      const names = r.status === "fulfilled" && r.value.length ? r.value : PARTICIPANTS[g];
      return [g, names];
    })
  );
}

function NetworkLines() {
  return (
    <svg
      className="hero-net"
      viewBox="0 0 1440 900"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g stroke="rgba(199,184,245,0.25)" strokeWidth="1">
        <path d="M-50 650 L240 520 L430 700 L720 560 L980 720 L1250 580 L1500 680" />
        <path d="M100 880 L240 520 M430 700 L520 880 M980 720 L1100 900" />
        <path d="M1250 580 L1180 420 L1500 300" />
      </g>
      <g fill="#c7b8f5">
        <circle cx="240" cy="520" r="5" opacity="0.9" />
        <circle cx="430" cy="700" r="4" opacity="0.6" />
        <circle cx="720" cy="560" r="6" opacity="0.8" />
        <circle cx="980" cy="720" r="4" opacity="0.6" />
        <circle cx="1250" cy="580" r="5" opacity="0.85" />
        <circle cx="1180" cy="420" r="3.5" opacity="0.5" />
      </g>
    </svg>
  );
}

// 1:1 밋업 참여사 카드에 신청서 원본의 관심 분야·투자 단계를 덮어써 자동 갱신
async function loadMeetupPartners() {
  let details;
  try {
    details = await readSignupDetails({ next: { revalidate } });
  } catch {
    return MEETUP_PARTNERS;
  }
  const merge = (p) => {
    const hit = [p.name, ...(p.aliases || [])]
      .map((n) => details.get(matchKey(n)))
      .find(Boolean);
    if (!hit) return p;
    return {
      ...p,
      fields: hit.fields.length ? hit.fields : p.fields || [],
      stages: hit.stages.length ? hit.stages : p.stages || [],
      note: p.note || hit.note || undefined,
    };
  };
  return { oi: MEETUP_PARTNERS.oi.map(merge), cvc: MEETUP_PARTNERS.cvc.map(merge) };
}

export default async function Home() {
  const [participants, meetupPartners] = await Promise.all([
    loadParticipants(),
    loadMeetupPartners(),
  ]);
  return (
    <>
      <header className="site-header">
        <div className="inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/tap-logo.png" alt="TAP Angel Partners" className="header-logo" />
          <nav className="header-nav">
            <a href="#about">행사 소개</a>
            <a href="#stats">신청 현황</a>
            <a href="#keynote">키노트</a>
            <a href="#meetup">1:1 밋업</a>
            <a href="#partners">참여 기업·기관</a>
            <a href="#program">프로그램</a>
            <a className="nav-cta" href={EVENT.applyUrl} target="_blank" rel="noreferrer">
              참가 신청
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" style={{ padding: 0 }}>
        <div className="hero-bg" />
        <NetworkLines />
        <div className="hero-vertical en" aria-hidden="true">
          <span>OPEN INNOVATION</span>
        </div>
        <div className="container">
          <div className="hero-edition en">
            <b>{EVENT.edition}</b> OPEN INNOVATION NETWORKING · 2026
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/cori-wordmark.png" alt="CORI" className="hero-wordmark" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/cori-tagline.png"
            alt={EVENT.tagline}
            className="hero-tagline"
          />
          <p className="hero-sub">{EVENT.subtitle}</p>
          <div className="hero-meta">
            <span>
              📅 <b className="nw">{EVENT.date}</b> <span className="nw">{EVENT.time}</span>
            </span>
            <span>
              📍 <b className="nw">{EVENT.venue}</b>{" "}
              <span className="hero-addr nw">({EVENT.address})</span>
            </span>
            <span>
              👥{" "}
              <b>
                <span className="nw">공공기관 ·</span> <span className="nw">대·중견기업 ·</span>{" "}
                <span className="nw">투자사 ·</span> <span className="nw">스타트업</span>
              </b>
            </span>
          </div>
          {/* 버튼마다 '누가 신청하는 창구인지' 한 줄로 표시 */}
          <div className="hero-actions">
            <div className="cta-item">
              <a className="btn btn-primary" href={EVENT.applyUrl} target="_blank" rel="noreferrer">
                참가 신청하기 →
              </a>
              <span className="cta-for">
                <b>전체 참관객</b>
                <span className="nw">공공기관 · 대·중견기업 · 투자사 · 스타트업</span>
              </span>
            </div>
            <div className="cta-item">
              <Link className="btn btn-primary" href="/oi-meetup">
                TAP 협업 미팅 신청
              </Link>
              <span className="cta-for">
                <b>공공기관 · 대·중견기업 전용</b>
                <span className="nw">탭엔젤파트너스와 별도 미팅 희망 시</span>
              </span>
            </div>
          </div>
          <p className="hero-deadline">
            <span className="nw">1:1 밋업은 참여사 매칭 결과에 따라 진행됩니다</span>
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="container">
          <div className="section-label">About CORI</div>
          <h2 className="section-title about-title">
            <span className="nw">공공과 민간의 오픈이노베이션이</span>
            <br />
            <span className="nw">한자리에서 연결됩니다</span>
          </h2>
          <p className="section-desc">
            CORI(Connect with Our Rising Innovation)는 탭엔젤파트너스가 주관하는 공공-민간
            통합형 오픈이노베이션 네트워킹입니다. 공공기관과 대·중견기업 오픈이노베이션 담당자
            간의 상호 교류 및 네트워킹을 통하여 협력사업 발굴과 혁신 생태계 확산의 장을
            마련합니다.
          </p>
          <div className="about-grid">
            <div className="about-card">
              <div className="icon">🏛️</div>
              <h3>공공기관</h3>
              <p>
                공공 오픈이노베이션 사례 공유와 기관 간 교류로 OI 추진 기반을
                강화합니다.
              </p>
            </div>
            <div className="about-card">
              <div className="icon">🏢</div>
              <h3>대·중견기업 · 투자사</h3>
              <p>
                유망 스타트업을 한자리에서 만나 PoC, 공동개발, 전략적 투자 등
                협업 기회를 발굴합니다.
              </p>
            </div>
            <div className="about-card">
              <div className="icon">🚀</div>
              <h3>스타트업</h3>
              <p>
                수요기업·투자사와의 1:1 밋업으로 실증, 납품, 투자유치 등 스케일업
                기회를 연결합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats" className="stats-wrap">
        <div className="container">
          <div className="section-label">Registration</div>
          <h2 className="section-title">2026 CORI 신청 현황</h2>
          <StatsCounter fallback={STATS_FALLBACK} />
        </div>
      </section>

      {/* KEYNOTE */}
      <section id="keynote">
        <div className="container">
          <div className="section-label">Keynote Speech</div>
          <h2 className="section-title">키노트 스피치</h2>
          <p className="section-desc">
            공공기관과 대·중견기업이 직접 들려주는 오픈이노베이션 추진 사례.
          </p>
          <div className="keynote-cols">
            <div className="keynote-col">
              <h3>공공 OI 사례</h3>
              {KEYNOTES.public.map((k, i) => (
                <div className="keynote-card" key={k.name}>
                  <span className="kn-no en">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`kn-logo${k.logo ? "" : " is-empty"}`} aria-hidden={!k.logo}>
                    {k.logo && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={k.logo} alt={`${k.name} 로고`} loading="lazy" />
                    )}
                  </span>
                  <span className="kn-body">
                    <span className="kn-name">
                      {k.parts
                        ? k.parts.map((part, j) => (
                            <span key={part}>
                              {j > 0 && <wbr />}
                              {part}
                            </span>
                          ))
                        : k.name}
                    </span>
                    <span className="kn-desc en">{k.time}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="keynote-col">
              <h3>민간 OI 사례</h3>
              {KEYNOTES.private.map((k, i) => (
                <div className="keynote-card" key={k.name}>
                  <span className="kn-no en">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`kn-logo${k.logo ? "" : " is-empty"}`} aria-hidden={!k.logo}>
                    {k.logo && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={k.logo} alt={`${k.name} 로고`} loading="lazy" />
                    )}
                  </span>
                  <span className="kn-body">
                    <span className="kn-name">
                      {k.parts
                        ? k.parts.map((part, j) => (
                            <span key={part}>
                              {j > 0 && <wbr />}
                              {part}
                            </span>
                          ))
                        : k.name}
                    </span>
                    <span className="kn-desc en">{k.time}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="program-note">※ 발표 기관·기업 및 순서는 사정에 따라 변경될 수 있습니다.</p>
        </div>
      </section>

      {/* 1:1 MEET-UP PARTNERS */}
      <section id="meetup" className="stats-wrap">
        <div className="container">
          <div className="section-label">1:1 Business Meet-up</div>
          <h2 className="section-title">1:1 비즈니스 밋업 참여사</h2>
          <p className="section-desc">
            2부 1:1 비즈니스 밋업에서 스타트업과 만나는 민간기업과 CVC·투자사{" "}
            <span className="nw">
              {MEETUP_PARTNERS.oi.length + MEETUP_PARTNERS.cvc.length}개사입니다.
            </span>
          </p>
          <div className="mp-target" role="note">
            <span className="mp-target-badge">신청 대상</span>
            <div className="mp-target-body">
              <strong>
                <span className="nw">TAP 지원사업 참여</span> <span className="nw">스타트업 전용</span>
              </strong>
              <p>
                탭엔젤파트너스 지원사업에 참여 중인{" "}
                <span className="nw">스타트업만 신청할 수 있습니다.</span>
              </p>
            </div>
          </div>
          <div className="mp-apply">
            <Link className="btn btn-primary" href="/meetup-apply">
              1:1 비즈니스 밋업 참여 신청 →
            </Link>
            <span>
              참여사 카드를 눌러도 신청할 수 있습니다. 신청 후 매칭 결과에 따라 밋업이 성사되지 않을
              수 있습니다.
            </span>
          </div>
          <MeetupPartners partners={meetupPartners} />
        </div>
      </section>

      {/* PARTNERS MARQUEE */}
      <section id="partners" className="marquee-section">
        <div className="container">
          <div className="section-label">Participants</div>
          <h2 className="section-title">함께하는 기업 · 기관</h2>
          <p className="section-desc">
            키노트 및 1:1 밋업에 참여하는 공공기관, <span className="nw">대·중견기업</span>, 투자사입니다.
          </p>

          <div className="marquee-group">
            <div className="mq-label">
              <h3>공공기관</h3>
              <span>{participants.public.length}개 기관</span>
            </div>
            <LogoMarquee items={participants.public} />
          </div>

          <div className="marquee-group">
            <div className="mq-label">
              <h3>대·중견기업</h3>
              <span>{participants.private.length}개사 · 1:1 밋업 OI 파트너</span>
            </div>
            <LogoMarquee items={participants.private} reverse />
          </div>

          <div className="marquee-group">
            <div className="mq-label">
              <h3>투자사 · CVC</h3>
              <span>{participants.investors.length}개사</span>
            </div>
            <LogoMarquee items={participants.investors} />
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section id="program" className="stats-wrap">
        <div className="container">
          <div className="section-label">Program</div>
          <h2 className="section-title">프로그램</h2>
          <p className="section-desc">
            <span className="nw">{EVENT.date}</span> · <span className="nw">{EVENT.venue}</span>
          </p>
          <div className="timetable">
            {SCHEDULE.map((s) => (
              <div className="tt-row" key={s.time}>
                <div className="tt-time en">{s.time}</div>
                <div className="tt-body">
                  <span className="tt-part">{s.part}</span>
                  <h3>{s.title}</h3>
                  {s.desc && <p>{s.desc}</p>}
                  {s.keynotes && (
                    <ul className="tt-speakers">
                      {KEYNOTES[s.keynotes].map((k) => (
                        <li key={k.name}>
                          <span className="en">{k.time}</span>
                          {k.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="program-note">※ 세부 프로그램은 변경될 수 있습니다.</p>
        </div>
      </section>

      {/* OI MEETUP CTA */}
      <section className="oi-cta">
        <div className="container oi-cta-box one-line">
          <div>
            <div className="section-label">TAP Open Innovation</div>
            <h2 className="section-title oi-cta-title">
              탭엔젤파트너스와 오픈이노베이션을 함께하실 기관을 찾습니다
            </h2>
            <p className="section-desc">
              스타트업 협업 수요가 있는 대·중견기업, 공공기관이라면 행사 참가와 별개로
              TAP과의 1:1 OI 밋업을 신청하실 수 있습니다. 검토 후 담당자가 개별
              연락드립니다.
            </p>
          </div>
          <div>
            <Link className="btn btn-primary" href="/oi-meetup">
              TAP 협업 미팅 신청 →
            </Link>
          </div>
        </div>
      </section>

      {/* INFO + APPLY */}
      <section id="apply">
        <div className="container">
          <div className="section-label">Information</div>
          <h2 className="section-title">행사 안내</h2>
          <div className="info-grid">
            <div className="info-card">
              <h4>DATE</h4>
              <div className="big">{EVENT.date}</div>
              <p>{EVENT.time}</p>
            </div>
            <div className="info-card">
              <h4>VENUE</h4>
              <div className="big">{EVENT.venue}</div>
              <p>{EVENT.address}</p>
            </div>
            <div className="info-card">
              <h4>HOST</h4>
              <div className="big">탭엔젤파트너스</div>
              <p>TAP Angel Partners · SINCE 2023</p>
            </div>
          </div>

          <div className="apply-qr">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/qr-apply.png" alt="참가 신청 QR" />
            <div className="t">
              <b>지금 바로 참가 신청하세요</b>
              <span>
                QR 스캔 또는 버튼 클릭으로 신청하실 수 있습니다.
              </span>
            </div>
            <a className="btn btn-primary" href={EVENT.applyUrl} target="_blank" rel="noreferrer">
              참가 신청 →
            </a>
          </div>
        </div>
      </section>

      <footer>
        <div className="inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/tap-logo.png" alt="TAP Angel Partners" />
          <span>
            © 2026 TAP Angel Partners. CORI — Connect with Our Rising Innovation.
          </span>
        </div>
      </footer>
    </>
  );
}
