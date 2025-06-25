import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import FullPageLoader from '../components/FullPageLoader';
import '../styles/Login.css'

function Login() {
  const dispatch = useDispatch();
  const { status, error } = useSelector(state => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const canSubmit = [email, password].every(Boolean) && status !== 'loading';

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  if (status === 'loading') return <FullPageLoader message='Logging you in...'/>;
  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={!canSubmit}>{status === 'loading' ? 'Logging in...' : 'Login'}</button>
      </form>
    </div>
  );
}
export default Login;
