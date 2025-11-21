import { RootState } from '../store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRole, AuthPayload } from '../../types/auth';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userId: number | null;
  userRole: UserRole | null;
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('Authorization'),
  token: localStorage.getItem('Authorization'),
  userId: localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : null,
  userRole: localStorage.getItem('userRole') as UserRole | null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthPayload>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.userRole = action.payload.userRole;

      localStorage.setItem('Authorization', action.payload.token);
      localStorage.setItem('userId', action.payload.userId.toString());
      localStorage.setItem('userRole', action.payload.userRole);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userId = null;
      state.userRole = null;

      localStorage.removeItem('Authorization');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
    },
  },
});

export const { login, logout } = authSlice.actions;

export const selectIsAdmin = (state: any) => state.auth.userRole === 'ADMIN';
export const selectCurrentUserId = (state: any) => state.auth.userId;

export default authSlice.reducer;
