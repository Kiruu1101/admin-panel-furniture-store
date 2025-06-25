import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const DATABASE_URL = 'https://furniture-app-by-kiran-default-rtdb.firebaseio.com';

// ✅ Fetch Products
export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const res = await fetch(`${DATABASE_URL}/products.json`);
  const data = await res.json();
  if (!data) return [];
  return Object.entries(data).map(([id, value]) => ({ id, ...value }));
});

// ✅ Add Product
export const addProduct = createAsyncThunk('products/add', async (product) => {
  const res = await fetch(`${DATABASE_URL}/products.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  const data = await res.json(); // { name: '<generated_id>' }
  return { id: data.name, ...product };
});

// ✅ Update Product
export const updateProduct = createAsyncThunk('products/update', async ({ id, updates }) => {
  await fetch(`${DATABASE_URL}/products/${id}.json`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return { id, updates };
});

// ✅ Delete Product
export const deleteProduct = createAsyncThunk('products/delete', async (id) => {
  await fetch(`${DATABASE_URL}/products/${id}.json`, {
    method: 'DELETE',
  });
  return id;
});

// ✅ Slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload.updates };
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  }
});

export default productSlice.reducer;
