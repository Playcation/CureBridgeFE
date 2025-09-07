import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer:{
    auth: authReducer,
  }
});

// export default store; 기본 내보내기 위의 store로 내보내기하고있어서, 중복 예방 주석처리

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
