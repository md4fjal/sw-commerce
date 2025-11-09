import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/cart";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ token, productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/add`,
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add item to cart"
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ token, productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/update`,
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update cart item"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ token, productId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/remove`,
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { ...data, productId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove item from cart"
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${API_URL}/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

const initialState = {
  cart: [],
  subtotal: 0,
  taxAmount: 0,
  shippingFee: 0,
  totalAmount: 0,
  totalQuantity: 0,
  loading: false,
  success: false,
  error: null,
};

const calculateCartTotalsLocal = (cart) => {
  let subtotal = 0;
  let totalQuantity = 0;

  cart.forEach((item) => {
    const productPrice = item.product?.salePrice || item.product?.price || 0;
    const quantity = item.quantity || 1;
    subtotal += productPrice * quantity;
    totalQuantity += quantity;
  });

  const taxRate = 0.18;
  const taxAmount = subtotal * taxRate;
  const shippingFee = subtotal > 1000 ? 0 : 50;
  const totalAmount = subtotal + taxAmount + shippingFee;

  return {
    subtotal,
    taxAmount,
    shippingFee,
    totalAmount,
    totalQuantity,
  };
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.success = false;
      state.error = null;
    },
    clearCartState: (state) => {
      state.cart = [];
      state.subtotal = 0;
      state.taxAmount = 0;
      state.shippingFee = 0;
      state.totalAmount = 0;
      state.totalQuantity = 0;
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    incrementQuantity: (state, action) => {
      const { productId } = action.payload;
      const item = state.cart.find((item) => item.product._id === productId);
      if (item) {
        item.quantity += 1;
        const totals = calculateCartTotalsLocal(state.cart);
        Object.assign(state, totals);
      }
    },
    decrementQuantity: (state, action) => {
      const { productId } = action.payload;
      const item = state.cart.find((item) => item.product._id === productId);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        const totals = calculateCartTotalsLocal(state.cart);
        Object.assign(state, totals);
      }
    },
    updateLocalCartTotals: (state) => {
      const totals = calculateCartTotalsLocal(state.cart);
      Object.assign(state, totals);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart || [];
        state.subtotal = action.payload.subtotal || 0;
        state.taxAmount = action.payload.taxAmount || 0;
        state.shippingFee = action.payload.shippingFee || 0;
        state.totalAmount = action.payload.totalAmount || 0;
        state.totalQuantity = action.payload.totalQuantity || 0;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.cart = action.payload.cart || [];
        state.subtotal = action.payload.subtotal || 0;
        state.taxAmount = action.payload.taxAmount || 0;
        state.shippingFee = action.payload.shippingFee || 0;
        state.totalAmount = action.payload.totalAmount || 0;
        state.totalQuantity = action.payload.totalQuantity || 0;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.cart = action.payload.cart || [];
        state.subtotal = action.payload.subtotal || 0;
        state.taxAmount = action.payload.taxAmount || 0;
        state.shippingFee = action.payload.shippingFee || 0;
        state.totalAmount = action.payload.totalAmount || 0;
        state.totalQuantity = action.payload.totalQuantity || 0;
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.cart = action.payload.cart || [];
        state.subtotal = action.payload.subtotal || 0;
        state.taxAmount = action.payload.taxAmount || 0;
        state.shippingFee = action.payload.shippingFee || 0;
        state.totalAmount = action.payload.totalAmount || 0;
        state.totalQuantity = action.payload.totalQuantity || 0;
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.cart = [];
        state.subtotal = 0;
        state.taxAmount = 0;
        state.shippingFee = 0;
        state.totalAmount = 0;
        state.totalQuantity = 0;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const {
  resetStatus,
  clearCartState,
  incrementQuantity,
  decrementQuantity,
  updateLocalCartTotals,
} = cartSlice.actions;
export default cartSlice.reducer;
