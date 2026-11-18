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
