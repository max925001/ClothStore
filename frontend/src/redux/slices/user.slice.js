import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../helpers/axiosInstance';

const initialState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true' || false,
  data: JSON.parse(localStorage.getItem('data')) || {},
  role: localStorage.getItem('role') || '',
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

export const createAccount = createAsyncThunk('/auth/signup', async (data, { rejectWithValue }) => {
  try {
    const res = axiosInstance.post('user/register', data);
    toast.promise(res, {
      loading: 'Creating your account...',
      success: (response) => response?.data?.message || 'Account created successfully',
      error: (error) => error?.response?.data?.message || 'Failed to create account',
    });
    return (await res).data;
  } catch (error) {
    return rejectWithValue(error?.response?.data);
  }
});

export const login = createAsyncThunk('/auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = axiosInstance.post('user/login', data);
    toast.promise(res, {
      loading: 'Authenticating...',
      success: (response) => response?.data?.message || 'Logged in successfully',
      error: (error) => error?.response?.data?.message || 'Failed to log in',
    });
    return (await res).data;
  } catch (error) {
    return rejectWithValue(error?.response?.data);
  }
});

export const logout = createAsyncThunk('/auth/logout', async (_, { rejectWithValue }) => {
  try {
    const res = axiosInstance.post('user/logout');
    toast.promise(res, {
      loading: 'Logging out...',
      success: (response) => response?.data?.message || 'Logged out successfully',
      error: (error) => error?.response?.data?.message || 'Failed to log out',
    });
    return (await res).data;
  } catch (error) {
    return rejectWithValue(error?.response?.data);
  }
});

export const getUserData = createAsyncThunk('/user/details', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('user/getuserdetails');
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to fetch user data');
    return rejectWithValue(error?.response?.data);
  }
});

export const updateUser = createAsyncThunk('/user/update', async (formData, { rejectWithValue }) => {
  try {
    const res = axiosInstance.put('user/updateuserdetails', formData);
    toast.promise(res, {
      loading: 'Updating profile...',
      success: (response) => response?.data?.message || 'Profile updated successfully',
      error: (error) => error?.response?.data?.message || 'Failed to update profile',
    });
    return (await res).data;
  } catch (error) {
    return rejectWithValue(error?.response?.data);
  }
});

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAccount.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action?.payload?.user) {
          localStorage.setItem('data', JSON.stringify(action.payload.user));
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('role', action.payload.user.role || 'USER');
          state.isLoggedIn = true;
          state.data = action.payload.user;
          state.role = action.payload.user.role || 'USER';
        } else {
          localStorage.removeItem('data');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('role');
          state.isLoggedIn = false;
          state.data = {};
          state.role = '';
        }
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to create account';
        localStorage.removeItem('data');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        state.isLoggedIn = false;
        state.data = {};
        state.role = '';
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload?.user) {
          localStorage.setItem('data', JSON.stringify(action.payload.user));
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('role', action.payload.user.role || 'USER');
          state.isLoggedIn = true;
          state.data = action.payload.user;
          state.role = action.payload.user.role || 'USER';
        } else {
          localStorage.removeItem('data');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('role');
          state.isLoggedIn = false;
          state.data = {};
          state.role = '';
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to log in';
        localStorage.removeItem('data');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        state.isLoggedIn = false;
        state.data = {};
        state.role = '';
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'succeeded';
        localStorage.clear();
        state.isLoggedIn = false;
        state.data = {};
        state.role = '';
      })
      .addCase(logout.rejected, (state) => {
        state.status = 'failed';
        state.error = 'Failed to log out';
        localStorage.clear();
        state.isLoggedIn = false;
        state.data = {};
        state.role = '';
      })
      .addCase(getUserData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload?.user) {
          localStorage.setItem('data', JSON.stringify(action.payload.user));
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('role', action.payload.user.role || 'USER');
          state.isLoggedIn = true;
          state.data = action.payload.user;
          state.role = action.payload.user.role || 'USER';
        } else {
          localStorage.removeItem('data');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('role');
          state.isLoggedIn = false;
          state.data = {};
          state.role = '';
        }
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch user data';
        localStorage.removeItem('data');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        state.isLoggedIn = false;
        state.data = {};
        state.role = '';
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload?.user) {
          localStorage.setItem('data', JSON.stringify(action.payload.user));
          state.data = action.payload.user;
          state.role = action.payload.user.role || 'USER';
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to update profile';
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;