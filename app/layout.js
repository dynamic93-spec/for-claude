import "./globals.css";

export const metadata = {
  title: "2026 CORI | 공공&민간 연계 오픈이노베이션 네트워킹",
  description:
    "Connect with Our Rising Innovation — 탭엔젤파트너스가 주관하는 4회차 공공-민간 오픈이노베이션 네트워킹. 2026.12.3(목) 드림플러스 강남.",
  openGraph: {
    title: "2026 CORI | 공공&민간 연계 오픈이노베이션 네트워킹",
    description:
      "공공기관 · 대·중견기업 · 투자사 · 스타트업이 한자리에. 키노트, 네트워킹, 1:1 비즈니스 밋업.",
    images: ["/keyvisual.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
