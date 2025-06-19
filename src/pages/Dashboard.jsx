import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import ProductForm from '../components/ProductForm';

function Dashboard() {
  const dispatch = useDispatch();
  const email = useSelector(state => state.auth.user.email);

  return (
    <div className="dashboard">
      <header>
        <h1>Welcome, {email}</h1>
        <button onClick={() => dispatch(logout())}>Logout</button>
      </header>
    </div>
  );
}

export default Dashboard;
