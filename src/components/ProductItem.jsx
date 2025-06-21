// src/components/ProductItem.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteProduct } from '../store/productSlice';

export default function ProductItem({ product, onEdit }) {
  const dispatch = useDispatch();
  const out = product.quantity <= 0;

  return (
    <div className={`card mb-3 ${out ? 'out-of-stock' : ''}`} style={{ width: '18rem' }}>
      <img src={product.imageUrl} className="card-img-top" alt={product.name} />
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">Qty: {product.quantity}</p>
        <p className="card-text">₹{product.price}</p>
        <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(product)}>Edit</button>
        <button className="btn btn-sm btn-danger" onClick={() => dispatch(deleteProduct(product.id))}>Delete</button>
      </div>
    </div>
  );
}
