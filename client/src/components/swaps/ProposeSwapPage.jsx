import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const ProposeSwapPage = () => {
  const { itemId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [targetItem, setTargetItem] = useState(location.state && location.state.targetItem ? location.state.targetItem : null);
  const [myItems, setMyItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTarget, setIsLoadingTarget] = useState(!targetItem);

  useEffect(() => {
    const loadTargetItem = async () => {
      if (targetItem) {
        setIsLoadingTarget(false);
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/api/items');
        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          const found = data.find((item) => item._id === itemId);
          setTargetItem(found || null);
        } else {
          setTargetItem(null);
        }
      } catch (err) {
        setTargetItem(null);
      } finally {
        setIsLoadingTarget(false);
      }
    };
    loadTargetItem();
  }, [itemId, targetItem]);

  useEffect(() => {
    const fetchMyInventory = async () => {
      setIsLoadingInventory(true);
      try {
        const response = await fetch('http://localhost:5000/api/items', {
          headers: { 'x-auth-token': localStorage.getItem('token') || '' },
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
        setMyItems([]);
      } finally {
        setIsLoadingInventory(false);
      }
    };
    fetchMyInventory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItemId || !targetItem) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/swaps/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || '',
        },
        body: JSON.stringify({
          receiverId: targetItem.ownerId,
          requestedItemId: targetItem._id,
          offeredItemId: selectedItemId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Swap request sent successfully!');
        navigate(-1);
      } else {
        alert(data.error || 'Failed to send request.');
      }
    } catch (error) {
      alert('Network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingTarget) {
    return <div className="container mt-5">Loading swap details...</div>;
  }

  if (!targetItem) {
    return <div className="container mt-5">Item not found.</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-3">Propose a Swap</h2>
      <p className="mb-3 text-muted">
        You are requesting <strong>{targetItem.title}</strong>. Choose one of your available items to offer in return.
      </p>

      <form onSubmit={handleSubmit} className="p-4 shadow-sm bg-white rounded">
        <div className="mb-3">
          <label className="form-label">
            Your item to offer
          </label>

          {isLoadingInventory ? (
            <p className="text-muted small">Loading your inventory...</p>
          ) : myItems.length === 0 ? (
            <p className="text-danger small">
              You do not have any available items to trade yet. List an item first, then try again.
            </p>
          ) : (
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="form-select"
              required
            >
              <option value="" disabled>
                -- Select one of your items --
              </option>
              {myItems.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.title}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-outline-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || myItems.length === 0 || !selectedItemId}
            className="btn btn-success"
          >
            {isSubmitting ? 'Sending...' : 'Confirm Swap Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProposeSwapPage;

