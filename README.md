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

function doPost(e) {
  var row = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.openById(OI_SHEET_ID).getSheetByName(OI_TAB_NAME);
  sheet.appendRow([
    new Date(), row.orgType, row.orgName, row.name, row.title,
    row.phone, row.email, row.interest, row.message,
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

> 시트 ID로 직접 열므로 스크립트가 시트에 바인딩되어 있지 않아도 동작합니다. 탭 이름을 바꾸면 `OI_TAB_NAME`도 같이 바꿔야 합니다.
> 프로젝트에 `doPost` 함수가 이미 있으면 이름이 겹치므로 먼저 확인하세요.

3. 배포 URL을 Vercel 환경변수 `OI_MEETUP_WEBHOOK_URL` 에 설정 후 재배포

## 참여 기업·기관 명단 / 시간표

- 키노트·참여기관·시간표: `lib/event-data.js` (`KEYNOTES`, `PARTICIPANTS`, `SCHEDULE`)

## 로고 이미지 넣기

1. **파일 준비**: 투명 배경 PNG(또는 SVG), 높이 80px 이상, 로고 주변 여백 최소화. 어두운 배경이므로 흰색/밝은 버전 로고 권장
2. **파일명**: 영문 소문자·숫자·하이픈만 사용 (예: `cj-enm.png`, `hd-hyundai-samho.png`)
3. **업로드**: GitHub 저장소 → `public/logos/` 폴더 → *Add file → Upload files*
4. **매핑 등록**: `app/components/LogoMarquee.js` 의 `LOGO_FILES` 에 `"기관명": "파일명"` 추가
   기관명은 `lib/event-data.js` 의 `PARTICIPANTS` 표기와 **완전히 같아야** 함

```javascript
const LOGO_FILES = {
  "CJ ENM": "cj-enm.png",
  "HD현대삼호": "hd-hyundai-samho.png",
};
```

5. 커밋하면 Vercel이 자동 재배포 (약 1분). 매핑이 없는 기관은 기존처럼 텍스트로 표시됨

## 개발

```bash
npm install
npm run dev
```
