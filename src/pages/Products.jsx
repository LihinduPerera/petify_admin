import React, { useState } from 'react';

function Products() {
  const dummyProducts = [
    { id: 1, name: 'Product 1', price: 10.0, description: 'A great product.' },
    { id: 2, name: 'Product 2', price: 20.0, description: 'Another great product.' },
    { id: 3, name: 'Product 3', price: 30.0, description: 'An amazing product.' },
  ];

  const [products, setProducts] = useState(dummyProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);

  console.log(products); // Debugging line

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

  const handleSave = () => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === selectedProduct.id ? selectedProduct : product
      )
    );
    alert('Product updated successfully!');
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, padding: '20px', borderRight: '1px solid #ccc' }}>
        <h2>Products</h2>
        <ul>
          {products.map((product) => (
            <li
              key={product.id}
              onClick={() => handleProductClick(product)}
              style={{
                cursor: 'pointer',
                marginBottom: '10px',
                padding: '5px',
                backgroundColor: selectedProduct?.id === product.id ? '#e0e0e0' : '',
              }}
            >
              {product.name}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flex: 2, padding: '20px' }}>
        {selectedProduct ? (
          <div>
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
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={selectedProduct.price}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Description</label>
                <textarea
                  name="description"
                  value={selectedProduct.description}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <button type="button" onClick={handleSave}>
                  Save
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
