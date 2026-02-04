/**
 * Platform Layout - KOMCA 패턴
 * Remote에서 LnbItems를 가져와서 조합
 */
import React, { lazy, Suspense, useMemo, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    selectIsAuthenticated,
    Container,
    Lnb,
    Logo,
    GlobalLoading,
    LnbMenuItem,
} from '@sonhoseong/mfa-lib';
import { RoutePath, platformPrefix } from '../routes/paths';

// Remote 앱 lazy 로드
const ResumeApp = lazy(() => import('@resume/App'));
const BlogApp = lazy(() => import('@blog/App'));

// 로딩 UI
const Loading = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: 24, height: 24, border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
);

// 대시보드 페이지
const Dashboard = () => (
    <div style={{ padding: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>대시보드</h1>
        <p style={{ color: '#64748b' }}>포트폴리오 플랫폼에 오신 것을 환영합니다.</p>
    </div>
);

// 404 페이지
const NotFound = () => (
    <div style={{ textAlign: 'center', padding: 48 }}>
        <h1>404</h1>
        <p>페이지를 찾을 수 없습니다.</p>
    </div>
);

// 대시보드 아이콘
const dashboardIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
    </svg>
);

// LnbItems 타입
interface RemoteLnbItems {
    hasPrefixList: LnbMenuItem[];
    hasPrefixAuthList?: LnbMenuItem[];
}

function Platform() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const [resumeLnbItems, setResumeLnbItems] = useState<RemoteLnbItems | null>(null);
    const [blogLnbItems, setBlogLnbItems] = useState<RemoteLnbItems | null>(null);

    // Remote LnbItems 동적 로드
    useEffect(() => {
        const loadLnbItems = async () => {
            try {
                // @ts-ignore
                const resumeModule = await import('@resume/LnbItems');
                setResumeLnbItems(resumeModule.lnbItems || resumeModule.default);
            } catch (e) {
                console.warn('Failed to load resume LnbItems:', e);
            }

            try {
                // @ts-ignore
                const blogModule = await import('@blog/LnbItems');
                setBlogLnbItems(blogModule.lnbItems || blogModule.default);
            } catch (e) {
                console.warn('Failed to load blog LnbItems:', e);
            }
        };

        loadLnbItems();
    }, []);

    // KOMCA 패턴: lnbItems 조합
    const lnbItems = useMemo(() => {
        const dashboardItem: LnbMenuItem = {
            id: 'dashboard',
            title: '대시보드',
            path: `${platformPrefix}${RoutePath.Dashboard}`,
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
    }, [isAuthenticated, resumeLnbItems, blogLnbItems]);

    return (
        <Container>
            <Lnb lnbItems={lnbItems} logo={<Logo customSize={36} />} />
            <main className="main-content">
                <Routes>
                    <Route index element={<Navigate to={`${platformPrefix}${RoutePath.Dashboard}`} replace />} />
                    <Route path={`${platformPrefix}${RoutePath.Dashboard}`} element={<Dashboard />} />
                    <Route path={`${platformPrefix}${RoutePath.Resume}/*`} element={<Suspense fallback={<Loading />}><ResumeApp /></Suspense>} />
                    <Route path={`${platformPrefix}${RoutePath.Blog}/*`} element={<Suspense fallback={<Loading />}><BlogApp /></Suspense>} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <GlobalLoading />
            </main>
        </Container>
    );
}

export default Platform;
