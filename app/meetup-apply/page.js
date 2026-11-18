"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MEETUP_PARTNERS } from "../../lib/event-data";

const GROUPS = [
  { key: "oi", label: "민간기업 OI 미팅", hint: "사업 협력(실증·공동개발 등)" },
  { key: "cvc", label: "CVC · 투자사 미팅", hint: "투자 유치 상담" },
];
const STAGES = ["투자 이력 없음", "Seed", "Pre-A", "Series A", "Series B 이상"];

export default function MeetupApplyPage() {
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState(null); // null | "sending" | "ok" | "err"
  const [errMsg, setErrMsg] = useState("");

  // 카드에서 넘어온 참여사를 미리 선택 (?partner=회사명)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("partner");
    const all = [...MEETUP_PARTNERS.oi, ...MEETUP_PARTNERS.cvc].map((x) => x.name);
    if (p && all.includes(p)) setSelected([p]);
  }, []);

  const toggle = (name) =>
    setSelected((s) => (s.includes(name) ? s.filter((n) => n !== name) : [...s, name]));

  async function onSubmit(e) {
    e.preventDefault();
    if (!selected.length) {
      setStatus("err");
      setErrMsg("밋업을 희망하는 참여사를 1곳 이상 선택해 주세요.");
      return;
    }
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setErrMsg("");
    try {
      const res = await fetch("/api/meetup-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, partners: selected, agree: data.agree === "on" }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus("ok");
        form.reset();
        setSelected([]);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setStatus("err");
        setErrMsg(
          json.error === "not_ready"
            ? "접수 시스템 연동 준비 중입니다. 잠시 후 다시 시도하시거나 담당자에게 문의해 주세요."
            : "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
      }
    } catch {
      setStatus("err");
      setErrMsg("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-card form-card-wide">
          <Link href="/#meetup" className="back-link">
            ← 1:1 비즈니스 밋업 참여사 보기
          </Link>
          <h1>1:1 비즈니스 밋업 참여 신청</h1>
          <p className="sub">
            2026 CORI 2부 1:1 비즈니스 밋업에서 만나고 싶은 참여사를 선택해 신청해 주세요.
            여러 곳을 함께 선택할 수 있습니다.
          </p>

          <div className="notice-box" role="note">
            <b>신청 전 꼭 확인해 주세요</b>
            <ul>
              <li>
                1:1 밋업은 <strong>참여사의 검토와 매칭 결과에 따라</strong> 진행됩니다.
              </li>
              <li>
                <strong>신청하셔도 밋업이 성사되지 않을 수 있으며</strong>, 선택하신 모든
                참여사와의 미팅을 보장하지 않습니다.
              </li>
              <li>매칭 결과와 세부 일정은 추후 개별 안내드립니다.</li>
              <li>행사 참가 신청과는 별도의 신청입니다. 행사 참가 신청도 함께 진행해 주세요.</li>
            </ul>
          </div>

          {status === "ok" ? (
            <div className="form-msg ok">
              밋업 신청이 접수되었습니다. 참여사 검토 후 매칭 결과를 개별 안내드리겠습니다.
              감사합니다.
              <div style={{ marginTop: 12 }}>
                <Link href="/#meetup" className="back-link" style={{ margin: 0 }}>
                  ← 참여사 목록으로 돌아가기
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <div className="field">
                <label>
                  희망 밋업 참여사 <span className="req">*</span>
                  <span className="field-hint"> {selected.length}곳 선택</span>
                </label>
                {GROUPS.map((g) => (
                  <div className={`pick-group mp-${g.key}`} key={g.key}>
                    <div className="pick-title">
                      {g.label}
                      <small>{g.hint}</small>
                    </div>
                    <div className="pick-list">
                      {MEETUP_PARTNERS[g.key].map((p) => (
                        <button
                          type="button"
                          key={p.name}
                          className={`pick${selected.includes(p.name) ? " on" : ""}`}
                          aria-pressed={selected.includes(p.name)}
                          onClick={() => toggle(p.name)}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="field">
                <label>
                  기업명 <span className="req">*</span>
                </label>
                <input name="company" required placeholder="예) 주식회사 OOO" />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>
                    담당자 성명 <span className="req">*</span>
                  </label>
                  <input name="name" required placeholder="홍길동" />
                </div>
                <div className="field">
                  <label>직함</label>
                  <input name="title" placeholder="대표 / 팀장" />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>
                    연락처 <span className="req">*</span>
                  </label>
                  <input name="phone" type="tel" required placeholder="010-0000-0000" />
                </div>
                <div className="field">
                  <label>
                    이메일 <span className="req">*</span>
                  </label>
                  <input name="email" type="email" required placeholder="name@company.com" />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>주요 사업 분야</label>
                  <input name="field" placeholder="예) AI·AX, 뷰티·바이오·헬스케어" />
                </div>
                <div className="field">
                  <label>현재 투자 단계</label>
                  <select name="stage" defaultValue="">
                    <option value="">선택해 주세요</option>
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label>
                  아이템 소개 <span className="req">*</span>
                </label>
                <textarea
                  name="item"
                  required
                  placeholder="핵심 제품·서비스와 주요 성과를 간단히 소개해 주세요."
                />
              </div>
              <div className="field">
                <label>밋업 희망 내용</label>
                <textarea
                  name="message"
                  placeholder="선택한 참여사와 논의하고 싶은 협업·투자 내용을 적어 주세요."
                />
              </div>
              <label className="agree">
                <input type="checkbox" name="agree" required />
                <span>
                  개인정보 수집·이용에 동의합니다. (수집 항목: 기업명, 담당자 성명·직함·연락처·이메일 /
                  이용 목적: 1:1 밋업 매칭 및 안내)
                </span>
              </label>

              <button className="form-submit" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "접수 중..." : "1:1 밋업 신청하기"}
              </button>
              {status === "err" && <div className="form-msg err">{errMsg}</div>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
