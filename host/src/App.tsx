/**
 * App Component - KOMCA 패턴
 * Host 앱 메인 컴포넌트
 *
 * 주요 기능:
 * - Module Federation으로 Remote 앱 통합
 * - 중앙 집중식 라우팅 관리
 * - 인증 상태 기반 UI 렌더링
 * - 글로벌 컴포넌트 (Toast, Modal, Loading)
 * - Lnb 사이드바 + Header 레이아웃
 */

import { lazy, useMemo } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RoutePath, NavPath } from '@/routes/paths';
import { selectIsAuthenticated, RootState } from '@/store';
import {
  ErrorBoundary,
  GlobalLoading,
  ToastContainer,
  ModalContainer,
  Lnb,
  Header,
  Container,
  Logo,
} from '@sonhoseong/mfa-lib';
import RemoteWrapper from '@/components/RemoteWrapper';
import AuthGuard from '@/components/AuthGuard';
import { useInitialize, useOnlineStatus } from '@/hooks';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import '@/styles/App.css';

// Remote 앱들 lazy 로드
const ResumeApp = lazy(() => import('@resume/App'));
const BlogApp = lazy(() => import('@blog/App'));
const PortfolioApp = lazy(() => import('@portfolio/App'));

// 메뉴 아이템 정의 - Guest용
const guestMenuItems = [
  { id: 'resume', title: '이력서', path: '/', icon: '📄' },
  { id: 'blog', title: '블로그', path: '/blog', icon: '✍️' },
  { id: 'portfolio', title: '포트폴리오', path: '/portfolio', icon: '💼' },
  { id: 'login', title: '로그인', path: '/login', icon: '🔑' },
];

// 메뉴 아이템 정의 - Auth용
const authMenuItems = [
  { id: 'resume', title: '이력서', path: '/', icon: '📄' },
  { id: 'blog', title: '블로그', path: '/blog', icon: '✍️' },
  { id: 'portfolio', title: '포트폴리오', path: '/portfolio', icon: '💼' },
  {
    id: 'admin',
    title: '관리',
    icon: '⚙️',
    children: [
      { id: 'admin-skills', title: '스킬 관리', path: '/admin/skills' },
      { id: 'admin-experience', title: '경력 관리', path: '/admin/experience' },
      { id: 'admin-projects', title: '프로젝트 관리', path: '/admin/projects' },
    ],
  },
];

// GNB 아이템 (Header용)
const gnbItems = [
  { id: 'resume', title: '이력서', path: '/' },
  { id: 'blog', title: '블로그', path: '/blog' },
  { id: 'portfolio', title: '포트폴리오', path: '/portfolio' },
];

const App = () => {
  const location = useLocation();
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));
  const isOnline = useOnlineStatus();

  // KOMCA 패턴: 앱 시작 시 Refresh Token으로 Access Token 갱신 시도
  const { isInitialized } = useInitialize();

  // 메뉴 아이템 (인증 상태에 따라) - hooks는 조건부 return 전에 호출해야 함
  const lnbItems = useMemo(() => {
    return isAuthenticated ? authMenuItems : guestMenuItems;
  }, [isAuthenticated]);

  const isLoginPage = location.pathname === NavPath.Login;

  // 초기화 중에는 로딩 표시
  if (!isInitialized) {
    return (
      <div className="app-initializing">
        <div className="app-initializing-spinner" />
        <p>로딩 중...</p>
      </div>
    );
  }

  // 로그인 페이지는 레이아웃 없이 렌더링
  if (isLoginPage) {
    return (
      <ErrorBoundary>
        <ToastContainer position="top-right" />
        <ModalContainer />
        <Login />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      {/* Global Components - KOMCA 패턴 */}
      <ToastContainer position="top-right" />
      <ModalContainer />

      {/* 오프라인 상태 알림 */}
      {!isOnline && (
        <div className="offline-banner" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.58 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
          </svg>
          오프라인 상태입니다. 인터넷 연결을 확인해주세요.
        </div>
      )}

      <Container>
        {/* Lnb 사이드바 */}
        <Lnb lnbItems={lnbItems} logo={<Logo customSize={36} />} />

        {/* Main Content */}
        <main className="main-content">
          {/* Header */}
          <Header gnbItems={gnbItems} logo={<Logo customSize={32} />} />

          <Routes>
            {/* 이력서 - 기본 페이지 */}
            <Route
              path={RoutePath.Home}
              element={
                <RemoteWrapper name="이력서">
                  <ResumeApp />
                </RemoteWrapper>
              }
            />

            {/* 블로그 */}
            <Route
              path={RoutePath.Blog}
              element={
                <RemoteWrapper name="블로그">
                  <BlogApp />
                </RemoteWrapper>
              }
            />

            {/* 포트폴리오 */}
            <Route
              path={RoutePath.Portfolio}
              element={
                <RemoteWrapper name="포트폴리오">
                  <PortfolioApp />
                </RemoteWrapper>
              }
            />

            {/* Admin - 인증 필요 */}
            <Route
              path="/admin/*"
              element={
                <AuthGuard>
                  <RemoteWrapper name="관리자">
                    <ResumeApp />
                  </RemoteWrapper>
                </AuthGuard>
              }
            />

            {/* 404 */}
            <Route path={RoutePath.NotFound} element={<NotFound />} />
          </Routes>

          <GlobalLoading />
        </main>
      </Container>
    </ErrorBoundary>
  );
};

export default App;
