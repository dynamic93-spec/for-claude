// 1:1 밋업 신청 화면에서 기업명 입력 시 신청 자격(지원사업 참여 여부)만 확인
// 명단 내용·참여 사업명은 응답하지 않는다 (자격 여부만)
import { isEligibleStartup } from "../../../lib/sheets";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const name = new URL(req.url).searchParams.get("name") || "";
  if (name.trim().length < 2) {
    return Response.json({ ok: false, error: "name_too_short" }, { status: 400 });
  }
  try {
    const eligible = await isEligibleStartup(name.slice(0, 100));
    return Response.json({ ok: true, eligible });
  } catch {
    return Response.json({ ok: false, error: "list_unavailable" }, { status: 503 });
  }
}
