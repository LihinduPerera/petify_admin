import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import config from '../config';

const API_URL = 'http://192.168.8.200:8000/products';
const CLOUDINARY_CLOUD_NAME = config.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = config.CLOUDINARY_UPLOAD_PRESET;

function Products() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL);
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const updatedProduct = { ...selectedProduct };

    try {
      const response = await axios.put(`${API_URL}/${selectedProduct.id}`, updatedProduct);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === response.data.id ? response.data : product
        )
      );
    } catch (error) {
      alert('Failed to update product.');
    }
    setSaving(false);
  };

  const handleDelete = async (e, productId) => {
    e.stopPropagation();
    setDeleting(true);

    try {
      await axios.delete(`${API_URL}/${productId}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      alert('Failed to delete product.');
    }
    setDeleting(false);
  };

  const handleAddProduct = async () => {
    setLoading(true);
    const newProduct = {
      name: 'New Product',
      desc: 'Description for new product.',
      image: '',
      old_price: 0,
      new_price: 0,
      category: 'Category',
      quantity: 0,
    };

    try {
      const response = await axios.post(API_URL, newProduct);
      setProducts((prevProducts) => [...prevProducts, response.data]);
    } catch (error) {
      alert('Failed to add product.');
    }
    setLoading(false);
  };

  const uploadImage = async (file) => {
    setImageLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setSelectedProduct((prevProduct) => ({
        ...prevProduct,
        image: res.data.secure_url,
      }));
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Image upload failed');
    }
    setImageLoading(false);
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      uploadImage(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.jpg, .png',
    multiple: false,
  });

  return (
    <div id="product-page-container" className="crud-page-container">
      <div id="product-container" className="crud-container">
        <h2>Products</h2>
        <button id="btn-add" onClick={handleAddProduct} disabled={loading}>
          {loading ? 'Loading.....' : 'Add Product'}
        </button>
        <ol>
          {products.map((product) => (
            <li
              key={product.id}
              onClick={() => handleProductClick(product)}
              style={{
                backgroundColor: selectedProduct?.id === product.id ? '#a6beda36' : '',
              }}
            >
              {product.name}
              <button
                id="btn-delete"
                onClick={(e) => handleDelete(e, product.id)}
                style={{ marginLeft: '10px' }}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div style={{ flex: 2, padding: '20px' }}>
        {selectedProduct ? (
          <div id="edit-product-container" className="edit-crud-container">
            <h2>Edit Product</h2>
            <form>
              <div>
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={selectedProduct.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Description</label>
                <textarea
                  name="desc"
                  value={selectedProduct.desc}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Image URL</label>
                <div
                  {...getRootProps()}
                  style={{
                    border: '1px dashed #ccc',
                    padding: '10px',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <input {...getInputProps()} />
                  {imageLoading ? 'Uploading...' : 'Drag and drop an image here, or click to select'}
                </div>
                {selectedProduct.image && !imageLoading && (
                  <img
                    src={selectedProduct.image}
                    alt="Product"
                    style={{ width: '100px', height: '100px', marginTop: '10px' }}
                  />
                )}
              </div>
              <div>
                <label>Old Price</label>
                <input
                  type="number"
                  name="old_price"
                  value={selectedProduct.old_price}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>New Price</label>
                <input
                  type="number"
                  name="new_price"
                  value={selectedProduct.new_price}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={selectedProduct.category}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={selectedProduct.quantity}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <button type="button" onClick={handleSave} disabled={saving || imageLoading}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <p>Select a product to edit</p>
        )}
      </div>
    </div>
  );
}

export default Products;
