import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      alert('Login successful');
      navigate('/products');
      // navigate('/dashboard');
        // navigate('/products/create'); // Redirect to products page
      // Navigate to dashboard or home
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Login
      </Button>
      <Button onClick={() => navigate('/register')} fullWidth sx={{ mt: 1 }}>
        Go to Register
      </Button>
    </Box>
  );
};

export default Login;
