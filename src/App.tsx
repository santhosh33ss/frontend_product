// /App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import { Container, Box, Typography } from '@mui/material';
import ProductList from './pages/productlist';
import ProductCreate from './pages/productcreate';

const App: React.FC = () => {
  return (
    <Router>
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Welcome to My Product App
          </Typography>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/create" element={<ProductCreate />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
};

export default App;
