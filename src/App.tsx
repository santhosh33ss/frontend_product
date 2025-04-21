import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import { Container, Box, Typography } from '@mui/material';
import ProductList from './pages/productlist';
import ProductCreate from './pages/productcreate';
import EditProduct from './pages/productedit';
import { Provider } from 'react-redux';
import { store } from './redux/store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Container maxWidth="sm">
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Welcome to My Product App...
            </Typography>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/create" element={<ProductCreate />} />
              <Route path="/products/edit/:id" element={<EditProduct />} />
            </Routes>
          </Box>
        </Container>
      </Router>
    </Provider>
  );
};

export default App;
