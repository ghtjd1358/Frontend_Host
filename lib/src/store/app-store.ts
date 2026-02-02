/**
 * App Store
 *
 * Host/Remote 모두에서 사용할 수 있는 Store 설정
 * - Host: 자체 store 생성 후 window.__REDUX_STORE__에 노출
 * - Remote (standalone): 자체 store 생성
 * - Remote (in Host): window.__REDUX_STORE__ 사용
 */

import { configureStore, combineReducers, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { storage } from '../utils/storage';
import { User, AppState } from '../types';

// ============================================
// App Slice (인증 상태 관리)
// ============================================

const initialAppState: AppState = {
    accessToken: '',
    user: null,
    isLoading: false,
    globalLoadingTitle: '',
    service: '',
    selectedGnb: '',
};

export const appSlice = createSlice({
    name: 'app',
    initialState: initialAppState,
    reducers: {
        // Access Token은 메모리(Redux)에만 저장
        // 새로고침 시 Refresh Token(HttpOnly Cookie)으로 재발급
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        // User 정보도 메모리(Redux)에만 저장
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setGlobalLoadingTitle: (state, action: PayloadAction<string>) => {
            state.globalLoadingTitle = action.payload;
        },
        setService: (state, action: PayloadAction<string>) => {
            state.service = action.payload;
        },
        setSelectedGnb: (state, action: PayloadAction<string>) => {
            state.selectedGnb = action.payload;
        },
        logout: (state) => {
            state.accessToken = '';
            state.user = null;
            storage.clearAuth();
        },
    },
});

export const {
    setAccessToken,
    setUser,
    setLoading,
    setGlobalLoadingTitle,
    setService,
    setSelectedGnb,
    logout,
} = appSlice.actions;

// Selectors
export const selectAccessToken = (state: { app: AppState }) => state.app.accessToken;
export const selectUser = (state: { app: AppState }) => state.app.user;
export const selectIsLoading = (state: { app: AppState }) => state.app.isLoading;
export const selectIsAuthenticated = (state: { app: AppState }) => !!state.app.accessToken;

// ============================================
// Store 생성
// ============================================

// 동적 Reducer 저장소
let dynamicReducers: Record<string, Reducer> = {};

// 기본 Reducer
const staticReducers = {
    app: appSlice.reducer,
};

// Root Reducer 생성
const createRootReducer = () => combineReducers({
    ...staticReducers,
    ...dynamicReducers,
});

/**
 * Store 인스턴스 - KOMCA 패턴
 * 앱 전체에서 하나의 store 사용
 */
export const store = configureStore({
    reducer: createRootReducer(),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Store 인스턴스 (단독 실행용) - 호환성 유지
let storeInstance: ReturnType<typeof configureStore> | null = store;

/**
 * App Store 생성
 * Host 또는 Remote 단독 실행 시 호출
 * @deprecated store 인스턴스를 직접 사용하세요
 */
export const createAppStore = () => {
    return store;
};

/**
 * Store 가져오기
 * - Host App: 자신의 store 반환
 * - Remote (standalone): 자신의 store 반환
 * - Remote (in Host): window.__REDUX_STORE__ 반환
 */
export const getStore = () => {
    // Host App인 경우 window.__REDUX_STORE__ 사용
    if (storage.isHostApp() && window.__REDUX_STORE__) {
        return window.__REDUX_STORE__;
    }

    // Remote가 Host 내에서 실행중인 경우
    if (window.__REDUX_STORE__) {
        return window.__REDUX_STORE__;
    }

    // 단독 실행 (store가 이미 생성되어 있으면 반환)
    if (storeInstance) {
        return storeInstance;
    }

    // 아직 store가 없으면 생성
    return createAppStore();
};

/**
 * 동적 Reducer 주입
 */
export const injectReducer = (key: string, reducer: Reducer) => {
    if (dynamicReducers[key]) {
        return;
    }
    dynamicReducers[key] = reducer;

    const store = getStore();
    if (store && 'replaceReducer' in store) {
        (store as any).replaceReducer(createRootReducer());
    }
};

/**
 * Store를 전역에 노출 (Host App용)
 */
export const exposeStore = (store: ReturnType<typeof configureStore>) => {
    storage.setHostApp();
    window.__REDUX_STORE__ = store as any;
};

// 타입 export
export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
