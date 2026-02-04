/**
 * App - Host Container (KOMCA 패턴)
 * App에서 레이아웃(Container+Lnb) 구성, Routes 파일에서 라우팅 처리
 */
import { Suspense, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    store,
    exposeStore,
    selectIsAuthenticated,
    useSimpleInitialize,
    ErrorBoundary,
    ToastContainer,
    ModalContainer,
    Container,
    Lnb,
    Logo,
    GlobalLoading,
    LnbMenuItem,
} from '@sonhoseong/mfa-lib';
import { RoutesGuestPages, RoutesAuthPages } from './pages/routes';
import './App.css';

// Store를 전역에 노출
exposeStore(store);

// KOMCA 패턴: Top-level await로 Remote LnbItems 로드
// @ts-ignore
const { lnbItems: resumeLnbItems }: { lnbItems: { hasPrefixList: LnbMenuItem[]; hasPrefixAuthList?: LnbMenuItem[]; } } = await import('@resume/LnbItems');
// @ts-ignore
const { lnbItems: blogLnbItems }: { lnbItems: { hasPrefixList: LnbMenuItem[]; hasPrefixAuthList?: LnbMenuItem[]; } } = await import('@blog/LnbItems');

// 대시보드 아이콘
const dashboardIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
    </svg>
);

// 로딩 UI
const Loading = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: 24, height: 24, border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
);

const App = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const { initialized } = useSimpleInitialize();

    // KOMCA 패턴: LnbItems 조합
    const lnbItems = useMemo(() => {
        const dashboardItem: LnbMenuItem = {
            id: 'dashboard',
            title: '대시보드',
            path: '/platform/dashboard',
            icon: dashboardIcon,
        };

        if (isAuthenticated) {
            return [
                dashboardItem,
                ...(resumeLnbItems?.hasPrefixAuthList ?? resumeLnbItems?.hasPrefixList ?? []),
                ...(blogLnbItems?.hasPrefixAuthList ?? blogLnbItems?.hasPrefixList ?? []),
            ];
        }

        return [
            dashboardItem,
            ...(resumeLnbItems?.hasPrefixList ?? []),
            ...(blogLnbItems?.hasPrefixList ?? []),
        ];
    }, [isAuthenticated]);

    // 초기화 완료 전 빈 화면
    if (!initialized) {
        return null;
    }

    return (
      <>
      <ModalContainer />
      <ToastContainer position="top-right" />
      <Container>
          <ErrorBoundary>
              <Lnb lnbItems={lnbItems} logo={<Logo customSize={36} />} />
              <main className="main-content">
                  <Suspense fallback={""}>
                      {!isAuthenticated && <RoutesGuestPages />}
                      {isAuthenticated && <RoutesAuthPages />}
                  </Suspense>
              </main>
                  <GlobalLoading />
          </ErrorBoundary>
      </Container>
      </>
    );
};

export default App;
