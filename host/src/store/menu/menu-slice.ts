/**
 * Menu Slice - KOMCA 패턴
 * 메뉴 목록 관리
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem } from '@sonhoseong/mfa-lib';

interface MenuState {
  menuList: MenuItem[];
  selectedMenuId: string;
}

const initialState: MenuState = {
  menuList: [],
  selectedMenuId: '',
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuList(state, action: PayloadAction<MenuItem[]>) {
      state.menuList = action.payload;
    },
    setSelectedMenuId(state, action: PayloadAction<string>) {
      state.selectedMenuId = action.payload;
    },
    clearMenu(state) {
      state.menuList = [];
      state.selectedMenuId = '';
    },
  },
});

export const {
  setMenuList,
  setSelectedMenuId,
  clearMenu,
} = menuSlice.actions;

// Selectors
export const selectMenuList = (state: { menu: MenuState }) => state.menu.menuList;
export const selectSelectedMenuId = (state: { menu: MenuState }) => state.menu.selectedMenuId;
