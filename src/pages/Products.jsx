import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../store/productSlice';

export default function Products() {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="container mt-4">
      <button className="btn btn-warning" onClick={() => setShow(true)}>
          Add New Product
        </button>
      <div className="d-flex justify-content-between mb-3">

        <h3 className="fw-bold text-primary border-bottom pb-2 mb-3 text-center">Manage Products</h3>
       
      </div>

      <ProductList />

      {show && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Product</h5>
                <button type="button" className="btn-close" onClick={() => setShow(false)} />
              </div>
              <div className="modal-body">
                <ProductForm closeModal={() => setShow(false)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
