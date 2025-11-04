import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/wishlist";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchAll",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async ({ token, productId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/add`,
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { ...data, productId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Add to wishlist failed"
      );
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async ({ token, productId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/remove`,
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { ...data, productId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Remove from wishlist failed"
      );
    }
  }
);

const initialState = {
  wishlist: [],
  loading: false,
  success: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.success = false;
      state.error = null;
    },
    clearWishlist: (state) => {
      state.wishlist = [];
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload.wishlist || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const existingProduct = state.wishlist.find(
          (item) => item._id === action.payload.productId
        );
        if (!existingProduct) {
          state.wishlist.push({ _id: action.payload.productId });
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.wishlist = state.wishlist.filter(
          (item) => item._id !== action.payload.productId
        );
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetStatus, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
