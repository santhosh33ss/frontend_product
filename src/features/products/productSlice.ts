// src/redux/slices/productSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  createdAt: string;
}

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  search: string;
  stockFilter: string;
  sortOption: string;
}

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  loading: false,
  error: null,
  search: "",
  stockFilter: "",
  sortOption: "",
};

const token = localStorage.getItem("token");

export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  const res = await axios.get("http://localhost:5000/api/products", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string, { dispatch }) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(fetchProducts());
    return id;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      productSlice.caseReducers.applyFilters(state);
    },
    setStockFilter(state, action: PayloadAction<string>) {
      state.stockFilter = action.payload;
      productSlice.caseReducers.applyFilters(state);
    },
    setSortOption(state, action: PayloadAction<string>) {
      state.sortOption = action.payload;
      productSlice.caseReducers.applyFilters(state);
    },
    applyFilters(state) {
      let filtered = [...state.products];
      const { search, stockFilter, sortOption } = state;

      if (search) {
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (stockFilter === "inStock") {
        filtered = filtered.filter(p => p.stock > 0);
      } else if (stockFilter === "outOfStock") {
        filtered = filtered.filter(p => p.stock <= 0);
      }

      if (sortOption === "newest") {
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (sortOption === "oldest") {
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else if (sortOption === "priceLowHigh") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortOption === "priceHighLow") {
        filtered.sort((a, b) => b.price - a.price);
      }

      state.filteredProducts = filtered;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        productSlice.caseReducers.applyFilters(state);
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching products";
      });
  },
});

export const {
  setSearch,
  setStockFilter,
  setSortOption,
} = productSlice.actions;

export default productSlice.reducer;
