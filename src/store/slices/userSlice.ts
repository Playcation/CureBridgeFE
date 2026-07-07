import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;   
  email: string;
  role: 'admin' | 'user';  
}

const initialState: UserState = {
    name: '', // 빈 문자열로 초기화
    email: '', // 빈 문자열로 초기화
    role: 'user', // 기본적으로 'user'로 초기화
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // 로그인 시 사용자 정보를 설정하는 액션
        setUserDetails: (state, action: PayloadAction<UserState>) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
        },
        // 로그아웃 시 정보를 비우는 액션
        clearUser: (state) => {
            state.name = '';
            state.email = '';
        },
    },
});


export const { setUserDetails, clearUser } = userSlice.actions;

export default userSlice.reducer;