// src/components/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct, updateProduct } from '../store/productSlice';

const categoryOptions = {
  Wardrobe: ['2 Door', '3 Door', 'Sliding', 'Mirror Wardrobe'],
  Bed: ['Single', 'Double', 'Queen', 'King'],
  Table: ['Study Table', 'Dining Table', 'Coffee Table'],
  Other: ['Other']
};

export default function ProductForm({ closeModal, product = null, editable = false }) {
  const dispatch = useDispatch();

  const initialState = {
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    subCategory: '',
    imageUrl: ''
  };

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (editable && product) {
      setForm(product);
    }
  }, [editable, product]);

  const handle = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (editable) {
      dispatch(updateProduct({ id: product.id, updates: form }));
    } else {
      dispatch(addProduct(form));
    }
    closeModal();
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <button className="btn-close float-end" onClick={closeModal} />
          <form onSubmit={onSubmit} className="mt-4">
            <input
              name="name"
              value={form.name}
              onChange={handle}
              placeholder="Name"
              className="form-control mb-2"
              required
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handle}
              placeholder="Description"
              className="form-control mb-2"
              required
            />
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handle}
              className="form-control mb-2"
              placeholder="Price"
              required
            />
            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handle}
              className="form-control mb-2"
              placeholder="Quantity"
              required
            />
            <select
              name="category"
              value={form.category}
              onChange={handle}
              className="form-control mb-2"
              required
            >
              <option value="">Category…</option>
              {Object.keys(categoryOptions).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {form.category && (
              <select
                name="subCategory"
                value={form.subCategory}
                onChange={handle}
                className="form-control mb-2"
                required
              >
                <option value="">SubCategory…</option>
                {categoryOptions[form.category].map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            )}
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handle}
              placeholder="Image URL"
              className="form-control mb-2"
              required
            />
            <button type="submit" className="btn btn-success w-100">
              {editable ? 'Update' : 'Add'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
