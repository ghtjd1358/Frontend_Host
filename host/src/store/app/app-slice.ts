import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storage, User, ServiceType, AppState } from '@mfa/lib';

// Re-export types for backwards compatibility
export type { User, ServiceType };

// localStorage에서 초기 상태 로드
const loadInitialState = (): AppState => {
    const accessToken = storage.getAccessToken();
    const savedUser = storage.getUser<User>();

    return {
        accessToken,
        user: savedUser,
        isLoading: false,
        globalLoadingTitle: '',
        service: '1',
        selectedGnb: '',
    };
};

const initialState: AppState = loadInitialState();

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAccessToken(state, action: PayloadAction<string>) {
            state.accessToken = action.payload;
            storage.setAccessToken(action.payload);
        },
        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
            storage.setUser(action.payload);
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
        logout(state) {
            storage.clearAuth();
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