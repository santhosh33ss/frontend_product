// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   Button,
//   CardMedia,
// } from "@mui/material";

// interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   stock: number;
//   images: string[];
//   createdAt: string;
// }

// const ProductList: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/products", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setProducts(res.data);
//     } catch (error) {
//       console.error("Failed to fetch products:", error);
//     }
//   };

//   const deleteProduct = async (id: string) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/products/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setProducts(products.filter((product) => product._id !== id));
//     } catch (error) {
//       console.error("Error deleting product:", error);
//     }
//   };

//   return (
//     <Grid container spacing={2} padding={2}>
//       {products.map((product) => (
//         // <Grid item xs={12} sm={6} md={4} key={product._id}>
//           <Card>
//             {product.images.length > 0 && (
//               <CardMedia
//                 component="img"
//                 height="200"
//                 image={`http://localhost:5000/uploads/${product.images[0]}`}
//                 alt={product.name}
//               />
//             )}
//             <CardContent>
//               <Typography variant="h6">{product.name}</Typography>
//               <Typography variant="body2" color="textSecondary">
//                 {product.description}
//               </Typography>

//               <Typography>Price: ₹{product.price}</Typography>
//               <Typography>Stock: {product.stock}</Typography>
//               <Typography variant="caption" display="block" gutterBottom>
//                 Created At: {new Date(product.createdAt).toLocaleString()}
//               </Typography>
//               <Button
//                 variant="contained"
//                 color="success"
//                 onClick={() => deleteProduct(product._id)}
//                 style={{ marginTop: "10px" }}
//               >
//                 Delete the Product..
//               </Button>
//             </CardContent>
//           </Card>
//         // </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default ProductList;


import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CardMedia,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  createdAt: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, stockFilter, sortOption, products]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Filter by name
    if (search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by stock
    if (stockFilter === "inStock") {
      filtered = filtered.filter((product) => product.stock > 0);
    } else if (stockFilter === "outOfStock") {
      filtered = filtered.filter((product) => product.stock <= 0);
    }

    // Sort
    if (sortOption === "newest") {
      filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortOption === "oldest") {
      filtered.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (sortOption === "priceLowHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "priceHighLow") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  };

  return (
    <Box p={2}>
      {/* Filters */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          label="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Stock</InputLabel>
          <Select
            value={stockFilter}
            label="Stock"
            onChange={(e) => setStockFilter(e.target.value)}
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
            onChange={(e) => setSortOption(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
            {/* <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
            <MenuItem value="priceHighLow">Price: High to Low</MenuItem> */}
          </Select>
        </FormControl>
      </Box>

      {/* Product Grid */}
      <Grid container spacing={2}>
        {filteredProducts.map((product) => (
        //   <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card>
              {product.images.length > 0 && (
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:5000/uploads/${product.images[0]}`}
                  alt={product.name}
                />
              )}
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography>{product.description}</Typography>
                <Typography>₹{product.price}</Typography>
                <Typography>Stock: {product.stock}</Typography>
                <Typography variant="caption">
                  {new Date(product.createdAt).toLocaleString()}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deleteProduct(product._id)}
                  sx={{ mt: 1 }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
        //   </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductList;


