import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../config/api';
import HobbyBadge from './HobbyBadge';

const ItemGallery = ({ isAuthenticated, userId }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [availability, setAvailability] = useState('all');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (availability !== 'all') params.availability = availability;
      if (location.trim()) params.location = location.trim();

      const res = await axios.get(apiUrl('/api/items'), {
        params
      });
      setItems(res.data);
    } catch (err) {
      console.error('failed to fetch items', err);
      setError('Failed to load items. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [availability, category, location, search]);

  const fetchSuggestions = useCallback(async () => {
    try {
      if (!isAuthenticated) return;
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get(apiUrl('/api/items/suggestions'), {
        headers: { 'x-auth-token': token }
      });
      setSuggestions(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setSuggestions([]);
    }
  }, [isAuthenticated]);

  const goToProposeSwap = (item) => {
    navigate(`/propose-swap/${item._id}`);
  };

  useEffect(() => {
    fetchItems();
    fetchSuggestions();

  }, [fetchItems, fetchSuggestions]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('All');
    setAvailability('all');
    setLocation('');
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
        apiUrl(`/api/items/${itemId}/toggle-availability`),
        {},
        {
          headers: { 'x-auth-token': token }
        }
      );
      const updated = res.data;
      setItems((prev) =>
      prev.map((it) => it._id === updated._id ? updated : it)
      );
    } catch (err) {
      console.error('Failed to toggle availability', err);
      alert('Failed to update availability.');
    }
  };

  const handleAddToWishlist = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to use wishlist.');
        return;
      }
      await axios.post(
        apiUrl(`/api/items/wishlist/${itemId}`),
        {},
        {
          headers: { 'x-auth-token': token }
        }
      );
      alert('Added to wishlist!');
    } catch (err) {
      console.error('Failed to add to wishlist', err);
      alert('Failed to add to wishlist.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Marketplace</h2>

      {isAuthenticated && suggestions.length > 0 &&
      <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
              <div>
                <div className="fw-semibold">Smart Match suggestions</div>
                <div className="small text-muted">Based on your wishlist.</div>
              </div>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={fetchSuggestions}>
                Refresh
              </button>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {suggestions.slice(0, 8).map((s) =>
              <button
                key={s._id}
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => navigate(`/propose-swap/${s._id}`)}
                title={`Match score: ${s.matchScore || 0}`}>
                {s.title}
              </button>
              )}
            </div>
          </div>
        </div>
      }

      <form className="row g-3 mb-4" onSubmit={handleApplyFilters}>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by keyword or tags"
            value={search}
            onChange={(e) => setSearch(e.target.value)} />
          
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}>
            
            <option value="All">All Categories</option>
            <option value="Cards">Cards</option>
            <option value="Coins">Coins</option>
            <option value="Books">Books</option>
            <option value="Board Games">Board Games</option>
            <option value="Plants">Plants</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}>
            
            <option value="all">All Items</option>
            <option value="available">Available for Swap</option>
            <option value="private">Private Collection</option>
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by location"
            value={location}
            onChange={(e) => setLocation(e.target.value)} />
          
        </div>
        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            Apply Filters
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleClearFilters}>
            
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
                {it.imageUrl &&
                <img
                  src={apiUrl(it.imageUrl)}
                  className="card-img-top"
                  alt={it.title} />

                }
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{it.title}</h5>
                  <p className="card-text">{it.description}</p>
                  <p className="text-muted mb-1">Condition: {it.condition}</p>
                  {it.ownerHobbyNiche &&
                  <div className="mb-2">
                      <HobbyBadge niche={it.ownerHobbyNiche} />
                    </div>
                  }
                  {it.category &&
                  <p className="text-muted mb-1">Category: {it.category}</p>
                  }
                  {it.location &&
                  <p className="text-muted mb-1">Location: {it.location}</p>
                  }
                  {Array.isArray(it.tags) && it.tags.length > 0 &&
                  <p className="small text-muted mb-2">
                      Tags: {it.tags.join(', ')}
                    </p>
                  }
                  <p className="fw-semibold mt-auto">
                    Status:{' '}
                    {it.availability || (it.isAvailable ? 'Available for Swap' : 'Private Collection')}
                  </p>

                  <div className="d-flex gap-2 mt-2">
                    {isAuthenticated &&
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleAddToWishlist(it._id)}>
                      
                        Add to Wishlist
                      </button>
                    }
                    {isAuthenticated && isOwner &&
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleToggleAvailability(it._id)}>
                      
                        Toggle Availability
                      </button>
                    }
                    {isAuthenticated && !isOwner &&
                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm swap-prompt-btn"
                      onClick={() => goToProposeSwap(it)}>
                      
                        Propose Swap
                      </button>
                    }
                  </div>
                </div>
              </div>
            </div>);

        })}
        {!loading && items.length === 0 && !error &&
        <p className="text-muted">No items found for the selected filters.</p>
        }
      </div>
    </div>);

};

export default ItemGallery;
