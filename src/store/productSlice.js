import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';

export const addProduct = createAsyncThunk('products/addProduct', async (product) => {
  const docRef = await addDoc(collection(db, 'products'), {
    ...product,
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...product };
});

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const snapshot = await getDocs(collection(db, 'products'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, updates }) => {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, updates);
  return { id, updates };
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id) => {
  await deleteDoc(doc(db, 'products', id));
  return id;
});



const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
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
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload.updates };
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  }
});

export default productSlice.reducer;
