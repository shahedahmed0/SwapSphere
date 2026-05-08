import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../config/api';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }
      const res = await axios.get(apiUrl('/api/items/wishlist/me'), {
        headers: {
          'x-auth-token': token
        }
      });
      setWishlistItems(res.data || []);
    } catch (error) {
      console.error('Failed to load wishlist', error);
    } finally {
      setLoading(false);
    }
  };

  const removeWishlist = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await axios.delete(apiUrl(`/api/items/wishlist/${itemId}`), {
        headers: {
          'x-auth-token': token
        }
      });
      await fetchWishlist();
    } catch (error) {
      console.error('Failed to update wishlist', error);
    }
  };

  useEffect(() => {
    fetchWishlist();

  }, []);

  if (loading) {
    return <div className="container mt-4">Loading wishlist...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>My Wishlist</h2>
      {wishlistItems.length === 0 &&
      <p className="text-muted mt-3">You have no items in your wishlist yet.</p>
      }
      <div className="row">
        {wishlistItems.map((item) =>
        <div className="col-md-4 mb-3" key={item._id}>
            <div className="card h-100">
              {item.imageUrl &&
            <img
              src={apiUrl(item.imageUrl)}
              className="card-img-top"
              alt={item.title} />

            }
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">{item.description}</p>
                <p className="mb-1">
                  <strong>Condition:</strong> {item.condition}
                </p>
                {item.location &&
              <p className="mb-1">
                    <strong>Location:</strong> {item.location}
                  </p>
              }
                <button
                className="btn btn-danger btn-sm mt-2"
                onClick={() => removeWishlist(item._id)}>
                
                  Remove from Wishlist
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>);

};

export default Wishlist;
