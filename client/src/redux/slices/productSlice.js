import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../main";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (
    {
      search = "",
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
      category = "",
      brand = "",
      gender = "",
      minPrice = "",
      maxPrice = "",
      inStock = "",
      isFeatured = "",
      isNewArrival = "",
      isTrending = "",
    },
    { rejectWithValue }
  ) => {
    try {
      let url = `${server}/product?search=${search}&sortBy=${sortBy}&order=${order}&page=${page}&limit=${limit}`;

      // Add optional filters
      if (category) url += `&category=${category}`;
      if (brand) url += `&brand=${brand}`;
      if (gender && gender !== "all") url += `&gender=${gender}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;
      if (inStock) url += `&inStock=${inStock}`;
      if (isFeatured) url += `&isFeatured=${isFeatured}`;
      if (isNewArrival) url += `&isNewArrival=${isNewArrival}`;
      if (isTrending) url += `&isTrending=${isTrending}`;

      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const getProductById = createAsyncThunk(
  "products/fetchById",
  async ({ id }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/product/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Product not found"
      );
    }
  }
);

export const getProductBySlug = createAsyncThunk(
  "products/fetchBySlug",
  async ({ slug }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/product/slug/${slug}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Product not found"
      );
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/add",
  async ({ token, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${server}/product`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Add product failed"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, token, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${server}/product/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Product update failed"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${server}/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { id, message: data?.message || "Product deleted successfully" };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Product delete failed"
      );
    }
  }
);

const initialState = {
  products: [],
  product: null,
  total: 0,
  page: 1,
  pages: 1,
  search: "",
  sortBy: "createdAt",
  order: "desc",
  limit: 10,
  loading: false,
  productLoading: false,
  success: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
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
    clearProduct: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getProductById.pending, (state) => {
        state.productLoading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.productLoading = false;
        state.product = action.payload.product;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.productLoading = false;
        state.error = action.payload;
      })

      .addCase(getProductBySlug.fulfilled, (state, action) => {
        state.product = action.payload.product;
      })

      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products.unshift(action.payload.product);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updated = action.payload.product;
        state.products = state.products.map((p) =>
          p._id === updated._id ? updated : p
        );
        if (state.product && state.product._id === updated._id) {
          state.product = updated;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products = state.products.filter(
          (p) => p._id !== action.payload.id
        );
        if (state.product && state.product._id === action.payload.id) {
          state.product = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearch, setPage, setSort, resetStatus, clearProduct } =
  productSlice.actions;
export default productSlice.reducer;
