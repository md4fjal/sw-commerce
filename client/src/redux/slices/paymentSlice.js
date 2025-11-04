import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/payment";

const initialState = {
  orders: [],
  order: null,
  loading: false,
  success: false,
  error: null,
};

// ---------- CREATE RAZORPAY ORDER ----------
export const createRazorpayOrder = createAsyncThunk(
  "payment/createOrder",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/create-order`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to create order"
      );
    }
  }
);

// ---------- VERIFY PAYMENT ----------
export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (
    {
      token,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/verify`,
        {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          dbOrderId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to verify payment"
      );
    }
  }
);

// ---------- CANCEL ORDER ----------
export const cancelOrder = createAsyncThunk(
  "payment/cancelOrder",
  async ({ token, orderId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/cancel/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data.order;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to cancel order"
      );
    }
  }
);

// ---------- REFUND PAYMENT ----------
export const refundPayment = createAsyncThunk(
  "payment/refundPayment",
  async ({ token, orderId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/refund/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to refund payment"
      );
    }
  }
);

// ---------- GET MY ORDERS ----------
export const getMyOrders = createAsyncThunk(
  "payment/getMyOrders",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.orders;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch orders"
      );
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    resetOrder: (state) => {
      state.order = null;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ----- create order -----
      .addCase(createRazorpayOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ----- verify payment -----
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload.order;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ----- cancel order -----
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders = state.orders.map((o) =>
          o._id === action.payload._id ? action.payload : o
        );
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ----- refund payment -----
      .addCase(refundPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(refundPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(refundPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ----- get my orders -----
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPaymentState, resetOrder } = paymentSlice.actions;
export default paymentSlice.reducer;
