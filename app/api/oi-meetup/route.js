// TAP 오픈이노베이션 밋업 신청 접수 API
// Google Apps Script 웹앱(스프레드시트 'TAP OI 밋업 신청 테이블'에 append)으로 전달한다.
// Vercel 환경변수 OI_MEETUP_WEBHOOK_URL 에 Apps Script 배포 URL을 설정하면 활성화된다.

export const dynamic = "force-dynamic";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  const required = ["orgType", "orgName", "name", "email"];
  for (const k of required) {
    if (!body[k] || String(body[k]).trim() === "") {
      return Response.json(
        { ok: false, error: `missing field: ${k}` },
        { status: 400 }
      );
    }
  }

  const record = {
    submittedAt: new Date().toISOString(),
    orgType: String(body.orgType).slice(0, 50),
    orgName: String(body.orgName).slice(0, 100),
    name: String(body.name).slice(0, 50),
    title: String(body.title || "").slice(0, 50),
    phone: String(body.phone || "").slice(0, 30),
    email: String(body.email).slice(0, 100),
    interest: String(body.interest || "").slice(0, 500),
    message: String(body.message || "").slice(0, 1000),
  };

  const webhook = process.env.OI_MEETUP_WEBHOOK_URL;
  if (!webhook) {
    return Response.json(
      {
        ok: false,
        error: "webhook_not_configured",
        hint: "OI_MEETUP_WEBHOOK_URL 환경변수를 설정해 주세요.",
      },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json(
      { ok: false, error: "forward_failed" },
      { status: 502 }
    );
  }
}
