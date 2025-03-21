import React, { useState, useEffect } from 'react';
const API_URL = 'http://192.168.8.200:8000/categories';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false); 
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setCategories(data);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const updateCategory = { ...selectedCategory };

    const response = await fetch(`${API_URL}/${selectedCategory.id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updateCategory),
    });

    if (response.ok) {
      const updatedCategoryData = await response.json();
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === updatedCategoryData.id ? updatedCategoryData : category
        )
      );
    } else {
      alert('Failed to update category.');
    }
    setSaving(false);
  };

  const handleDelete = async (e, categoryId) => {
    e.stopPropagation();
    setDeleting(true); 

    const response = await fetch(`${API_URL}/${categoryId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      );
    } else {
      alert('Failed to delete category.');
    }
    setDeleting(false);
  };

  const handleAddCategory = async () => {
    setLoading(true);
    const newCategory = {
      name: 'New Category',
      image: '',
      priority: 0,
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(newCategory),
    });

    if (response.ok) {
      const addedCategory = await response.json();
      setCategories((prevCategories) => [...prevCategories, addedCategory]);
    } else {
      alert('Failed to add category');
    }
    setLoading(false);
  };

  return (
    <div id="category-page-container" className="crud-page-container">
      <div id="category-container" className="crud-container">
        <h2>Categories</h2>
        <button id="btn-add" onClick={handleAddCategory} disabled={loading}>
          {loading ? 'Loading.....' : 'Add Category'}
        </button>
        <ol>
          {categories.map((category) => (
            <li
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              style={{
                backgroundColor: selectedCategory?.id === category.id ? '#a6beda36' : '',
              }}
            >
              {category.name}
              <button
                id="btn-delete"
                onClick={(e) => handleDelete(e, category.id)}
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
        {selectedCategory ? (
          <div id="edit-category-container" className="edit-crud-container">
            <h2>Edit Category</h2>
            <form>
              <div>
                <label>Category Name</label>
                <input
                  type="text"
                  name="name"
                  value={selectedCategory.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={selectedCategory.image}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Priority</label>
                <input
                  type="number"
                  name="priority"
                  value={selectedCategory.priority}
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
          <p>Select a category to edit</p>
        )}
      </div>
    </div>
  );
}

export default Categories;
