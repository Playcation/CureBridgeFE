// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface AuthState {
//   isAuthenticated: boolean;
//   token: string | null;
// }

// const initialState: AuthState = {
//   isAuthenticated: false,
//   token: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     login: (state, action: PayloadAction<{ token: string; }>) => {
//       state.isAuthenticated = true;
//       state.token = action.payload.token;
//     },
//     logout: (state) => {
//       state.isAuthenticated = false;
//       state.token = null;
//     },
//   },
// });

// export const { login, logout } = authSlice.actions;
// export default authSlice.reducer;


// src/features/auth/authSlice.ts
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
  isAuthenticated: false,
  token: null,
  userId: null,
  userRole: null,
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
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userId = null;
      state.userRole = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export const selectIsAdmin = (state: any) => state.auth.userRole === 'ADMIN';

export const selectCurrentUserId = (state: any) => state.auth.userId;

export default authSlice.reducer;