import React, { useState } from 'react';
import axios from 'axios';

const CreateListing = ({ userId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    condition: 'Used',
    category: 'Others',
    availability: 'Available for Swap',
    tags: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("Error: User session not found. Please log in again.");
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
      if (formData.tags) {
        data.append('tags', formData.tags);
      }
      if (imageFile) {
        data.append('image', imageFile);
      }

      const token = localStorage.getItem('token');

      const res = await axios.post('http://localhost:5000/api/items', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { 'x-auth-token': token } : {}),
        },
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
        });
        setImageFile(null);
      }
    } catch (err) {
      alert('Failed to post item. Check if the backend server is running.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>List a New Item</h2>
      <form onSubmit={handleSubmit} className="p-4 shadow-sm bg-white rounded">
        <div className="mb-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Item Title" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
            required 
          />
        </div>
        <div className="mb-3">
          <textarea 
            className="form-control" 
            placeholder="Description (Condition, rarity, etc.)" 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Item Condition</label>
          <select 
            className="form-select" 
            value={formData.condition}
            onChange={(e) => setFormData({...formData, condition: e.target.value})}
          >
            <option value="Mint">Mint</option>
            <option value="Used">Used</option>
            <option value="Rare">Rare</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-select"
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
        <div className="mb-3">
          <label className="form-label">Availability</label>
          <select
            className="form-select"
            value={formData.availability}
            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
          >
            <option value="Available for Swap">Available for Swap</option>
            <option value="Private Collection">Private Collection</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Tags (comma separated)</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. rare, vintage, limited"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Picture (optional)</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => setImageFile(e.target.files[0] || null)}
          />
          {imageFile && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="preview"
                style={{ maxHeight: '150px' }}
              />
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-danger w-100">Post to SwapSphere</button>
      </form>
    </div>
  );
};

export default CreateListing;
