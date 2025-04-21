
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button, Box, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, resetAuthState } from '../features/products/registrationSlice';
import { RootState, AppDispatch } from '../redux/store';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { loading, error, success } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (success) {
      alert('Registration successful!');
      dispatch(resetAuthState());
      setTimeout(() => navigate('/'), 1500);
    }
  }, [success, navigate, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Registration successful!</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="password"
            name='password'
            type="password"
            value={formData.password}
            onChange={handleChange}
            required

          />
          <Box mt={2}>
            <Button fullWidth type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Register;


