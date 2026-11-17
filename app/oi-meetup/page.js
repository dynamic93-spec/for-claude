"use client";

import { useState } from "react";
import Link from "next/link";

export default function OiMeetupPage() {
  const [status, setStatus] = useState(null); // null | "sending" | "ok" | "err"
  const [errMsg, setErrMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setErrMsg("");
    try {
      const res = await fetch("/api/oi-meetup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("err");
        setErrMsg(
          json.error === "webhook_not_configured"
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
        <div className="form-card">
          <Link href="/" className="back-link">
            ← 2026 CORI 메인으로
          </Link>
          <h1>TAP 오픈이노베이션 밋업 신청</h1>
          <p className="sub">
            탭엔젤파트너스와 오픈이노베이션 협업을 희망하는 <b>대·중견기업</b> 및{" "}
            <b>공공기관</b>을 위한 별도 밋업 신청 페이지입니다. 신청 내용 검토 후
            담당자가 개별 연락드립니다.
          </p>

          <form onSubmit={onSubmit}>
            <div className="field">
              <label>
                기관 유형 <span className="req">*</span>
              </label>
              <select name="orgType" required defaultValue="">
                <option value="" disabled>
                  선택해 주세요
                </option>
                <option value="대기업">대기업</option>
                <option value="중견기업">중견기업</option>
                <option value="공공기관">공공기관</option>
                <option value="투자사·CVC">투자사·CVC</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div className="field">
              <label>
                기관·기업명 <span className="req">*</span>
              </label>
              <input name="orgName" required placeholder="예) OO주식회사 / OO진흥원" />
            </div>
            <div className="field">
              <label>
                담당자 성명 <span className="req">*</span>
              </label>
              <input name="name" required placeholder="홍길동" />
            </div>
            <div className="field">
              <label>직함</label>
              <input name="title" placeholder="팀장 / 매니저" />
            </div>
            <div className="field">
              <label>연락처</label>
              <input name="phone" type="tel" placeholder="010-0000-0000" />
            </div>
            <div className="field">
              <label>
                이메일 <span className="req">*</span>
              </label>
              <input name="email" type="email" required placeholder="name@company.com" />
            </div>
            <div className="field">
              <label>관심 협업 분야</label>
              <input
                name="interest"
                placeholder="예) AI·AX, 실증·PoC, 전략적 투자, 공동 연구개발"
              />
            </div>
            <div className="field">
              <label>협업 희망 내용</label>
              <textarea
                name="message"
                placeholder="찾고 계신 스타트업 분야, 협업 형태 등을 자유롭게 작성해 주세요."
              />
            </div>

            <button className="form-submit" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "접수 중..." : "밋업 신청하기"}
            </button>
          </form>

          {status === "ok" && (
            <div className="form-msg ok">
              신청이 정상적으로 접수되었습니다. 검토 후 담당자가 연락드리겠습니다. 감사합니다.
            </div>
          )}
          {status === "err" && <div className="form-msg err">{errMsg}</div>}
        </div>
      </div>
    </div>
  );
}
