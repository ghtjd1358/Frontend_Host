import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, ServiceType, AppState } from '@sonhoseong/mfa-lib';

// Re-export types for backwards compatibility
export type { User, ServiceType };

/**
 * KOMCA 패턴 - 메모리 기반 인증 상태
 * - Access Token: Redux Store (메모리)에만 저장
 * - Refresh Token: HttpOnly Cookie (서버 관리)
 * - 새로고침 시 accessToken은 초기화되고, useInitialize에서 refresh 시도
 */
const initialState: AppState = {
    accessToken: '',
    user: null,
    isLoading: false,
    globalLoadingTitle: '',
    service: '1',
    selectedGnb: '',
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        // KOMCA 패턴: Access Token은 메모리(Redux)에만 저장
        setAccessToken(state, action: PayloadAction<string>) {
            state.accessToken = action.payload;
        },
        // KOMCA 패턴: User 정보도 메모리(Redux)에만 저장
        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setGlobalLoadingTitle(state, action: PayloadAction<string>) {
            state.globalLoadingTitle = action.payload;
        },
        setService(state, action: PayloadAction<ServiceType>) {
            state.service = action.payload;
        },
        setSelectedGnb(state, action: PayloadAction<string>) {
            state.selectedGnb = action.payload;
        },
        // KOMCA 패턴: 메모리만 클리어 (Cookie는 서버 API로 삭제)
        logout(state) {
            state.accessToken = '';
            state.user = null;
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
    logout
} = appSlice.actions;

// Selectors
export const selectAccessToken = (state: { app: AppState }) => state.app.accessToken;
export const selectUser = (state: { app: AppState }) => state.app.user;
export const selectIsAuthenticated = (state: { app: AppState }) => !!state.app.accessToken;
export const selectIsLoading = (state: { app: AppState }) => state.app.isLoading;
export const selectGlobalLoadingTitle = (state: { app: AppState }) => state.app.globalLoadingTitle;
export const selectService = (state: { app: AppState }) => state.app.service;
export const selectSelectedGnb = (state: { app: AppState }) => state.app.selectedGnb;