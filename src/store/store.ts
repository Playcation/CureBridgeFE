// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/authSlice';
// import userReducer from './slices/userSlice';

// export const store = configureStore({
//   reducer:{
//     auth: authReducer,
//     inquiry: inquiryReducer,
//     user: userReducer,
//   }
// });

// // export default store; 기본 내보내기 위의 store로 내보내기하고있어서, 중복 예방 주석처리

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


// src/app/store.ts (Redux Store 설정)

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice'; 

// 💡 Reducer는 auth만 사용합니다. 게시글 목록은 컴포넌트에서 직접 API 호출로 관리합니다.
const rootReducer = combineReducers({
    auth: authReducer, 
    // inquiry: inquiryReducer // 다른 게시판 리듀서가 있다면 여기에 추가
});

export const store = configureStore({
    reducer: rootReducer,
    // (middleware, devTools 설정은 생략)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;