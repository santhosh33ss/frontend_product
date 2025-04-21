
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {
  fetchProducts,
  deleteProduct,
  setSearch,
  setSortOption,
  setStockFilter,
} from "../features/products/productSlice";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { filteredProducts, search, stockFilter, sortOption } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <Box p={2}>
      <Button
        variant="contained"
        color="success"
        onClick={() => navigate("/products/create")}
        sx={{ mt: 1, mb: 2 }}
      >
        CREATE PRODUCT
      </Button>

      <Typography variant="h5" mb={2}>
        PRODUCT LISTS
      </Typography>

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          label="Search by name"
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Stock</InputLabel>
          <Select
            value={stockFilter}
            label="Stock"
            onChange={(e: SelectChangeEvent) =>
              dispatch(setStockFilter(e.target.value))
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="inStock">In Stock</MenuItem>
            <MenuItem value="outOfStock">Out of Stock</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Sort</InputLabel>
          <Select
            value={sortOption}
            label="Sort"
            onChange={(e: SelectChangeEvent) =>
              dispatch(setSortOption(e.target.value))
            }
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
            <MenuItem value="priceLowHigh">Price Low to High</MenuItem>
            <MenuItem value="priceHighLow">Price High to Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ width: "140%", margin: "0 auto" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    {product.images.length > 0 && (
                      <img
                        src={`http://localhost:5000/uploads/${product.images[0]}`}
                        alt={product.name}
                        style={{ width: 80, height: 80, objectFit: "cover" }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>₹{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    {new Date(product.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate(`/products/edit/${product._id}`)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => dispatch(deleteProduct(product._id))}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ProductList;


