/**
 * App - Host Container (단순화)
 */
import { Suspense } from 'react';
import { useSelector } from 'react-redux';
import {
    store,
    exposeStore,
    selectIsAuthenticated,
    useSupabaseInitialize,
    initSupabaseFromEnv,
    ErrorBoundary,
    ToastContainer,
    ModalContainer,
    Container,
    Lnb,
    Logo,
    GlobalLoading,
} from '@sonhoseong/mfa-lib';

// Supabase 초기화
initSupabaseFromEnv();
import { RoutesGuestPages, RoutesAuthPages } from './pages/routes';
import { lnbItems } from './lnb-items';
import './App.css';

// Store를 전역에 노출
exposeStore(store);

const App = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const { initialized } = useSupabaseInitialize();

    if (!initialized) {
        return null;
    }

    // 비로그인: 로그인 페이지만
    if (!isAuthenticated) {
        return (
            <>
                <ModalContainer />
                <ToastContainer position="top-right" />
                <RoutesGuestPages />
                <GlobalLoading />
            </>
        );
    }

    // 로그인: Lnb + 콘텐츠
    return (
        <>
            <ModalContainer />
            <ToastContainer position="top-right" />
            <Container>
                <ErrorBoundary>
                    <Lnb lnbItems={lnbItems} logo={<Logo customSize={36} />} />
                    <main className="main-content">
                        <Suspense fallback={""}>
                            <RoutesAuthPages />
                        </Suspense>
                    </main>
                    <GlobalLoading />
                </ErrorBoundary>
            </Container>
        </>
    );
};

export default App;
