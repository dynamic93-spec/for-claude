# 2026 CORI 홍보 랜딩페이지

공공&민간 연계 오픈이노베이션 **CORI** (Connect with Our Rising Innovation) 외부 참관 홍보용 웹페이지.

- **일시**: 2026. 12. 3 (목) 13:00–18:00
- **장소**: 드림플러스 강남 B1F Main Hall
- **주관**: 탭엔젤파트너스 (TAP Angel Partners)

## 구성

| 경로 | 내용 |
| --- | --- |
| `/` | 랜딩: 행사 목적, 누적 실적(2023–2025 59개사·150명), 실시간 신청 현황 카운터, 키노트, 참여 기업·기관 로고 마퀴, 프로그램, 참가신청 CTA |
| `/oi-meetup` | TAP 오픈이노베이션 밋업 신청 폼 (대·중견기업/공공기관 대상) |
| `/api/stats` | 구글시트 `00. 접수현황(총괄)` 연동 실시간 집계 (30초 캐시) |
| `/api/oi-meetup` | 밋업 신청 접수 → Apps Script 웹훅으로 시트 적재 |

## 실시간 신청 현황 연동

`/api/stats` 는 시트의 gviz 공개 엔드포인트를 사용합니다. **스프레드시트가 "링크가 있는 모든 사용자 — 뷰어" 로 공유되어 있어야** 동작하며, 비공개 상태면 코드에 내장된 스냅샷 수치로 대체 표시됩니다.

- 시트: `2026 CORI 초청명단_TAPx비드리머` / 탭 `00. 접수현황(총괄)` (gid `146907861`)
- 환경변수로 교체 가능: `CORI_SHEET_ID`, `CORI_SHEET_GID`
- 스냅샷 수치 갱신: `lib/event-data.js` 의 `STATS_FALLBACK`

## OI 밋업 신청 → 구글시트 적재

1. 'TAP OI 밋업 신청 테이블' 시트에서 **확장 프로그램 → Apps Script** 열기
2. 아래 코드 붙여넣고 **배포 → 웹 앱** (액세스: 모든 사용자) 로 배포

```javascript
var SHEET_ID = "1c6qFFrqFiepPHrSR4UyimPJ-GnNLFWo-hj8O260eZbM"; // TAP OI 밋업 신청 테이블

function doPost(e) {
  var row = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  sheet.appendRow([
    new Date(), row.orgType, row.orgName, row.name, row.title,
    row.phone, row.email, row.interest, row.message,
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

> 시트 ID로 직접 열고 첫 번째 탭에 적재하므로, 스크립트가 시트에 바인딩되어 있지 않아도, 탭 이름이 바뀌어도 동작합니다.

3. 배포 URL을 Vercel 환경변수 `OI_MEETUP_WEBHOOK_URL` 에 설정 후 재배포

## 참여 기업·기관 명단 / 로고

- 명단 수정: `lib/event-data.js` (`KEYNOTES`, `PARTICIPANTS`)
- 로고 이미지 노출: `public/logos/` 에 PNG 추가 후 `app/components/LogoMarquee.js` 의 `LOGO_FILES` 매핑에 등록 (미등록 시 텍스트 워드마크 칩으로 표시)

## 개발

```bash
npm install
npm run dev
```
