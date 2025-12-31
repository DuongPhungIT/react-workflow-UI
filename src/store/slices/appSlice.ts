// App slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AsyncState } from '@/types';

interface AppState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  notifications: AsyncState<unknown[]>;
  userPreferences: Record<string, unknown>;
}

const initialState: AppState = {
  theme: 'system',
  sidebarOpen: true,
  notifications: {
    data: null,
    loading: 'idle',
    error: null,
  },
  userPreferences: {},
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setUserPreferences: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.userPreferences = { ...state.userPreferences, ...action.payload };
    },
    setNotificationsLoading: (state, action: PayloadAction<'idle' | 'loading' | 'succeeded' | 'failed'>) => {
      state.notifications.loading = action.payload;
    },
    setNotifications: (state, action: PayloadAction<unknown[]>) => {
      state.notifications.data = action.payload;
      state.notifications.loading = 'succeeded';
      state.notifications.error = null;
    },
    setNotificationsError: (state, action: PayloadAction<string>) => {
      state.notifications.error = action.payload;
      state.notifications.loading = 'failed';
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setUserPreferences,
  setNotificationsLoading,
  setNotifications,
  setNotificationsError,
} = appSlice.actions;

export default appSlice.reducer;


