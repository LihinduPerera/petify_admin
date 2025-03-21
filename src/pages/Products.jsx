import React, { useState, useEffect } from 'react';

const API_URL = 'http://192.168.8.200:8000/products';

function Products() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setProducts(data);
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

    const response = await fetch(`${API_URL}/${selectedProduct.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    });

    if (response.ok) {
      const updatedProductData = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === updatedProductData.id ? updatedProductData : product
        )
      );
    } else {
      alert('Failed to update product.');
    }
    setSaving(false);
  };

  const handleDelete = async (e, productId) => {
    e.stopPropagation();
    setDeleting(true);

    const response = await fetch(`${API_URL}/${productId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } else {
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

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    });

    if (response.ok) {
      const addedProduct = await response.json();
      setProducts((prevProducts) => [...prevProducts, addedProduct]);
    } else {
      alert('Failed to add product.');
    }
    setLoading(false);
  };

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
                <input
                  type="text"
                  name="image"
                  value={selectedProduct.image}
                  onChange={handleInputChange}
                />
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
                <button type="button" onClick={handleSave} disabled={saving}>
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
