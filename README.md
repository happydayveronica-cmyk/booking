# 특별실 예약

교과2실과 수업나눔카페를 날짜별, 1~8교시별로 예약하는 Next.js 앱입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## GitHub / Vercel 배포

1. 이 폴더를 새 GitHub 저장소에 push합니다.
2. Vercel에서 **Add New → Project**를 선택합니다.
3. 저장소를 연결하고 Framework Preset이 `Next.js`인지 확인합니다.
4. 별도 환경 변수 없이 Deploy를 누릅니다.

## 데이터 안내

현재 예약은 브라우저의 `localStorage`에 저장됩니다. 데모나 개인용으로는 바로 사용할 수 있지만 여러 사람이 같은 예약 현황을 공유하려면 Vercel Postgres, Supabase 등의 데이터베이스와 사용자 인증을 연결해야 합니다.
