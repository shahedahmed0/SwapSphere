import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { apiUrl } from '../config/api';
import ConditionChecklist from './ConditionChecklist';

const CreateListing = ({ userId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    condition: 'Used',
    category: 'Others',
    availability: 'Available for Swap',
    tags: '',
    location: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [conditionChecklist, setConditionChecklist] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert('Error: User session not found. Please log in again.');
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('condition', formData.condition);
      data.append('ownerId', userId);
      data.append('category', formData.category);
      data.append('availability', formData.availability);
      data.append('conditionChecklist', JSON.stringify(conditionChecklist));

      if (formData.tags) {
        data.append('tags', formData.tags);
      }
      if (formData.location) {
        data.append('location', formData.location);
      }
      if (imageFile) {
        data.append('image', imageFile);
      }

      const token = localStorage.getItem('token');

      const res = await axios.post(apiUrl('/api/items'), data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { 'x-auth-token': token } : {})
        }
      });

      if (res.status === 201 || res.status === 200) {
        alert('Hobby item listed successfully!');
        setFormData({
          title: '',
          description: '',
          condition: 'Used',
          category: 'Others',
          availability: 'Available for Swap',
          tags: '',
          location: ''
        });
        setImageFile(null);
        setConditionChecklist([]);
      }
    } catch (err) {
      alert('Failed to post item. Check if the backend server is running.');
    }
  };

  return (
    <div className="create-listing-page section light-background" style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container py-4 py-md-5">
        <div
          className="rounded-4 p-4 p-md-5 mb-4 text-white position-relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #14532d 48%, #18d26e 100%)'
          }}
        >
          <div className="position-relative" style={{ zIndex: 1 }}>
            <p className="text-white-50 small text-uppercase fw-semibold mb-2 mb-md-1">Marketplace</p>
            <h1 className="h2 fw-bold mb-2">List a new item</h1>
            <p className="mb-0 opacity-90" style={{ maxWidth: '36rem' }}>
              Showcase your piece with clear condition notes and photos. Accurate listings lead to smoother swaps and better reviews.
            </p>
            <div className="mt-3 d-flex flex-wrap gap-2">
              <Link to="/marketplace" className="btn btn-light btn-sm rounded-pill px-3">
                Browse listings
              </Link>
              <Link to="/safety" className="btn btn-outline-light btn-sm rounded-pill px-3 border-2">
                Safety tips
              </Link>
            </div>
          </div>
        </div>

        <div className="row g-4 g-lg-5 align-items-start">
          <div className="col-lg-8">
            <form onSubmit={handleSubmit} className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-body p-4 p-md-5">
                <div className="mb-4">
                  <label className="form-label fw-semibold">Title</label>
                  <input
                    type="text"
                    className="form-control form-control-lg rounded-3"
                    placeholder="e.g. First-edition board game, near mint"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control rounded-3"
                    rows={5}
                    placeholder="Condition, rarity, provenance, what you hope to swap for…"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Item condition</label>
                    <select
                      className="form-select rounded-3"
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    >
                      <option value="Mint">Mint</option>
                      <option value="Used">Used</option>
                      <option value="Rare">Rare</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Category</label>
                    <select
                      className="form-select rounded-3"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Cards">Cards</option>
                      <option value="Coins">Coins</option>
                      <option value="Books">Books</option>
                      <option value="Board Games">Board Games</option>
                      <option value="Plants">Plants</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>

                <ConditionChecklist
                  category={formData.category}
                  selectedChecks={conditionChecklist}
                  setSelectedChecks={setConditionChecklist}
                />

                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Availability</label>
                    <select
                      className="form-select rounded-3"
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    >
                      <option value="Available for Swap">Available for Swap</option>
                      <option value="Private Collection">Private Collection</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Location</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="City, country (optional)"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mt-4 mb-4">
                  <label className="form-label fw-semibold">Tags</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="Comma separated: rare, vintage, limited…"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control rounded-3"
                    onChange={(e) => setImageFile(e.target.files[0] || null)}
                  />
                  {imageFile && (
                    <div className="mt-3 rounded-3 overflow-hidden border bg-light d-inline-block">
                      <img src={URL.createObjectURL(imageFile)} alt="Preview" style={{ maxHeight: '180px', display: 'block' }} />
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-success btn-lg w-100 rounded-pill fw-semibold py-3">
                  Publish listing
                </button>
              </div>
            </form>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 sticky-lg-top" style={{ top: '100px' }}>
              <div className="card-body p-4">
                <h2 className="h5 fw-bold mb-3">Listing checklist</h2>
                <ul className="small text-muted ps-3 mb-4">
                  <li className="mb-2">Use natural light for photos when you can.</li>
                  <li className="mb-2">Call out flaws honestly—buyers remember transparency.</li>
                  <li className="mb-2">Match category and checklist to your niche.</li>
                  <li className="mb-0">Update availability when an item is no longer offered.</li>
                </ul>
                <div className="rounded-3 p-3 bg-light border">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-shield-check text-success fs-5" aria-hidden="true"></i>
                    <span className="fw-semibold small">Trust &amp; safety</span>
                  </div>
                  <p className="small text-muted mb-0">
                    Read our <Link to="/safety">Safety Center</Link> for negotiation, reviews, and dispute tips before you ship or meet up.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;
