// 1:1 비즈니스 밋업 참여 신청 접수 API
// OI 밋업과 같은 Apps Script 웹앱으로 보내되 type: "meetup" 을 붙여
// 운영관리 시트 '05. 1:1 밋업 신청' 탭에 적재되도록 한다.
// Apps Script 를 type 분기 버전으로 업데이트한 뒤 MEETUP_APPLY_ENABLED=1 로 켠다
// (구버전 스크립트에 보내면 OI 탭에 잘못된 행이 쌓이므로).
import { MEETUP_PARTNERS } from "../../../lib/event-data";
import { isEligibleStartup } from "../../../lib/sheets";

export const dynamic = "force-dynamic";

const PARTNER_NAMES = new Set(
  [...MEETUP_PARTNERS.oi, ...MEETUP_PARTNERS.cvc].map((p) => p.name)
);

const clip = (v, n) => String(v ?? "").trim().slice(0, n);

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  const partners = Array.isArray(body.partners)
    ? body.partners.filter((p) => PARTNER_NAMES.has(p))
    : [];
  if (!partners.length) {
    return Response.json({ ok: false, error: "missing field: partners" }, { status: 400 });
  }
  for (const k of ["company", "name", "phone", "email", "item"]) {
    if (!clip(body[k], 10)) {
      return Response.json({ ok: false, error: `missing field: ${k}` }, { status: 400 });
    }
  }
  if (body.agree !== true) {
    return Response.json({ ok: false, error: "missing field: agree" }, { status: 400 });
  }

  // TAP 지원사업 참여 스타트업만 신청 가능 (초청명단 '04. 초청명단(스타트업)' B열 사업명 기재 기업)
  try {
    if (!(await isEligibleStartup(clip(body.company, 100)))) {
      return Response.json({ ok: false, error: "not_eligible" }, { status: 403 });
    }
  } catch {
    return Response.json({ ok: false, error: "list_unavailable" }, { status: 503 });
  }

  const webhook = process.env.OI_MEETUP_WEBHOOK_URL;
  if (process.env.MEETUP_APPLY_ENABLED !== "1" || !webhook) {
    return Response.json({ ok: false, error: "not_ready" }, { status: 503 });
  }

  const record = {
    type: "meetup",
    submittedAt: new Date().toISOString(),
    partners: partners.join(", "),
    company: clip(body.company, 100),
    name: clip(body.name, 50),
    title: clip(body.title, 50),
    phone: clip(body.phone, 30),
    email: clip(body.email, 100),
    field: clip(body.field, 100),
    stage: clip(body.stage, 30),
    item: clip(body.item, 1000),
    message: clip(body.message, 1000),
  };

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "forward_failed" }, { status: 502 });
  }
}
