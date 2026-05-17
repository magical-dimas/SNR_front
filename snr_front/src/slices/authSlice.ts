import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  login: string;
  role: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuth: boolean;
}

const storedToken = localStorage.getItem('jwt');

const initialState: AuthState = {
  user: null,
  token: storedToken && storedToken !== 'undefined' ? storedToken : null,
  isAuth: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuth = true;
      localStorage.setItem('jwt', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuth = false;
      localStorage.removeItem('jwt');
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;