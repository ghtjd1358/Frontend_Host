# MFA - Micro Frontend Architecture

## 기술 스택
- React 19 + TypeScript
- Webpack 5 Module Federation
- Redux Toolkit + React Redux
- Supabase (PostgreSQL + Auth)

## 빌드 명령어
```bash
# 루트 레벨
npm run dev           # 모든 앱 동시 실행 (host + remote1/2/3)
npm run dev:host      # Host만 실행 (port 5000)
npm run dev:remote1   # Resume 앱 (port 5001)
npm run dev:remote2   # Blog 앱 (port 5002)
npm run dev:remote3   # Portfolio 앱 (port 5003)

npm run build:all     # 전체 빌드 (lib → remotes → host)
npm run build:lib     # 공유 라이브러리 빌드
```

## 아키텍처
```
mfa/
├── lib/          # @sonhoseong/mfa-lib (공유 컴포넌트, 훅, 유틸)
├── host/         # 컨테이너 앱 (port 5000)
├── remote1/      # @resume 앱 (port 5001)
├── remote2/      # @blog 앱 (port 5002)
└── remote3/      # @portfolio 앱 (port 5003)
```

## KOMCA 패턴
- **동적 리모트 로딩:** 런타임에 remoteEntry.js 로드
- **캐시 무효화:** 1분 타임스탬프로 캐시 버스팅
- **Graceful Fallback:** 리모트 로드 실패 시 null 반환

## 핵심 패턴
- **Host App Flag:** `sessionStorage.isHostApp`로 컨텍스트 구분
- **Store 공유:** `window.__REDUX_STORE__`로 호스트 스토어 노출
- **토큰 리프레시:** Axios 인터셉터에서 자동 갱신
- **DeferredComponent:** 150ms 지연 로딩으로 플리커 방지

## 환경변수
```bash
REACT_APP_SUPABASE_URL=...
REACT_APP_SUPABASE_ANON_KEY=...
REMOTE1_URL=https://...vercel.app  # 프로덕션 리모트 URL
REMOTE2_URL=https://...vercel.app
REMOTE3_URL=https://...vercel.app
```

## 배포 (Vercel)
- 각 앱 별도 Vercel 프로젝트로 배포
- CORS 헤더 설정 필수 (`vercel.json`)
- Deployment Protection 비활성화 필요 (remoteEntry.js 접근용)

## 주의사항
- 리모트 앱 독립 실행 시 `init.tsx`에서 `removeHostApp()` 호출
- 공유 의존성은 `singleton: true`로 설정
- 경로 alias: `@/` = `src/`, `@blog/`, `@resume/`, `@portfolio/`
