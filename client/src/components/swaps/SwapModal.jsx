import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../config/api';





const SwapModal = ({ isOpen, onClose, targetItem }) => {
  const navigate = useNavigate();
  const [myItems, setMyItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdSwapId, setCreatedSwapId] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchMyInventory = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(apiUrl('/api/items'), {
            headers: { 'x-auth-token': localStorage.getItem('token') || '' }
          });
          const data = await response.json();
          if (response.ok && Array.isArray(data)) {
            const myId = localStorage.getItem('userId');
            const filtered = data.filter((item) => {
              const isOwner = myId && item.ownerId && item.ownerId === myId;
              return isOwner && item.isAvailable;
            });
            setMyItems(filtered);
          } else {
            setMyItems([]);
          }
        } catch (error) {
          console.error('Failed to load inventory', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchMyInventory();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItemId) return alert('Please select an item to offer!');

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
          offeredItemId: selectedItemId
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0" style={{ zIndex: 1055, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="bg-white rounded-4 shadow-lg w-100" style={{ maxWidth: '520px', position: 'relative' }}>
        <div className="p-4 p-md-4">
          <button
            onClick={onClose}
            className="btn-close"
            style={{ position: 'absolute', top: 14, right: 16 }}
            aria-label="Close" />
          

          <div className="mb-3">
            <span className="badge bg-success-subtle text-success border border-success-subtle">
              Swap Prompt
            </span>
          </div>

          <h2 className="h4 mb-2">Propose a Swap</h2>
          <p className="mb-3 text-muted">
            You’re requesting <strong>{targetItem?.title}</strong>. Choose one of your available items to offer in return.
          </p>

          {createdSwapId &&
          <div className="alert alert-success d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
              <div className="small">
                Swap request created. Start negotiating in chat.
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={() => {
                    onClose();
                    navigate(`/negotiate/${createdSwapId}`);
                  }}>
                  Chat
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          }

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                Your item to offer
              </label>

              {isLoading ?
              <p className="text-muted small">Loading your inventory...</p> :
              myItems.length === 0 ?
              <p className="text-danger small">
                  You don’t have any available items to trade yet. List an item first, then try again.
                </p> :

              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="form-select"
                required>
                
                  <option value="" disabled>
                    -- Select one of your items --
                  </option>
                  {myItems.map((item) =>
                <option key={item._id} value={item._id}>
                      {item.title}
                    </option>
                )}
                </select>
              }
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline-secondary">
                
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || myItems.length === 0 || !selectedItemId}
                className="btn btn-success">
                
                {isSubmitting ? 'Sending...' : 'Confirm Swap Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>);

};

export default SwapModal;
