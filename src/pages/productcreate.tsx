// src/pages/CreateProduct.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateProduct: React.FC = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
  });

  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages(selectedFiles);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('stock', product.stock);

    images.forEach((file) => {
      formData.append('images', file); //  matches backend field
    });

    const token = localStorage.getItem('token');

    try {
      const res = await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data);
      alert('Product created successfully!');
      navigate('/products');
    } catch (err) {
      console.error(err);
      alert('Error creating product.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 40 }}>
      <h2 style={{ textAlign: 'center' }}>Create New Product</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label>Product Name:</label><br />
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Description:</label><br />
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Price:</label><br />
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Stock:</label><br />
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Upload Images:</label><br />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          {/* <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {imagePreviews.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`preview-${index}`}
                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 5 }}
              />
            )
            )}
          </div> */}
        </div>
        <button
        type="submit"
        style={{
            width: '100%',
            padding: 10,
            backgroundColor: 'black', 
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            fontSize: 16,
            cursor: 'pointer'
        }}
        >
        Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
