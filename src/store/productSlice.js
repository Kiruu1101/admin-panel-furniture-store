// src/features/products/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase';
import {
  ref,
  push,
  set,
  update,
  remove,
  get,
  child
} from 'firebase/database';

// Seed default products
export async function seedDefaultProducts() {
  const defaults = [
    { name: 'King Size Bed', description: 'Comfortable king bed', price: 25000, quantity: 5, category: 'Bed', subCategory: 'King', imageUrl: 'URL1' },
    { name: 'Queen Bed', description: 'Elegant queen bed', price: 20000, quantity: 4, category: 'Bed', subCategory: 'Queen', imageUrl: 'URL2' },
    { name: 'Single Bed', description: 'Compact single bed', price: 12000, quantity: 10, category: 'Bed', subCategory: 'Single', imageUrl: 'URL3' },
    { name: '2 Door Wardrobe', description: 'Spacious wardrobe', price: 18000, quantity: 3, category: 'Wardrobe', subCategory: '2 Door', imageUrl: 'URL4' },
    { name: '3 Door Wardrobe', description: 'Large wardrobe', price: 22000, quantity: 2, category: 'Wardrobe', subCategory: '3 Door', imageUrl: 'URL5' },
    { name: 'Sliding Wardrobe', description: 'Stylish sliding wardrobe', price: 24000, quantity: 2, category: 'Wardrobe', subCategory: 'Sliding', imageUrl: 'URL6' },
    { name: 'Mirror Wardrobe', description: 'Wardrobe with mirror', price: 26000, quantity: 1, category: 'Wardrobe', subCategory: 'Mirror Wardrobe', imageUrl: 'URL7' },
    { name: 'Dining Table', description: 'Family dining table', price: 15000, quantity: 3, category: 'Table', subCategory: 'Dining Table', imageUrl: 'URL8' },
    { name: 'Coffee Table', description: 'Stylish coffee table', price: 8000, quantity: 5, category: 'Table', subCategory: 'Coffee Table', imageUrl: 'URL9' },
    { name: 'Study Table', description: 'Functional study table', price: 9000, quantity: 4, category: 'Table', subCategory: 'Study Table', imageUrl: 'URL10' }
  ];

  for (let p of defaults) {
    const newRef = push(ref(db, 'products'));
    await set(newRef, p);
  }
}

// Fetch products
export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const snapshot = await get(child(ref(db), 'products'));
  const data = snapshot.val();
  if (!data) return [];
  return Object.entries(data).map(([id, value]) => ({ id, ...value }));
});

// Add product
export const addProduct = createAsyncThunk('products/add', async (product) => {
  const newRef = push(ref(db, 'products'));
  await set(newRef, product);
  return { id: newRef.key, ...product };
});

// Update product
export const updateProduct = createAsyncThunk('products/update', async ({ id, updates }) => {
  await update(ref(db, `products/${id}`), updates);
  return { id, updates };
});

// Delete product
export const deleteProduct = createAsyncThunk('products/delete', async (id) => {
  await remove(ref(db, `products/${id}`));
  return id;
});

// Slice
const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
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
