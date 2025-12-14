import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../main";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchAll",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/wishlist/`, {
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
        `${server}/wishlist/add`,
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
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
      const { data } = await axios.delete(`${server}/wishlist/remove`, {
        data: { productId },
        headers: { Authorization: `Bearer ${token}` },
      });
      return { ...data, productId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Remove from wishlist failed"
      );
    }
  }
);

export const toggleWishlistItem = createAsyncThunk(
  "wishlist/toggle",
  async ({ token, productId }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const isInWishlist = state.wishlist.wishlist.some(
        (item) => item._id === productId
      );

      if (isInWishlist) {
        const { data } = await axios.delete(`${server}/wishlist/remove`, {
          data: { productId },
          headers: { Authorization: `Bearer ${token}` },
        });
        return { ...data, productId, action: "remove" };
      } else {
        const { data } = await axios.post(
          `${server}/wishlist/add`,
          { productId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return { ...data, productId, action: "add" };
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Wishlist operation failed"
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
    addItemInstantly: (state, action) => {
      const product = action.payload;
      const existingItem = state.wishlist.find(
        (item) => item._id === product._id
      );
      if (!existingItem) {
        state.wishlist.push(product);
      }
    },
    removeItemInstantly: (state, action) => {
      const productId = action.payload;
      state.wishlist = state.wishlist.filter((item) => item._id !== productId);
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
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.wishlist = state.wishlist.filter(
          (item) => item._id !== action.payload.productId
        );
        state.error = null;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(toggleWishlistItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        if (action.payload.action === "remove") {
          state.wishlist = state.wishlist.filter(
            (item) => item._id !== action.payload.productId
          );
        }
        state.error = null;
      })
      .addCase(toggleWishlistItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const {
  resetStatus,
  clearWishlist,
  addItemInstantly,
  removeItemInstantly,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
