import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import '../styles/ProductForm.css';

const categoryOptions = {
  Wardrobe: ['2 Door', '3 Door', 'Sliding', 'Mirror Wardrobe'],
  Bed: ['Single', 'Double', 'Queen', 'King'],
  Table: ['Study Table', 'Dining Table', 'Coffee Table'],
};

const ProductForm = ({ closeModal }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    subCategory: '',
    imageUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addProduct(formData));
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity: '',
      category: '',
      subCategory: '',
      imageUrl: ''
    });
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required className="form-control mb-2" />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="form-control mb-2" />
      <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required className="form-control mb-2" />
      <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" required className="form-control mb-2" />

      <select name="category" value={formData.category} onChange={handleChange} required className="form-control mb-2">
        <option value="">Select Category</option>
        {Object.keys(categoryOptions).map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {formData.category && (
        <select name="subCategory" value={formData.subCategory} onChange={handleChange} required className="form-control mb-2">
          <option value="">Select Subcategory</option>
          {categoryOptions[formData.category].map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      )}

      <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" required className="form-control mb-2" />

      <button type="submit" className="btn btn-success w-100">Add Product</button>
    </form>
  );
};

export default ProductForm;
