// 2026 CORI 초청명단 시트(gviz 공개 엔드포인트) 읽기 공용 함수
// 시트는 '링크가 있는 모든 사용자 - 뷰어'로 공유되어 있어야 한다.

export const SHEET_ID =
  process.env.CORI_SHEET_ID || "1jiaAZQx9cl6SO-x6VoAfUfCFLjTavawRs2-eSeWxaqU";

// 접수 탭: D열 = 구분(신청자 / 추가 참석자 / 중복 접수), E열 = 회사·기관명, 5행부터 데이터
export const SIGNUP_TABS = {
  public: "(1) 접수_공공기관",
  private: "(2) 접수_민간기업",
  investors: "(3) 접수_투자사",
};
const LIST_RANGE = "D5:E1000";

// 표시용 이름: 법인 표기만 떼고 원래 띄어쓰기는 유지 ('조광페인트(주)' → '조광페인트')
export function displayName(name) {
  return String(name)
    .replace(/\((주|재|사|유)\)|㈜|㈔|주식회사|유한회사|재단법인|사단법인/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// 비교용 이름: 표시용에서 공백·대소문자까지 무시 ('효성 NHCMS' = '효성NHCMS')
export function normalizeName(name) {
  return displayName(name).replace(/\s+/g, "").toLowerCase();
}

export async function fetchGviz(query, fetchOptions = { cache: "no-store" }) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&headers=0&${query}`;
  const res = await fetch(url, { ...fetchOptions, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`sheet fetch ${res.status}`);
  const text = await res.text();
  // gviz 응답: google.visualization.Query.setResponse({...});
  const data = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1));
  if (data.status === "error") throw new Error("gviz error");
  return data.table.rows.map((r) => (r.c || []).map((c) => (c && (c.f ?? c.v)) ?? ""));
}

// 접수 탭에서 '신청자' 행의 기관명을 접수 순서대로, 중복 없이 반환
export async function readSignupNames(tab, fetchOptions) {
  const rows = await fetchGviz(
    `sheet=${encodeURIComponent(tab)}&range=${LIST_RANGE}`,
    fetchOptions
  );
  const seen = new Set();
  const names = [];
  for (const [kind, name] of rows) {
    if (String(kind).trim() !== "신청자" || !String(name).trim()) continue;
    const key = normalizeName(name);
    if (seen.has(key)) continue;
    seen.add(key);
    names.push(displayName(name));
  }
  return names;
}

// ---------- 1:1 밋업 참여사 정보 자동 반영 ----------
// '접수 원본(자동)' 탭 (구글폼 응답 원본, 1행 헤더)
//   C = 회사·기관명, G = 관심 있는 스타트업 분야, I = 주요 투자 단계, R = 중복 여부(자동)
const RAW_TAB = "접수 원본(자동)";
const RAW_RANGE = "C2:R1000";

// 매칭용 이름: 법인 표기·공백·구두점까지 무시 ('메르세데스-벤츠 코리아' = '메르세데스벤츠코리아')
export function matchKey(name) {
  return normalizeName(name).replace(/[-·.,_/()&]/g, "");
}

// 폼 선택지 표기를 카드용으로 정리
function cleanTag(t) {
  return t
    .replace("제조·소부장(소재·부품·장비)", "제조·소부장")
    .trim();
}

// 신청서 응답에서 회사별 { fields, stages, note } 를 만든다.
// '중복' 표시가 없는 응답을 우선 쓰고, 그런 응답이 없을 때만 중복 응답을 쓴다.
export async function readSignupDetails(fetchOptions) {
  const rows = await fetchGviz(
    `sheet=${encodeURIComponent(RAW_TAB)}&range=${RAW_RANGE}`,
    fetchOptions
  );
  const byKey = new Map();
  for (const r of rows) {
    const name = String(r[0] || "").trim();
    if (!name) continue;
    const key = matchKey(name);
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push({
      fields: String(r[4] || ""),
      stages: String(r[6] || ""),
      dup: String(r[15] || "").includes("중복"),
    });
  }
  const details = new Map();
  for (const [key, list] of byKey) {
    const use = list.some((x) => !x.dup) ? list.filter((x) => !x.dup) : list;
    const fields = [];
    const stages = [];
    let note = "";
    for (const x of use) {
      for (const raw of x.fields.split(/,\s+/)) {
        const t = cleanTag(raw);
        if (!t) continue;
        // 선택지가 아닌 긴 자유 기재는 메모로
        if (t.length > 20) note = note || t;
        else if (!fields.includes(t)) fields.push(t);
      }
      for (const raw of x.stages.split(/,\s+/)) {
        const t = raw.trim();
        if (t && !stages.includes(t)) stages.push(t);
      }
    }
    details.set(key, { fields, stages, note });
  }
  return details;
}
