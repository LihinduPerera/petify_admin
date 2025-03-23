import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://192.168.8.200:8000/banners';

function Banners() {
  const [banners, setBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL);
        setBanners(response.data);
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
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

    try {
      const response = await axios.put(`${API_URL}/${selectedBanner.id}`, {
        category: updatedBanner.category,
        title: updatedBanner.title,
        image: updatedBanner.image,
      });

      const updatedBannerData = response.data;
      setBanners((prevBanners) =>
        prevBanners.map((banner) =>
          banner.id === updatedBannerData.id ? updatedBannerData : banner
        )
      );
    } catch (error) {
      alert('Failed to update banner.');
      console.error('Error updating banner:', error);
    }
    setSaving(false);
  };

  const handleDelete = async (e, bannerId) => {
    e.stopPropagation();
    setDeleting(true);

    try {
      await axios.delete(`${API_URL}/${bannerId}`);
      setBanners((prevBanners) =>
        prevBanners.filter((banner) => banner.id !== bannerId)
      );
    } catch (error) {
      alert('Failed to delete banner.');
      console.error('Error deleting banner:', error);
    }
    setDeleting(false);
  };

  const handleAddBanner = async () => {
    setLoading(true);
    const newBanner = {
      category: 'New Category',
      title: 'New Banner',
      image: '',
    };

    try {
      const response = await axios.post(API_URL, newBanner);
      const addedBanner = response.data;
      setBanners((prevBanners) => [...prevBanners, addedBanner]);
    } catch (error) {
      alert('Failed to add banner.');
      console.error('Error adding banner:', error);
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
