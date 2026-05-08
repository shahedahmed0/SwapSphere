import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../config/api';
import HobbyBadge from '../HobbyBadge';

const IncomingRequestManager = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(apiUrl('/api/swaps/my-swaps'), {
          headers: { 'x-auth-token': localStorage.getItem('token') || '' }
        });
        const data = await response.json();

        if (response.ok) {
          setRequests(data.incomingRequests || []);
        } else {
          console.error(data.error || 'Failed to load requests');
        }
      } catch (err) {
        console.error('Failed to load requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (swapId) => {
    try {
      const response = await fetch(apiUrl(`/api/swaps/${swapId}/accept`), {
        method: 'PUT',
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });

      const data = await response.json();

      if (response.ok) {
        setRequests((prev) => prev.filter((req) => req._id !== swapId));
        alert('Swap accepted! Items have been marked as swapped.');
      } else {
        alert(data.error || 'Failed to accept swap.');
      }
    } catch (err) {
      alert('Network error occurred.');
    }
  };

  const handleDeclineLocal = (swapId) => {
    setRequests((prev) => prev.filter((req) => req._id !== swapId));
  };

  if (loading) return <div className="p-4">Loading requests...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Incoming Swap Requests</h2>
      {requests.length === 0 ?
      <p className="text-muted">No pending requests. Your items are safe!</p> :

      requests.map((request) =>
      <div key={request._id} className="card mb-3">
            <div className="card-body">
              <p className="mb-2">
                <strong>{request.requester?.username || 'A collector'}</strong>
                {request.requester?.hobbyNiche &&
                <span className="ms-2 align-middle">
                    <HobbyBadge niche={request.requester.hobbyNiche} />
                  </span>
                }
                {' '}wants to swap:
              </p>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="text-center flex-fill">
                  <p className="text-muted small mb-1">They offer:</p>
                  <p className="fw-semibold">{request.offeredItem?.title}</p>
                </div>
                <span className="mx-3 fs-3">🔄</span>
                <div className="text-center flex-fill">
                  <p className="text-muted small mb-1">For your:</p>
                  <p className="fw-semibold">{request.requestedItem?.title}</p>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
              onClick={() => handleAccept(request._id)}
              className="btn btn-success">
              
                  Accept Swap
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/negotiate/${request._id}`)}
                  className="btn btn-outline-primary">
                  Chat
                </button>
                <button
              onClick={() => handleDeclineLocal(request._id)}
              className="btn btn-outline-danger">
              
                  Decline
                </button>
              </div>
            </div>
          </div>
      )
      }
    </div>);

};

export default IncomingRequestManager;
