# MFA Portfolio

Webpack Module Federation 기반의 Micro Frontend Architecture 포트폴리오 프로젝트입니다.

## 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    Host (Container)                      │
│                     localhost:5000                       │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  - React Router 관리                                 │ │
│  │  - Redux Store 생성 및 공유                          │ │
│  │  - 인증/토큰 관리                                    │ │
│  │  - LNB 동적 로딩                                     │ │
│  └─────────────────────────────────────────────────────┘ │
│              ▼                ▼                ▼         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   @resume    │  │    @blog     │  │  @portfolio  │   │
│  │   (이력서)    │  │   (블로그)   │  │ (포트폴리오)  │   │
│  │   :5001      │  │   :5002      │  │   :5003      │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 프로젝트 구조

```
mfa/
├── host/           # Container 앱 (포트 5000)
├── remote1/        # 이력서 앱 (포트 5001) - @resume
├── remote2/        # 블로그 앱 (포트 5002) - @blog
├── remote3/        # 포트폴리오 앱 (포트 5003) - @portfolio
├── shared/         # 공유 코드
└── supabase/       # Supabase 설정
```

## 기술 스택

| 분류 | 기술 |
|------|------|
| Frontend | React 19, TypeScript 5, Redux Toolkit |
| Build | Webpack 5, Module Federation, Babel |
| Backend | Supabase (PostgreSQL, REST API) |
| Hosting | Vercel |
| Test | Puppeteer |

---

## 로컬 개발 환경

### 1. 의존성 설치

```bash
# 각 앱에서 설치
cd host && npm install
cd ../remote1 && npm install
cd ../remote2 && npm install
cd ../remote3 && npm install
```

### 2. 개발 서버 실행

**중요: Remote 앱들을 먼저 실행한 후 Host를 실행해야 합니다!**

```bash
# 터미널 1 - Remote1 (이력서)
cd remote1 && npm start   # http://localhost:5001

# 터미널 2 - Remote2 (블로그)
cd remote2 && npm start   # http://localhost:5002

# 터미널 3 - Remote3 (포트폴리오)
cd remote3 && npm start   # http://localhost:5003

# 터미널 4 - Host (마지막에 실행!)
cd host && npm start      # http://localhost:5000
```

### 3. 접속

| 앱 | URL | 설명 |
|----|-----|------|
| Host (통합) | http://localhost:5000 | 메인 앱 |
| Remote1 | http://localhost:5001 | 이력서 단독 실행 |
| Remote2 | http://localhost:5002 | 블로그 단독 실행 |
| Remote3 | http://localhost:5003 | 포트폴리오 단독 실행 |

### 4. 포트 충돌 해결

`EADDRINUSE: address already in use` 오류가 발생하면 기존 프로세스가 남아있는 것입니다.

**Windows:**
```bash
# 포트 사용 중인 프로세스 확인
netstat -ano | findstr :5000

# 프로세스 종료 (PID를 확인 후)
taskkill /PID <PID> /F
```

**또는 PowerShell:**
```powershell
Stop-Process -Id <PID> -Force
```

> 터미널을 닫을 때는 반드시 **Ctrl+C**로 서버를 먼저 종료하세요!

---

## Vercel 배포

### 배포된 URL

| 앱 | URL |
|----|-----|
| **Host (메인)** | https://host-sonhoseongs-projects.vercel.app |
| Remote1 (이력서) | https://remote1-sonhoseongs-projects.vercel.app |
| Remote2 (블로그) | https://remote2-sonhoseongs-projects.vercel.app |
| Remote3 (포트폴리오) | https://remote3-sonhoseongs-projects.vercel.app |

---

### 배포 순서 (중요!)

**반드시 Remote 앱들을 먼저 배포한 후 Host를 배포해야 합니다.**

#### Step 1: Remote 앱들 배포

```bash
# Remote1 배포
cd remote1
vercel --prod --yes

# Remote2 배포
cd ../remote2
vercel --prod --yes

# Remote3 배포
cd ../remote3
vercel --prod --yes
```

#### Step 2: Remote 배포 URL 확인

배포 후 각 프로젝트의 기본 도메인 확인:
- `https://remote1-<your-team>.vercel.app`
- `https://remote2-<your-team>.vercel.app`
- `https://remote3-<your-team>.vercel.app`

#### Step 3: Host 환경 변수 설정

Vercel 대시보드에서 **host** 프로젝트 → **Settings** → **Environment Variables**:

| 변수명 | 값 |
|--------|-----|
| `REMOTE1_URL` | `https://remote1-<your-team>.vercel.app` |
| `REMOTE2_URL` | `https://remote2-<your-team>.vercel.app` |
| `REMOTE3_URL` | `https://remote3-<your-team>.vercel.app` |

