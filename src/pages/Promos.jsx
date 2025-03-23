import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://192.168.8.200:8000/promos';

function Promos() {
  const [promos, setPromos] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPromos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL);
        setPromos(response.data);
      } catch (error) {
        console.error('Error fetching promos:', error);
      }
      setLoading(false);
    };

    fetchPromos();
  }, []);

  const handlePromoClick = (promo) => {
    setSelectedPromo(promo);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPromo((prevPromo) => ({
      ...prevPromo,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const updatedPromo = { ...selectedPromo };

    try {
      const response = await axios.put(`${API_URL}/${selectedPromo.id}`, {
        category: updatedPromo.category,
        title: updatedPromo.title,
        image: updatedPromo.image,
      });

      const updatedPromoData = response.data;
      setPromos((prevPromos) =>
        prevPromos.map((promo) =>
          promo.id === updatedPromoData.id ? updatedPromoData : promo
        )
      );
    } catch (error) {
      alert('Failed to update promo.');
      console.error('Error saving promo:', error);
    }
    setSaving(false);
  };

  const handleDelete = async (e, promoId) => {
    e.stopPropagation();
    setDeleting(true);

    try {
      await axios.delete(`${API_URL}/${promoId}`);
      setPromos((prevPromos) =>
        prevPromos.filter((promo) => promo.id !== promoId)
      );
    } catch (error) {
      alert('Failed to delete promo.');
      console.error('Error deleting promo:', error);
    }
    setDeleting(false);
  };

  const handleAddPromo = async () => {
    setLoading(true);
    const newPromo = {
      category: 'New Category',
      title: 'New Promo',
      image: '',
    };

    try {
      const response = await axios.post(API_URL, newPromo);
      const addedPromo = response.data;
      setPromos((prevPromos) => [...prevPromos, addedPromo]);
    } catch (error) {
      alert('Failed to add promo.');
      console.error('Error adding promo:', error);
    }
    setLoading(false);
  };

  return (
    <div id="promo-page-container" className="crud-page-container">
      <div id="promo-container" className="crud-container">
        <h2>Promos</h2>
        <button id="btn-add" onClick={handleAddPromo} disabled={loading}>
          {loading ? 'Loading.....' : 'Add Promo'}
        </button>
        <ol>
          {promos.map((promo) => (
            <li
              key={promo.id}
              onClick={() => handlePromoClick(promo)}
              style={{
                backgroundColor: selectedPromo?.id === promo.id ? '#a6beda36' : '',
              }}
            >
              {promo.title}
              <button
                id="btn-delete"
                onClick={(e) => handleDelete(e, promo.id)}
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
        {selectedPromo ? (
          <div id="edit-promo-container" className="edit-crud-container">
            <h2>Edit Promo</h2>
            <form>
              <div>
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={selectedPromo.category}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={selectedPromo.title}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={selectedPromo.image}
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
          <p>Select a promo to edit</p>
        )}
      </div>
    </div>
  );
}

export default Promos;
