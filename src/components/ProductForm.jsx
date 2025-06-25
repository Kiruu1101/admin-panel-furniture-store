import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addProduct,
  updateProduct,
} from '../store/productSlice';
import {
  fetchCategories,
  addOrUpdateCategory,
} from '../store/categorySlice';

export default function ProductForm({ closeModal, product = null, editable = false }) {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.items||{});

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    subCategory: '',
    imageUrl: '',
  });


  const [showCategoryEditor, setShowCategoryEditor] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newSubCategories, setNewSubCategories] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
  if (editable && product) {
    setForm((prev) => ({
      ...prev,
      ...product,
    }));
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

  const handleAddCategory = (e) => {
    e.preventDefault();
    const cleanCategory = newCategory.trim();
    const cleanSubcategories = newSubCategories
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s);

    if (!cleanCategory || cleanSubcategories.length === 0) return;

    dispatch(addOrUpdateCategory({ category: cleanCategory, subcategories: cleanSubcategories }))
      .then(() => {
        dispatch(fetchCategories());
        setNewCategory('');
        setNewSubCategories('');
        setShowCategoryEditor(false);
      });
  };


  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
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

            <div className="d-flex justify-content-between align-items-center mb-2">
              <select
                name="category"
                value={form.category}
                onChange={handle}
                className="form-control me-2"
                required
              >
                <option value="">Select Category…</option>
                {Object.keys(categories).length === 0 ? (
                  <option disabled>No categories available</option>
                ) : (
                  Object.keys(categories).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))
                )}
              </select>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => setShowCategoryEditor(!showCategoryEditor)}
              >
                {showCategoryEditor ? 'Cancel' : '➕ Add Category'}
              </button>
            </div>

            {form.category && (
              <select
                name="subCategory"
                value={form.subCategory}
                onChange={handle}
                className="form-control mb-2"
                required
              >
                <option value="">Select SubCategory…</option>
                {categories[form.category]?.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            )}

            {showCategoryEditor && (
              <div className="border p-3 mb-3 bg-light">
                <h6 className="fw-bold">Add / Update Category</h6>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Category name (e.g. Sofa)"
                />
                <textarea
                  value={newSubCategories}
                  onChange={(e) => setNewSubCategories(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Comma-separated subcategories (e.g. 2 Seater, 3 Seater)"
                />
                <button className="btn btn-sm btn-success" onClick={handleAddCategory}>
                  ✅ Save Category
                </button>
              </div>
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
              {editable ? 'Update Product' : 'Add Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
