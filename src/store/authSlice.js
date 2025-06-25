import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const FIREBASE_API_KEY = 'AIzaSyB2-ocPCdM06nzOf8lvaKo3o4VG5SrBs3k';

const SIGNIN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(SIGNIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error?.message || 'Login failed');

      // Store refresh token in sessionStorage (not localStorage)
      sessionStorage.setItem('refreshToken', data.refreshToken);

      return {
        uid: data.localId,
        email: data.email,
        idToken: data.idToken,
        refreshToken: data.refreshToken,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔐 Refresh ID Token using refresh token from sessionStorage
export const refreshIdToken = createAsyncThunk(
  'auth/refreshToken',
  async (refreshToken, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Token refresh failed');

      // Update sessionStorage with new refresh token
      sessionStorage.setItem('refreshToken', data.refresh_token);

      return {
        uid: data.user_id,
        email: data.user_email,
        idToken: data.id_token,
        refreshToken: data.refresh_token,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🚪 Logout: clears session and Redux state
export const logout = createAsyncThunk('auth/logout', async () => {
  sessionStorage.removeItem('refreshToken');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    idToken: null,
    refreshToken: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = { uid: action.payload.uid, email: action.payload.email };
        state.idToken = action.payload.idToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.idToken = null;
        state.refreshToken = null;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(refreshIdToken.fulfilled, (state, action) => {
        state.user = { uid: action.payload.uid, email: action.payload.email };
        state.idToken = action.payload.idToken;
        state.refreshToken = action.payload.refreshToken;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
