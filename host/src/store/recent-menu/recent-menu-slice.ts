import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storage, RecentMenu as LibRecentMenu, ServiceType } from '@mfa/lib';

/**
 * 최근 메뉴 (탭) 관리 - KOMCA 패턴 적용
 */

export interface RecentMenu {
    id: string;
    pathname: string;
    search: string;
    title: string;
    service?: ServiceType;
    state?: any;
    data?: any;
}

type RecentMenuState = {
    list: RecentMenu[];
    currentId: string;
};

const loadInitialState = (): RecentMenuState => {
    const savedList = storage.getRecentMenu<RecentMenu>();
    return {
        list: savedList,
        currentId: savedList.length > 0 ? savedList[0].id : '',
    };
};

const initialState: RecentMenuState = loadInitialState();

export const recentMenuSlice = createSlice({
    name: 'recentMenu',
    initialState,
    reducers: {
        // 메뉴 추가
        addRecentMenu(state, action: PayloadAction<RecentMenu>) {
            const exists = state.list.find(m => m.id === action.payload.id);
            if (!exists) {
                state.list.push(action.payload);
                storage.setRecentMenu(state.list);
            }
            state.currentId = action.payload.id;
        },

        // 메뉴 삭제
        removeRecentMenu(state, action: PayloadAction<string>) {
            const id = action.payload || state.currentId;
            const currentIndex = state.list.findIndex(m => m.id === id);
            state.list = state.list.filter(m => m.id !== id);

            // 삭제된 메뉴가 현재 메뉴면 인접 메뉴 활성화
            if (state.currentId === id && state.list.length > 0) {
                const newIndex = Math.min(currentIndex, state.list.length - 1);
                state.currentId = state.list[newIndex]?.id || '';
            }

            storage.setRecentMenu(state.list);
        },

        // 현재 메뉴 설정
        setCurrentMenuId(state, action: PayloadAction<string>) {
            state.currentId = action.payload;
        },

        // 메뉴 데이터 업데이트
        updateMenuData(state, action: PayloadAction<{ id?: string; data: any }>) {
            const { id, data } = action.payload;
            const targetId = id || state.currentId;
            const menu = state.list.find(m => m.id === targetId);
            if (menu) {
                menu.data = data;
                storage.setRecentMenu(state.list);
            }
        },

        // 메뉴 상태 업데이트
        updateMenuState(state, action: PayloadAction<{ id?: string; state: any }>) {
            const { id, state: menuState } = action.payload;
            const targetId = id || state.currentId;
            const menu = state.list.find(m => m.id === targetId);
            if (menu) {
                menu.state = menuState;
                storage.setRecentMenu(state.list);
            }
        },

        // 메뉴 제목 업데이트
        updateMenuTitle(state, action: PayloadAction<{ id?: string; title: string }>) {
            const { id, title } = action.payload;
            const targetId = id || state.currentId;
            const menu = state.list.find(m => m.id === targetId);
            if (menu) {
                menu.title = title;
                storage.setRecentMenu(state.list);
            }
        },

        // 현재 메뉴 제외 모두 삭제
        clearOtherMenus(state) {
            const currentMenu = state.list.find(m => m.id === state.currentId);
            state.list = currentMenu ? [currentMenu] : [];
            storage.setRecentMenu(state.list);
        },

        // 전체 초기화
        resetRecentMenu(state) {
            state.list = [];
            state.currentId = '';
            storage.setRecentMenu([]);
        },
    },
});

export const {
    addRecentMenu,
    removeRecentMenu,
    setCurrentMenuId,
    updateMenuData,
    updateMenuState,
    updateMenuTitle,
    clearOtherMenus,
    resetRecentMenu,
} = recentMenuSlice.actions;

// Selectors
export const selectRecentMenuList = (state: { recentMenu: RecentMenuState }) => state.recentMenu.list;
export const selectCurrentMenuId = (state: { recentMenu: RecentMenuState }) => state.recentMenu.currentId;
export const selectCurrentMenu = (state: { recentMenu: RecentMenuState }) => {
    const { list, currentId } = state.recentMenu;
    return list.find(m => m.id === currentId) || null;
};
