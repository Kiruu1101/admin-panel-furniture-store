import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ProductItem from './ProductItem';
import ProductForm from './ProductForm';

export default function ProductList() {
  const { items, loading } = useSelector(s => s.products);
  const [editProd, setEditProd] = useState(null);

  if (loading) return <p>Loading products…</p>;

  return (
    <>
      {editProd && <ProductForm closeModal={() => setEditProd(null)} product={editProd} editable />}
      <div className="d-flex flex-wrap gap-3">
        {items.map(p => (
          <ProductItem key={p.id} product={p} onEdit={() => setEditProd(p)} />
        ))}
      </div>
    </>
  );
}
