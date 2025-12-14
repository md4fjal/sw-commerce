import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../main";

export const fetchOrders = createAsyncThunk(
  "order/fetchAll",
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
        `${server}/order/all?search=${search}&sortBy=${sortBy}&order=${order}&page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

export const getOrderById = createAsyncThunk(
  "order/fetchById",
  async ({ orderId, token }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Order not found");
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async ({ orderId, status, token }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${server}/order/status/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Order status update failed"
      );
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "order/delete",
  async ({ orderId, token }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${server}/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        orderId,
        message: data?.message || "Order deleted successfully",
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Order delete failed"
      );
    }
  }
);

export const fetchOrderStats = createAsyncThunk(
  "order/fetchStats",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/order/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order stats"
      );
    }
  }
);

const initialState = {
  orders: [],
  order: null,
  total: 0,
  page: 1,
  pages: 1,
  limit: 10,
  search: "",
  sortBy: "createdAt",
  order: "desc",
  stats: null,
  statsLoading: false,
  loading: false,
  orderLoading: false,
  success: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
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
    resetStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Order By ID
      .addCase(getOrderById.pending, (state) => {
        state.orderLoading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.order = action.payload.order;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.orderLoading = false;
        state.error = action.payload;
      })

      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedOrder = action.payload.order;
        state.orders = state.orders.map((o) =>
          o._id === updatedOrder._id ? updatedOrder : o
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders = state.orders.filter(
          (o) => o._id !== action.payload.orderId
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetch stats

      .addCase(fetchOrderStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchOrderStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearch, setSort, setPage, resetStatus } = orderSlice.actions;
export default orderSlice.reducer;
