// src/store/categorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const DATABASE_URL = 'https://furniture-app-by-kiran-default-rtdb.firebaseio.com';

// Fetch categories
export const fetchCategories = createAsyncThunk('categories/fetch', async () => {
  const res = await fetch(`${DATABASE_URL}/categories.json`);
  const data = await res.json();
  return data || {};
});

// Add or update category
export const addOrUpdateCategory = createAsyncThunk(
  'categories/addOrUpdate',
  async ({ category, subcategories }) => {
    await fetch(`${DATABASE_URL}/categories/${category}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subcategories),
    });
    return { category, subcategories };
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: {}, // ✅ Must be an object
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addOrUpdateCategory.fulfilled, (state, action) => {
        state.items[action.payload.category] = action.payload.subcategories;
      });
  },
});

export default categorySlice.reducer;
