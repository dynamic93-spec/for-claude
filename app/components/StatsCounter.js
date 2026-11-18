"use client";

import { useEffect, useRef, useState } from "react";

// 자릿수별로 0~9 숫자 띠를 굴려서 목표 숫자에 멈추는 오도미터 효과
function Odometer({ value, active }) {
  const digits = String(value).split("");
  return (
    <span className="odo" aria-label={String(value)}>
      {digits.map((d, i) => {
        // 한 바퀴 이상 돌고 멈추도록 10 + 목표값 위치까지 이동
        const target = active ? 10 + Number(d) : 0;
        return (
          <span className="odo-col" key={`${digits.length}-${i}`} aria-hidden="true">
            <span
              className="odo-strip"
              style={{
                // 띠 높이 = 20칸 → 한 칸 = 5%
                transform: `translateY(-${target * 5}%)`,
                transitionDelay: `${(digits.length - 1 - i) * 120}ms`,
              }}
            >
              {Array.from({ length: 20 }, (_, n) => (
                <span key={n}>{n % 10}</span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}

function StatCard({ value, unit, label, active, pulseKey }) {
  return (
    <div className="stat-card stat-live">
      <span className="stat-pulse" key={pulseKey} />
      <div className="num">
        <Odometer value={value} active={active} />
        <small>{unit}</small>
      </div>
      <div className="label">{label}</div>
    </div>
  );
}

export default function StatsCounter({ fallback }) {
  const [stats, setStats] = useState(fallback);
  const [active, setActive] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  const ref = useRef(null);

  // 화면에 들어오면 숫자 굴리기 시작
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 30초마다 시트에서 갱신, 갱신될 때마다 카드에 펄스 효과
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (alive && data && data.total) {
          setStats(data);
          setPulseKey((k) => k + 1);
        }
      } catch {}
    };
    load();
    const id = setInterval(load, 30000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const updated =
    stats.source === "sheet"
      ? new Date(stats.updatedAt).toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : stats.updatedAt;

  return (
    <div ref={ref}>
      <div className="stats-grid">
        <StatCard value={stats.total} unit="개사" label="전체 신청 기업·기관" active={active} pulseKey={pulseKey} />
        <StatCard value={stats.publicOrgs} unit="개" label="공공기관" active={active} pulseKey={pulseKey} />
        <StatCard
          value={stats.corporates}
          unit="개사"
          label="대·중견기업 · 투자사"
          active={active}
          pulseKey={pulseKey}
        />
        <StatCard value={stats.attendees} unit="명" label="참석 예정 인원" active={active} pulseKey={pulseKey} />
      </div>
      <div className="stats-updated">
        <span className="live-dot" />
        {updated} 업데이트
      </div>
    </div>
  );
}
