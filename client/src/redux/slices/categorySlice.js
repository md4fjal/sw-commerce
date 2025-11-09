import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/category";

export const fetchCategories = createAsyncThunk(
  "category/fetchAll",
  async (
    {
      search = "",
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
      parent = null,
    },
    { rejectWithValue }
  ) => {
    try {
      let url = `${API_URL}?search=${search}&sortBy=${sortBy}&order=${order}&page=${page}&limit=${limit}`;
      if (parent !== null) {
        url += `&parent=${parent}`;
      }
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

export const getCategoryById = createAsyncThunk(
  "category/fetchById",
  async ({ id }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Category not found"
      );
    }
  }
);

export const getCategoryBySlug = createAsyncThunk(
  "category/fetchBySlug",
  async ({ slug }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/slug/${slug}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Category not found"
      );
    }
  }
);

export const addCategory = createAsyncThunk(
  "category/add",
  async ({ token, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Add Category failed"
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ id, token, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Category update failed"
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/delete",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { id, message: data?.message || "Category deleted successfully" };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Category delete failed"
      );
    }
  }
);

const initialState = {
  categories: [],
  category: null,
  total: 0,
  page: 1,
  pages: 1,
  search: "",
  sortBy: "createdAt",
  order: "desc",
  limit: 10,
  parent: null,
  loading: false,
  categoryLoading: false,
  success: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
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
    setParent: (state, action) => {
      state.parent = action.payload;
    },
    resetStatus: (state) => {
      state.success = false;
      state.error = null;
    },
    clearCategory: (state) => {
      state.category = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get by ID
      .addCase(getCategoryById.pending, (state) => {
        state.categoryLoading = true;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.category = action.payload.category;
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.categoryLoading = false;
        state.error = action.payload;
      })

      // Get by Slug
      .addCase(getCategoryBySlug.fulfilled, (state, action) => {
        state.category = action.payload.category;
      })

      // Add
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.categories.unshift(action.payload.category);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updated = action.payload.category;
        state.categories = state.categories.map((c) =>
          c._id === updated._id ? updated : c
        );
        if (state.category && state.category._id === updated._id) {
          state.category = updated;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.categories = state.categories.filter(
          (c) => c._id !== action.payload.id
        );
        if (state.category && state.category._id === action.payload.id) {
          state.category = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearch,
  setPage,
  setSort,
  setParent,
  resetStatus,
  clearCategory,
} = categorySlice.actions;
export default categorySlice.reducer;
