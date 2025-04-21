import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product", err);
        setLoading(false);
      });
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:5000/api/products/${id}`, product, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Product updated successfully");
        navigate("/products");
      })
      .catch((err) => {
        console.error("Error updating product", err);
      });
  };

  if (loading) return <CircularProgress />;

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Edit Product
      </Typography>
      <TextField
        fullWidth
        label="Name"
        name="name"
        value={product.name}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Description"
        name="description"
        value={product.description}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Price"
        name="price"
        type="number"
        value={product.price}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Stock"
        name="stock"
        type="number"
        value={product.stock}
        onChange={handleChange}
        margin="normal"
      />
      <Button variant="contained" onClick={handleUpdate}>
        Update Product
      </Button>
    </Box>
  );
};

export default EditProduct;
