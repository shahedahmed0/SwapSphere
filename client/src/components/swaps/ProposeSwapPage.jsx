import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { apiUrl } from '../../config/api';

const ProposeSwapPage = () => {
  const navigate = useNavigate();
  const { itemId } = useParams();

  const [targetItem, setTargetItem] = useState(null);
  const [myItems, setMyItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdSwapId, setCreatedSwapId] = useState('');

  const token = useMemo(() => localStorage.getItem('token') || '', []);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const [itemRes, itemsRes] = await Promise.all([
        axios.get(apiUrl(`/api/items/${itemId}`)),
        axios.get(apiUrl('/api/items'), {
          headers: { 'x-auth-token': token }
        })]
        );

        if (!isMounted) return;

        setTargetItem(itemRes.data);

        const allItems = Array.isArray(itemsRes.data) ? itemsRes.data : [];
        const myId = localStorage.getItem('userId');
        const filtered = allItems.filter((item) => {
          const isOwner = myId && item.ownerId && item.ownerId === myId;
          return isOwner && item.isAvailable;
        });
        setMyItems(filtered);
      } catch (e) {
        if (!isMounted) return;
        setError('Failed to load swap details. Please try again.');
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [itemId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const wantsBundle = targetItem?.condition === 'Rare';
    const offeredItemIds = wantsBundle ? selectedItemIds : (selectedItemId ? [selectedItemId] : []);
    if (offeredItemIds.length === 0) return;
    if (wantsBundle && offeredItemIds.length < 2) {
      alert('Rare items require a bundle offer (2+ items).');
      return;
    }
    if (!targetItem?._id || !targetItem?.ownerId) {
      alert('This item is missing required info for swaps.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(apiUrl('/api/swaps/initiate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        body: JSON.stringify({
          receiverId: targetItem.ownerId,
          requestedItemId: targetItem._id,
          offeredItemIds
        })
      });

      const data = await response.json();
      if (response.ok) {
        const newSwapId = data?.swap?._id || '';
        if (newSwapId) setCreatedSwapId(newSwapId);
        alert('Swap request sent successfully!');
      } else {
        alert(data.error || 'Failed to send request.');
      }
    } catch (error) {
      alert('Network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
        <div>
          <h2 className="mb-1">Propose a Swap</h2>
          <p className="text-muted mb-0">Choose one of your items to offer for this listing.</p>
        </div>
        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {createdSwapId &&
      <div className="alert alert-success d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
          <div>
            <div className="fw-semibold">Swap request created.</div>
            <div className="small text-muted">You can start negotiating details in chat.</div>
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-success" onClick={() => navigate(`/negotiate/${createdSwapId}`)}>
              Chat
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/my-requests')}>
              View requests
            </button>
          </div>
        </div>
      }

      {isLoading ?
      <p className="text-muted">Loading swap details...</p> :
      error ?
      <p className="text-danger">{error}</p> :

      <div className="row g-4">
          <div className="col-lg-5">
            <div className="card">
              {targetItem?.imageUrl &&
            <img
              src={apiUrl(targetItem.imageUrl)}
              className="card-img-top"
              alt={targetItem.title} />

            }
              <div className="card-body">
                <div className="mb-2">
                  <span className="badge bg-success-subtle text-success border border-success-subtle">
                    Requested item
                  </span>
                </div>
                <h5 className="card-title">{targetItem?.title}</h5>
                {targetItem?.description && <p className="card-text">{targetItem.description}</p>}
                {targetItem?.condition &&
              <p className="text-muted mb-0">Condition: {targetItem.condition}</p>
              }
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Your offer</h5>

                {myItems.length === 0 ?
              <p className="text-danger small mb-0">
                    You don’t have any available items to trade yet. List an item first, then try again.
                  </p> :

              <form onSubmit={handleSubmit}>
                    {targetItem?.condition === 'Rare' ?
                    <div className="mb-3">
                        <label className="form-label">
                          Select 2+ items to offer (bundle swap for Rare)
                        </label>
                        <div className="list-group">
                          {myItems.map((item) => {
                            const checked = selectedItemIds.includes(item._id);
                            return (
                              <label key={item._id} className="list-group-item d-flex align-items-center gap-2">
                                <input
                                  className="form-check-input m-0"
                                  type="checkbox"
                                  checked={checked}
                                  onChange={(e) => {
                                    const next = e.target.checked
                                      ? [...selectedItemIds, item._id]
                                      : selectedItemIds.filter((id) => id !== item._id);
                                    setSelectedItemIds(next);
                                  }}
                                />
                                <span className="flex-grow-1">{item.title}</span>
                              </label>
                            );
                          })}
                        </div>
                        <div className="small text-muted mt-2">
                          Selected: {selectedItemIds.length}
                        </div>
                      </div> :
                    <div className="mb-3">
                        <label className="form-label">Select an item to offer</label>
                        <select
                          value={selectedItemId}
                          onChange={(e) => setSelectedItemId(e.target.value)}
                          className="form-select"
                          required
                        >
                          <option value="" disabled>
                            -- Select one of your items --
                          </option>
                          {myItems.map((item) =>
                            <option key={item._id} value={item._id}>
                              {item.title}
                            </option>
                          )}
                        </select>
                      </div>
                    }

                    <div className="d-flex justify-content-end gap-2">
                      <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                        Cancel
                      </button>
                      <button
                    type="submit"
                    className="btn btn-success"
                    disabled={
                      isSubmitting ||
                      myItems.length === 0 ||
                      (targetItem?.condition === 'Rare'
                        ? selectedItemIds.length < 2
                        : !selectedItemId)
                    }>
                    
                        {isSubmitting ? 'Sending...' : 'Confirm Swap Request'}
                      </button>
                    </div>
                  </form>
              }
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

};

export default ProposeSwapPage;
