import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      try {
        const response = await axios.get(API_URL);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
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

    try {
      const response = await axios.put(`${API_URL}/${selectedCategory.id}`, updateCategory);
      const updatedCategoryData = response.data;
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === updatedCategoryData.id ? updatedCategoryData : category
        )
      );
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e, categoryId) => {
    e.stopPropagation();
    setDeleting(true);

    try {
      await axios.delete(`${API_URL}/${categoryId}`);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      );
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    } finally {
      setDeleting(false);
    }
  };

  const handleAddCategory = async () => {
    setLoading(true);
    const newCategory = {
      name: 'New Category',
      image: '',
      priority: 0,
    };

    try {
      const response = await axios.post(API_URL, newCategory);
      const addedCategory = response.data;
      setCategories((prevCategories) => [...prevCategories, addedCategory]);
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');
    } finally {
      setLoading(false);
    }
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
