import { STATS_FALLBACK } from "../../../lib/event-data";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const SHEET_ID =
  process.env.CORI_SHEET_ID || "1jiaAZQx9cl6SO-x6VoAfUfCFLjTavawRs2-eSeWxaqU";
const GID = process.env.CORI_SHEET_GID || "146907861";

// '00. 접수현황(총괄)' 탭의 핵심 지표 행:
// 6행 = 라벨(공공기관/민간기업/CVC/전체 접수), 7행 = 숫자(13개사 ...), 8행 = 참석 예정 메모
const DASHBOARD_RANGE = "B6:I8";

// '대·중견기업 · 투자사' 카드는 아래 두 접수 탭의 명단을 합쳐 기업 수를 센다.
// 두 탭 모두 D열 = 구분(신청자 / 추가 참석자 / 중복 접수), E열 = 회사·기관명, 5행부터 데이터.
const CORPORATE_TABS = ["(2) 접수_민간기업", "(3) 접수_투자사"];
const LIST_RANGE = "D5:E1000";

let cache = { data: null, at: 0 };
const TTL = 30 * 1000; // 30초 캐시

function parseCount(text) {
  if (!text) return null;
  const m = String(text).match(/(\d+)\s*개사/);
  return m ? parseInt(m[1], 10) : null;
}

function parseAttendees(text) {
  if (!text) return null;
  const m = String(text).match(/참석\s*예정\s*(\d+)\s*명/);
  return m ? parseInt(m[1], 10) : null;
}

// 같은 회사가 '조광페인트(주)' / '조광페인트' 처럼 다르게 적혀도 한 곳으로 센다
function normalizeName(name) {
  return String(name)
    .replace(/\(주\)|㈜|주식회사|\(유\)|유한회사/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

async function fetchGviz(query) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&headers=0&${query}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`sheet fetch ${res.status}`);
  const text = await res.text();
  // gviz 응답: google.visualization.Query.setResponse({...});
  const data = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1));
  if (data.status === "error") throw new Error("gviz error");
  return data.table.rows.map((r) => (r.c || []).map((c) => (c && (c.f ?? c.v)) ?? ""));
}

async function countCorporates() {
  const lists = await Promise.all(
    CORPORATE_TABS.map((tab) =>
      fetchGviz(`sheet=${encodeURIComponent(tab)}&range=${LIST_RANGE}`)
    )
  );
  const names = new Set();
  for (const rows of lists) {
    for (const [kind, name] of rows) {
      // '신청자' 행만 센다 (추가 참석자·중복 접수 제외)
      if (String(kind).trim() !== "신청자" || !String(name).trim()) continue;
      names.add(normalizeName(name));
    }
  }
  return names.size;
}

async function readDashboard() {
  const rows = await fetchGviz(`gid=${GID}&range=${DASHBOARD_RANGE}`);
  // 라벨 행에서 각 지표의 열 위치를 찾는다 (시트 열 이동에 대비)
  const [labels = [], values = [], notes = []] = rows;
  const findCol = (kw) => labels.findIndex((l) => String(l).includes(kw));
  return {
    total: parseCount(values[findCol("전체")]),
    publicOrgs: parseCount(values[findCol("공공기관")]),
    attendees: parseAttendees(notes[findCol("전체")]),
  };
}

export async function GET() {
  const now = Date.now();
  if (cache.data && now - cache.at < TTL) {
    return Response.json(cache.data);
  }

  const [dash, corp] = await Promise.allSettled([readDashboard(), countCorporates()]);
  const d = dash.status === "fulfilled" ? dash.value : {};
  const corporates =
    corp.status === "fulfilled" && corp.value > 0 ? corp.value : null;

  const live = Boolean(d.total) || corporates !== null;
  const stats = {
    total: d.total ?? STATS_FALLBACK.total,
    publicOrgs: d.publicOrgs ?? STATS_FALLBACK.publicOrgs,
    corporates: corporates ?? STATS_FALLBACK.corporates,
    attendees: d.attendees ?? STATS_FALLBACK.attendees,
    updatedAt: live ? new Date().toISOString() : STATS_FALLBACK.updatedAt,
    source: live ? "sheet" : "snapshot",
    // 진단용: 각 지표를 시트에서 실제로 읽었는지 (false 면 스냅샷 값)
    live: { dashboard: Boolean(d.total), lists: corporates !== null },
  };

  cache = { data: stats, at: now };
  return Response.json(stats);
}
