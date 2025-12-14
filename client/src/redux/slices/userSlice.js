import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../main";

const initialState = {
  users: [],
  user: null,
  total: 0,
  page: 1,
  pages: 1,
  search: "",
  sortBy: "createdAt",
  order: "desc",
  limit: 10,
  loading: false,
  success: false,
  error: null,
};

export const getAllUsers = createAsyncThunk(
  "user/getAll",
  async (
    {
      token,
      search = "",
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.get(
        `${server}/user?search=${search}&sortBy=${sortBy}&order=${order}&page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const getUserById = createAsyncThunk(
  "user/getById",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${server}/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "User not found");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/delete",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${server}/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { id, message: res.data.message };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${server}/user/profile`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

export const toggleRole = createAsyncThunk(
  "user/toggleRole",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${server}/user/toggle-role`,
        { id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle role"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSort: (state, action) => {
      state.sortBy = action.payload.sortBy;
      state.order = action.payload.order;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.users = action.payload.users;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(getUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.success = true;
        state.users = state.users.filter((u) => u._id !== action.payload.id);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.success = true;
        state.user = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(toggleRole.fulfilled, (state, action) => {
        state.success = true;
        const updatedUser = action.payload;
        state.users = state.users.map((u) =>
          u._id === updatedUser._id ? updatedUser : u
        );
      })
      .addCase(toggleRole.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setSearch, setSort, setPage } = userSlice.actions;
export default userSlice.reducer;
