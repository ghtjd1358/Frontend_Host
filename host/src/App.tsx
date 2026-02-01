/**
 * App Component - KOMCA 패턴
 * Host 앱 메인 컴포넌트
 *
 * 주요 기능:
 * - Module Federation으로 Remote 앱 통합
 * - 중앙 집중식 라우팅 관리
 * - 인증 상태 기반 UI 렌더링
 * - 글로벌 컴포넌트 (Toast, Modal, Loading)
 */

import { lazy } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RoutePath, NavPath } from '@/routes/paths';
import { selectUser, selectIsAuthenticated, logout, RootState } from '@/store';
import {
  ErrorBoundary,
  GlobalLoading,
  ToastContainer,
  ModalContainer,
} from '@sonhoseong/mfa-lib';
import RemoteWrapper from '@/components/RemoteWrapper';
import AuthGuard from '@/components/AuthGuard';
import { useAuthListener, useOnlineStatus } from '@/hooks';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import '@/styles/App.css';

// Remote 앱들 lazy 로드
const ResumeApp = lazy(() => import('@resume/App'));
const BlogApp = lazy(() => import('@blog/App'));
const PortfolioApp = lazy(() => import('@portfolio/App'));

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state: RootState) => selectUser(state));
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));
  const isOnline = useOnlineStatus();

  // Firebase 인증 상태 리스너 (토큰 자동 갱신)
  useAuthListener();

  const isLoginPage = location.pathname === NavPath.Login;
  const isAdminPage = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ErrorBoundary>
      {/* Global Components - KOMCA 패턴 */}
      <ToastContainer position="top-right" />
      <ModalContainer />
      <GlobalLoading />

      {/* 오프라인 상태 알림 */}
      {!isOnline && (
        <div className="offline-banner" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.58 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
          </svg>
          오프라인 상태입니다. 인터넷 연결을 확인해주세요.
        </div>
      )}

      <div className="app-container">
        {/* Top Navigation - 로그인 페이지에서는 숨김 */}
        {!isLoginPage && (
          <nav className="nav" role="navigation" aria-label="메인 네비게이션">
            <div className="nav-logo">
              {/* ㅅ */}
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" aria-hidden="true">
                <path d="M 8 40 L 24 8 L 40 40" stroke="#1E3A5F" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              {/* ㅎ */}
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32" aria-hidden="true">
                <rect x="20" y="2" width="8" height="16" rx="4" fill="#1E3A5F"/>
                <rect x="6" y="16" width="36" height="6" rx="3" fill="#1E3A5F"/>
                <ellipse cx="24" cy="36" rx="18" ry="12" fill="#1E3A5F"/>
                <ellipse cx="17" cy="36" rx="4" ry="6" fill="#FFFFFF"/>
                <ellipse cx="31" cy="36" rx="4" ry="6" fill="#FFFFFF"/>
              </svg>
              {/* ㅅ */}
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" aria-hidden="true">
                <path d="M 8 40 L 24 8 L 40 40" stroke="#1E3A5F" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <div className="nav-links">
              <NavLink to={NavPath.Home} end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                이력서
              </NavLink>
              <NavLink to={NavPath.Blog} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                블로그
              </NavLink>
              <NavLink to={NavPath.Portfolio} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                포트폴리오
              </NavLink>

              {/* 로그인/로그아웃 */}
              {!isAuthenticated ? (
                <NavLink to={NavPath.Login} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  로그인
                </NavLink>
              ) : (
                <>
                  <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    관리
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="nav-link"
                    type="button"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    로그아웃 ({user?.name})
                  </button>
                </>
              )}
            </div>
          </nav>
        )}

        {/* Main Content */}
        <main
          id="main-content"
          className={
            isLoginPage ? 'main-content main-content--no-nav' :
            isAdminPage ? 'main-content main-content--admin' :
            'main-content'
          }
        >
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

            {/* 로그인 */}
            <Route path={RoutePath.Login} element={<Login />} />

            {/* 404 */}
            <Route path={RoutePath.NotFound} element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