#### Step 4: Host 배포

```bash
cd host
vercel --prod --yes
```

---

### Deployment Protection 설정 (매우 중요!)

**MFA에서는 Host가 Remote의 remoteEntry.js를 fetch해야 하므로, Remote 앱들의 Protection을 반드시 꺼야 합니다.**

#### 문제 증상
- Host 페이지가 빈 화면으로 나옴
- 콘솔에 `401 Unauthorized` 또는 `ScriptExternalLoadError` 오류

#### 해결 방법

1. **Vercel 대시보드** 접속
2. **팀 Settings** → **Deployment Protection** 이동
   - URL: `https://vercel.com/<your-team>/settings/deployment-protection`

3. **모든 Remote 프로젝트를 Unprotected로 변경**

| 프로젝트 | 설정 |
|----------|------|
| remote1 | **Unprotected** |
| remote2 | **Unprotected** |
| remote3 | **Unprotected** |
| host | Unprotected (권장) |

4. **프로젝트별 설정도 확인**
   - 각 프로젝트 → Settings → Deployment Protection
   - **Vercel Authentication** → **Disabled**
   - **Save** 클릭

5. **설정 변경 후 재배포**
```bash
cd remote1 && vercel --prod --yes
cd ../remote2 && vercel --prod --yes
cd ../remote3 && vercel --prod --yes
cd ../host && vercel --prod --yes
```

---

### vercel.json 설정

각 앱에 `vercel.json` 파일이 필요합니다.

**Remote 앱들 (remote1, remote2, remote3):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "*" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/((?!remoteEntry|.*\\.js|.*\\.css|.*\\.map).*)", "destination": "/index.html" }
  ]
}
```

**Host 앱:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/((?!.*\\.js|.*\\.css|.*\\.map|.*\\.html).*)", "destination": "/index.html" }
  ]
}
```

---

## 트러블슈팅

### 1. 로컬에서 Remote 로드 실패

**증상:** `Failed to load remote entry`

**원인:** Remote 앱이 실행되지 않음

**해결:**
```bash
# Remote 앱들이 실행 중인지 확인
curl http://localhost:5001/remoteEntry.js
curl http://localhost:5002/remoteEntry.js
curl http://localhost:5003/remoteEntry.js
```

### 2. Vercel 배포 후 401 Unauthorized

**증상:** 브라우저 콘솔에 `401` 오류

**원인:** Deployment Protection이 활성화됨

**해결:** 위의 "Deployment Protection 설정" 섹션 참고

### 3. 포트 충돌 (EADDRINUSE)

**증상:** `Error: listen EADDRINUSE: address already in use`

**원인:** 이전 프로세스가 종료되지 않음

**해결:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# 또는 모든 node 프로세스 종료
taskkill /F /IM node.exe
```

### 4. 환경 변수가 적용되지 않음

**증상:** 배포 후에도 localhost URL 사용

**원인:** Vercel 환경 변수 미설정 또는 재배포 필요

**해결:**
1. Vercel 대시보드에서 환경 변수 확인
2. 환경 변수 설정 후 반드시 재배포

---

## 라우팅

| 경로 | 페이지 | Remote |
|------|--------|--------|
| `/` | 이력서 | @resume |
| `/@blog` | 블로그 | @blog |
| `/@portfolio` | 포트폴리오 | @portfolio |
| `/@login` | 로그인 | Host 내부 |

---

## Import 경로 규칙

### 로컬 모듈
```tsx
import { store } from '@/store';
import App from '@/App';
import ErrorBoundary from '@/components/ErrorBoundary';
```

### Remote 모듈
```tsx
const ResumeApp = lazy(() => import('@resume/App'));
const BlogApp = lazy(() => import('@blog/App'));
const PortfolioApp = lazy(() => import('@portfolio/App'));
```

---

## 테스트 계정

| 이메일 | 비밀번호 | 역할 |
|--------|----------|------|
| admin@test.com | 1234 | 관리자 |

---

## 스크립트

```bash
# 개발 서버
npm start

# 프로덕션 빌드
npm run build

# 통합 테스트 (루트에서)
node integration-test.js
```

---

## 환경 변수

### 로컬 개발 (.env)
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Vercel 배포 (Host 프로젝트)
```env
REMOTE1_URL=https://remote1-<your-team>.vercel.app
REMOTE2_URL=https://remote2-<your-team>.vercel.app
REMOTE3_URL=https://remote3-<your-team>.vercel.app
```

---

## 라이선스

Private Project
