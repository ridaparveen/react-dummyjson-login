import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.token) {
        // Save the token to local storage for future requests
        localStorage.setItem('token', data.token);
        // Redirect to the dashboard after successful login
        navigate('/dashboard');
      } else {
        console.error('Login failed:', data.error);
      }
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };

  return (
    <div className='card'>
      <div className='card-body'>
      <h2 className='text-center'>Login</h2>
      <form>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label label">Username: </label>
        <div className="col-sm-3">
          <input type="text" class="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
        </div>
        {/* <br /> */}
        <div className='form-group row'>
        <label className='col-sm-2 com-form-label label'>Password:</label>
        <div className='col-sm-3'>
          <input type="password" className='form-control' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        </div>
        <br />
        <button type="submit" className='btn btn-primary center' onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
    </div>
  );
};

export default Login;
