import { configureStore, combineReducers, Reducer } from '@reduxjs/toolkit';
import { appSlice } from './app';
import { recentMenuSlice } from './recent-menu';
import { menuSlice } from './menu';
import { storage } from '@sonhoseong/mfa-lib';

/**
 * Redux Store - KOMCA 패턴 적용
 * - 동적 Reducer 주입 지원
 * - 마이크로프론트엔드 Store 공유
 */

// 정적 Reducer 정의
const staticReducers = {
    app: appSlice.reducer,
    recentMenu: recentMenuSlice.reducer,
    menu: menuSlice.reducer,
};

// 동적 Reducer 저장소
const dynamicReducers: Record<string, Reducer> = {};

// Root Reducer 생성
const createRootReducer = () => combineReducers({
    ...staticReducers,
    ...dynamicReducers,
});

// Store 생성
export const store = configureStore({
    reducer: createRootReducer(),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// 호스트 앱 판별 및 전역 Store 노출
const isHostApp = () => {
    // 개발 환경: 포트로 판별 (Host는 5000번 포트)
    if (process.env.NODE_ENV === 'development') {
        return window.location.port === '5000';
    }
    // 프로덕션: sessionStorage로 판별
    return storage.isHostApp();
};

// 마이크로프론트엔드 지원: 호스트 앱의 Store를 전역에 노출
if (isHostApp()) {
    storage.setHostApp();
    window.__REDUX_STORE__ = store;
}

// Store 가져오기 (호스트/리모트 자동 판별)
export const getStore = () => {
    if (isHostApp()) {
        return store;
    }
    return window.__REDUX_STORE__ || store;
};

/**
 * 동적으로 Reducer 주입
 * Remote 앱에서 자체 Reducer를 추가할 때 사용
 */
export const injectReducer = (key: string, reducer: Reducer) => {
    if (dynamicReducers[key]) {
        return; // 이미 존재하면 무시
    }
    dynamicReducers[key] = reducer;
    store.replaceReducer(createRootReducer());
};

/**
 * 동적 Reducer 제거
 */
export const removeReducer = (key: string) => {
    if (!dynamicReducers[key]) {
        return;
    }
    delete dynamicReducers[key];
    store.replaceReducer(createRootReducer());
};

// Window.__REDUX_STORE__ 타입은 @sonhoseong/mfa-lib에서 선언됨

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-exports
export * from './app';
export * from './recent-menu';
export * from './menu';