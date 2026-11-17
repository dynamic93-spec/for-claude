"use client";

import { useEffect, useRef, useState } from "react";

function CountUp({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{display.toLocaleString()}</>;
}

export default function StatsCounter({ fallback }) {
  const [stats, setStats] = useState(fallback);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (alive && data && data.total) setStats(data);
      } catch {}
    };
    load();
    const id = setInterval(load, 30000); // 30초마다 갱신
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const updated =
    stats.source === "sheet"
      ? new Date(stats.updatedAt).toLocaleString("ko-KR", {
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : stats.updatedAt;

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card stat-live">
          <div className="num">
            <CountUp value={stats.total} />
            <small>개사</small>
          </div>
          <div className="label">전체 신청 기업·기관</div>
        </div>
        <div className="stat-card stat-live">
          <div className="num">
            <CountUp value={stats.publicOrgs} />
            <small>개</small>
          </div>
          <div className="label">공공기관</div>
        </div>
        <div className="stat-card stat-live">
          <div className="num">
            <CountUp value={stats.privateCorps + stats.cvc} />
            <small>개사</small>
          </div>
          <div className="label">대·중견기업 · CVC</div>
        </div>
        <div className="stat-card stat-live">
          <div className="num">
            <CountUp value={stats.attendees} />
            <small>명</small>
          </div>
          <div className="label">참석 예정 인원</div>
        </div>
      </div>
      <div className="stats-updated">
        실시간 신청 현황 · 기준 {updated}
        {stats.source !== "sheet" ? " (스냅샷)" : ""}
      </div>
    </>
  );
}
