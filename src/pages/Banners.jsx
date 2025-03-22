import React, { useState, useEffect } from 'react';

const API_URL = 'http://192.168.8.200:8000/banners'; // Updated URL for the banners API

function Banners() {
  const [banners, setBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setBanners(data);
      setLoading(false);
    };

    fetchBanners();
  }, []);

  const handleBannerClick = (banner) => {
    setSelectedBanner(banner);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedBanner((prevBanner) => ({
      ...prevBanner,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const updatedBanner = { ...selectedBanner };

    const response = await fetch(`${API_URL}/${selectedBanner.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: updatedBanner.category,
        title: updatedBanner.title,
        image: updatedBanner.image,
      }),
    });

    if (response.ok) {
      const updatedBannerData = await response.json();
      setBanners((prevBanners) =>
        prevBanners.map((banner) =>
          banner.id === updatedBannerData.id ? updatedBannerData : banner
        )
      );
    } else {
      alert('Failed to update banner.');
    }
    setSaving(false);
  };

  const handleDelete = async (e, bannerId) => {
    e.stopPropagation();
    setDeleting(true);

    const response = await fetch(`${API_URL}/${bannerId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setBanners((prevBanners) =>
        prevBanners.filter((banner) => banner.id !== bannerId)
      );
    } else {
      alert('Failed to delete banner.');
    }
    setDeleting(false);
  };

  const handleAddBanner = async () => {
    setLoading(true);
    const newBanner = {
      category: 'New Category',
      title: 'New Banner',
      image: '', // Add a placeholder image or URL if needed
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBanner),
    });

    if (response.ok) {
      const addedBanner = await response.json();
      setBanners((prevBanners) => [...prevBanners, addedBanner]);
    } else {
      alert('Failed to add banner.');
    }
    setLoading(false);
  };

  return (
    <div id="banner-page-container" className="crud-page-container">
      <div id="banner-container" className="crud-container">
        <h2>Banners</h2>
        <button id="btn-add" onClick={handleAddBanner} disabled={loading}>
          {loading ? 'Loading.....' : 'Add Banner'}
        </button>
        <ol>
          {banners.map((banner) => (
            <li
              key={banner.id}
              onClick={() => handleBannerClick(banner)}
              style={{
                backgroundColor: selectedBanner?.id === banner.id ? '#a6beda36' : '',
              }}
            >
              {banner.title}
              <button
                id="btn-delete"
                onClick={(e) => handleDelete(e, banner.id)}
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
        {selectedBanner ? (
          <div id="edit-banner-container" className="edit-crud-container">
            <h2>Edit Banner</h2>
            <form>
              <div>
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={selectedBanner.category}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={selectedBanner.title}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={selectedBanner.image}
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
          <p>Select a banner to edit</p>
        )}
      </div>
    </div>
  );
}

export default Banners;