import React, { useState, useEffect } from 'react';

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
      const response = await fetch(API_URL);
      const data = await response.json();
      setPromos(data);
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

    const response = await fetch(`${API_URL}/${selectedPromo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: updatedPromo.category,
        title: updatedPromo.title,
        image: updatedPromo.image,
      }),
    });

    if (response.ok) {
      const updatedPromoData = await response.json();
      setPromos((prevPromos) =>
        prevPromos.map((promo) =>
          promo.id === updatedPromoData.id ? updatedPromoData : promo
        )
      );
    } else {
      alert('Failed to update promo.');
    }
    setSaving(false);
  };

  const handleDelete = async (e, promoId) => {
    e.stopPropagation();
    setDeleting(true);

    const response = await fetch(`${API_URL}/${promoId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setPromos((prevPromos) =>
        prevPromos.filter((promo) => promo.id !== promoId)
      );
    } else {
      alert('Failed to delete promo.');
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

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPromo),
    });

    if (response.ok) {
      const addedPromo = await response.json();
      setPromos((prevPromos) => [...prevPromos, addedPromo]);
    } else {
      alert('Failed to add promo.');
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
