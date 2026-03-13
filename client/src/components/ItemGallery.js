import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ItemGallery = ({ isAuthenticated, userId }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [availability, setAvailability] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (availability !== 'all') params.availability = availability;

      const res = await axios.get('http://localhost:5000/api/items', {
        params,
      });
      setItems(res.data);
    } catch (err) {
      console.error('failed to fetch items', err);
      setError('Failed to load items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitial = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get('http://localhost:5000/api/items');
        setItems(res.data);
      } catch (err) {
        setError('Failed to load items. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, []);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('All');
    setAvailability('all');
    fetchItems();
  };

  const handleToggleAvailability = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to update availability.');
        return;
      }
      const res = await axios.patch(
        `http://localhost:5000/api/items/${itemId}/toggle-availability`,
        {},
        {
          headers: { 'x-auth-token': token },
        }
      );
      const updated = res.data;
      setItems((prev) =>
        prev.map((it) => (it._id === updated._id ? updated : it))
      );
    } catch (err) {
      console.error('Failed to toggle availability', err);
      alert('Failed to update availability.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Marketplace</h2>

      <form className="row g-3 mb-4" onSubmit={handleApplyFilters}>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by keyword or tags"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Cards">Cards</option>
            <option value="Coins">Coins</option>
            <option value="Books">Books</option>
            <option value="Board Games">Board Games</option>
            <option value="Plants">Plants</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option value="all">All Items</option>
            <option value="available">Available for Swap</option>
            <option value="private">Private Collection</option>
          </select>
        </div>
        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            Apply Filters
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleClearFilters}
          >
            Clear
          </button>
        </div>
      </form>

      {loading && <p>Loading items...</p>}
      {error && <p className="text-danger">{error}</p>}

      <div className="row">
        {items.map((it) => {
          const isOwner = userId && it.ownerId && it.ownerId === userId;
          return (
            <div key={it._id} className="col-md-4 mb-4">
            <div className="card h-100 swap-card">
                {it.imageUrl && (
                  <img
                    src={`http://localhost:5000${it.imageUrl}`}
                    className="card-img-top"
                    alt={it.title}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{it.title}</h5>
                  <p className="card-text">{it.description}</p>
                  <p className="text-muted mb-1">Condition: {it.condition}</p>
                  {it.category && (
                    <p className="text-muted mb-1">Category: {it.category}</p>
                  )}
                  {Array.isArray(it.tags) && it.tags.length > 0 && (
                    <p className="small text-muted mb-2">
                      Tags: {it.tags.join(', ')}
                    </p>
                  )}
                  <p className="fw-semibold mt-auto">
                    Status:{' '}
                    {it.availability || (it.isAvailable ? 'Available for Swap' : 'Private Collection')}
                  </p>

                  <div className="d-flex gap-2 mt-2">
                    {isAuthenticated && isOwner && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleToggleAvailability(it._id)}
                      >
                        Toggle Availability
                      </button>
                    )}
                    {isAuthenticated && !isOwner && (
                      <button
                        type="button"
                        className="btn btn-outline-success btn-sm swap-prompt-btn"
                        onClick={() => navigate(`/propose-swap/${it._id}`, { state: { targetItem: it } })}
                      >
                        Propose Swap
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {!loading && items.length === 0 && !error && (
          <p className="text-muted">No items found for the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default ItemGallery;
