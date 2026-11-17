import { STATS_FALLBACK } from "../../../lib/event-data";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const SHEET_ID =
  process.env.CORI_SHEET_ID || "1jiaAZQx9cl6SO-x6VoAfUfCFLjTavawRs2-eSeWxaqU";
const GID = process.env.CORI_SHEET_GID || "146907861";

// '00. 접수현황(총괄)' 탭의 핵심 지표 행:
// 6행 = 라벨(공공기관/민간기업/CVC/전체 접수), 7행 = 숫자(13개사 ...), 8행 = 참석 예정 메모
const RANGE = "B6:I8";

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

export async function GET() {
  const now = Date.now();
  if (cache.data && now - cache.at < TTL) {
    return Response.json(cache.data);
  }

  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${GID}&range=${RANGE}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`sheet fetch ${res.status}`);
    const text = await res.text();
    // gviz 응답: google.visualization.Query.setResponse({...});
    const jsonStr = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const data = JSON.parse(jsonStr);
    const rows = data.table.rows.map((r) =>
      (r.c || []).map((c) => (c && (c.f ?? c.v)) ?? "")
    );

    // 라벨 행에서 각 지표의 열 위치를 찾는다 (시트 열 이동에 대비)
    const labels = rows[0] || [];
    const values = rows[1] || [];
    const notes = rows[2] || [];
    const findCol = (kw) => labels.findIndex((l) => String(l).includes(kw));

    const col = {
      publicOrgs: findCol("공공기관"),
      privateCorps: findCol("민간기업"),
      cvc: findCol("CVC"),
      total: findCol("전체"),
    };

    const stats = {
      total: parseCount(values[col.total]) ?? STATS_FALLBACK.total,
      publicOrgs: parseCount(values[col.publicOrgs]) ?? STATS_FALLBACK.publicOrgs,
      privateCorps:
        parseCount(values[col.privateCorps]) ?? STATS_FALLBACK.privateCorps,
      cvc: parseCount(values[col.cvc]) ?? STATS_FALLBACK.cvc,
      attendees:
        parseAttendees(notes[col.total]) ?? STATS_FALLBACK.attendees,
      updatedAt: new Date().toISOString(),
      source: "sheet",
    };

    if (!stats.total) throw new Error("parse failure");

    cache = { data: stats, at: now };
    return Response.json(stats);
  } catch (e) {
    const fallback = { ...STATS_FALLBACK };
    cache = { data: fallback, at: now };
    return Response.json(fallback);
  }
}
