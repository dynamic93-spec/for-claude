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

적재 위치: `2026 CORI 운영관리_TAP` 시트의 `04. TAP OI 밋업 신청` 탭

1. 운영관리 시트에서 **확장 프로그램 → Apps Script** 열기
2. 기존 `Code.gs`(CORI 매칭 메뉴 등)는 **건드리지 말고**, 파일 `+` → 스크립트로 `OiMeetup.gs`를 새로 만들어 아래 코드 붙여넣기
3. **배포 → 새 배포 → 웹 앱** (실행: 나 / 액세스: 모든 사용자) 로 배포

```javascript
var OI_SHEET_ID = "1ZnGwukihba5K9gvhhe97nvxZ0tSI_XHNub1iWSiLPUk"; // 2026 CORI 운영관리_TAP
var OI_TAB_NAME = "04. TAP OI 밋업 신청";
var MEETUP_TAB_NAME = "05. 1:1 밋업 신청";

function doPost(e) {
  var row = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.openById(OI_SHEET_ID);
  if (row.type === "meetup") {
    ss.getSheetByName(MEETUP_TAB_NAME).appendRow([
      new Date(), row.partners, row.company, row.name, row.title,
      row.phone, row.email, row.field, row.stage, row.item, row.message,
    ]);
  } else {
    ss.getSheetByName(OI_TAB_NAME).appendRow([
      new Date(), row.orgType, row.orgName, row.name, row.title,
      row.phone, row.email, row.interest, row.message,
    ]);
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

> 시트 ID로 직접 열므로 스크립트가 시트에 바인딩되어 있지 않아도 동작합니다. 탭 이름을 바꾸면 `OI_TAB_NAME`도 같이 바꿔야 합니다.
> 프로젝트에 `doPost` 함수가 이미 있으면 이름이 겹치므로 먼저 확인하세요.

3. 배포 URL을 Vercel 환경변수 `OI_MEETUP_WEBHOOK_URL` 에 설정 후 재배포

## 1:1 비즈니스 밋업 참여 신청

- 페이지: `/meetup-apply` (참여사 카드 클릭 시 `?partner=회사명` 으로 미리 선택)
- API: `/api/meetup-apply` → 같은 Apps Script 웹앱에 `type: "meetup"` 으로 전달
- 적재 위치: 운영관리 시트 `05. 1:1 밋업 신청` 탭
- Apps Script 가 `type` 분기 버전으로 업데이트된 뒤 Vercel 환경변수 `MEETUP_APPLY_ENABLED=1` 을 켜야 접수됨
  (켜기 전에는 "접수 시스템 연동 준비 중" 안내)

## 참여 기업·기관 명단 / 시간표

- 키노트·참여기관·시간표: `lib/event-data.js` (`KEYNOTES`, `PARTICIPANTS`, `SCHEDULE`)

## 키노트 기관 로고

- 파일: `public/keynote-logos/` (흰색 배지 위에 원본 컬러로 표시)
- 연결: `lib/event-data.js` 의 `KEYNOTES` 각 항목 `logo: "/keynote-logos/파일명"`
- `logo` 가 없으면 이름만 표시하고 로고 자리는 비워 정렬을 유지
- 권장 파일: 투명 배경 PNG 또는 SVG, 여백 없이 잘라낸 가로형 로고

## 개발

```bash
npm install
npm run dev
```
