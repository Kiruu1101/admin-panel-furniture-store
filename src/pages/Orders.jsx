import React, { useEffect, useState } from 'react';
import '../styles/AdminOrders.css';

const statusOptions = ['Placed', 'Shipped', 'Delivered', 'Cancelled'];
const DATABASE_URL = 'https://furniture-app-by-kiran-default-rtdb.firebaseio.com';

export default function Orders() {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const res = await fetch(`${DATABASE_URL}/orders.json`);
        const data = await res.json();

        if (data) {
          const orders = [];
          Object.entries(data).forEach(([userId, userOrders]) => {
            Object.entries(userOrders).forEach(([orderId, order]) => {
              orders.push({ id: orderId, userId, ...order });
            });
          });
          setAllOrders(
            orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          );
        } else {
          setAllOrders([]);
        }
      } catch (error) {
        console.error('Error fetching all orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  const handleStatusChange = async (userId, orderId, newStatus) => {
    try {
      const res = await fetch(
        `${DATABASE_URL}/orders/${userId}/${orderId}.json`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error('Failed to update');

      setAllOrders((prev) =>
        prev.map((order) =>
          order.id === orderId && order.userId === userId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Try again.');
    }
  };

  return (
    <div className="admin-orders-container">
      <h3 className="mb-4">Order Management</h3>
      {loading ? (
        <p>Loading orders...</p>
      ) : allOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        allOrders.map((order) => (
          <div className="admin-order-card" key={order.id}>
            <div className="admin-order-header">
              <p><strong>User ID:</strong> {order.userId}</p>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <p><strong>Placed:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <label>
                <strong>Update Status:</strong>{' '}
                <select
                  className="status-select"
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order.userId, order.id, e.target.value)
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="admin-order-body">
              <p><strong>Address:</strong> {order.address}</p>
              <ul>
                {order.items.map(({ product, qty }) => (
                  <li key={product.id}>
                    {product.name} × {qty} = ₹{product.price * qty}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
