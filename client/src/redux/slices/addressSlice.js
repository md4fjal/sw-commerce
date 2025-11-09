import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/address";

const initialState = {
  billingAddress: null,
  shippingAddress: null,
  loading: false,
  error: null,
  success: false,
};

export const fetchAddress = createAsyncThunk(
  "address/fetch",
  async ({ token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load address"
      );
    }
  }
);

export const updateBillingAddress = createAsyncThunk(
  "address/updateBilling",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/billing`,
        { billingAddress: data },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.billingAddress;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update billing address"
      );
    }
  }
);

export const updateShippingAddress = createAsyncThunk(
  "address/updateShipping",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/shipping`,
        { shippingAddress: data },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.shippingAddress;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update shipping address"
      );
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearAddress: (state) => {
      state.billingAddress = null;
      state.shippingAddress = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearAddressError: (state) => {
      state.error = null;
    },
    resetAddressSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.billingAddress = action.payload.billingAddress;
        state.shippingAddress = action.payload.shippingAddress;
        state.error = null;
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBillingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateBillingAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.billingAddress = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(updateBillingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(updateShippingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateShippingAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.shippingAddress = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(updateShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearAddress, clearAddressError, resetAddressSuccess } =
  addressSlice.actions;
export default addressSlice.reducer;
