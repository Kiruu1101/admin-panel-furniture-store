import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

function Dashboard() {
  const dispatch = useDispatch();

  const dashboardStyle = {
    backgroundImage: 'url("https://www.nestroots.com/cdn/shop/files/NRDBCH18_2_1300x.jpg?v=1731499659")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '20px',
  };

  const titleStyle = {
  fontSize: '3rem',
  fontWeight: 'bold',
  color: 'white',
  textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)',
  letterSpacing: '2px',
  textTransform: 'uppercase',
};


  return (
    <div style={dashboardStyle}>
      <header>
        <h1 style={titleStyle}>SUNSHINE FURNITURE STORE</h1>
      </header>
    </div>
  );
}

export default Dashboard;
