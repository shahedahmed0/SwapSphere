import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import { apiUrl } from '../../config/api';
import HobbyBadge from '../HobbyBadge';

const TransactionHistory = ({ userId, userProfile }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportingId, setReportingId] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(apiUrl('/api/swaps/my-swaps'), {
          headers: { 'x-auth-token': localStorage.getItem('token') || '' }
        });
        setHistory(res.data.history || []);
      } catch (err) {
        console.error('Failed to fetch transaction history', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const reportSwap = async (swapId) => {
    const reason = window.prompt('Report reason (e.g., "Used item labeled Mint")');
    if (!reason) return;
    try {
      setReportingId(swapId);
      await axios.post(apiUrl('/api/disputes'), { swapId, reason }, {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      alert('Report submitted. Admins can review it in the dispute portal.');
    } catch (e) {
      alert('Failed to submit report.');
    } finally {
      setReportingId('');
    }
  };

  if (loading) return <div className="p-4 text-center">Loading transaction history...</div>;

  return (
    <div className="container mt-4 pb-5">
      <h2 className="mb-2 text-center">Your Transaction History</h2>
      <p className="text-center text-muted mb-4">Completed swaps, reviews, and your community reputation.</p>

      <div className="row justify-content-center mb-4">
        <div className="col-lg-10">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-body p-4 p-md-5 text-center" style={{ background: '#0f172a', color: '#e5e7eb' }}>
              <h3 className="h4 mb-3" style={{ color: '#f9fafb' }}>Reputation &amp; Karma</h3>
              {userProfile ?
              <>
                  <p className="mb-3 mb-md-2">
                    Your Karma reflects how trusted you are on SwapSphere. Earn points for great trades and fair reviews.
                  </p>
                  <div className="d-flex justify-content-center align-items-center gap-3 mt-3 flex-wrap">
                    <div className="reputation-chip">
                      <span>⭐ Rating:</span>
                      <span>{userProfile.rating > 0 ? userProfile.rating.toFixed(1) : 'Unrated'}/5</span>
                    </div>
                    <div className="reputation-chip">
                      <span>🔥 Karma:</span>
                      <span>{userProfile.karmaPoints} pts</span>
                    </div>
                    <div className="reputation-chip">
                      <span>✅ Reviews:</span>
                      <span>{userProfile.reviewCount}</span>
                    </div>
                  </div>
                  <p className="small mt-3 mb-0" style={{ color: '#94a3b8' }}>
                    Strong ratings and Karma make your swap requests more attractive to other collectors.
                  </p>
                </> :

              <>
                  <p className="mb-2">
                    Trade fairly, collect positive reviews, and grow your Karma to build trusted status in the community.
                  </p>
                  <p className="small mb-0" style={{ color: '#94a3b8' }}>
                    Complete swaps from this page and leave honest reviews to grow your reputation.
                  </p>
                </>
              }
            </div>
          </div>
        </div>
      </div>

      {history.length === 0 ?
      <p className="text-center text-muted">
          You haven't completed any swaps yet!
        </p> :

      <div className="row">
          {history.map((swap) => {
          const isRequester = swap.requester?._id === userId;
          const tradePartner = isRequester ? swap.receiver : swap.requester;

          return (
            <div key={swap._id} className="col-md-6 mb-3">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-success">{swap.status}</span>
                      <small className="text-muted">
                        {swap.updatedAt ?
                      new Date(swap.updatedAt).toLocaleDateString() :
                      ''}
                      </small>
                    </div>

                    <div className="d-flex justify-content-between text-center mb-3">
                      <div className="flex-fill">
                        <div className="text-muted small">You Traded</div>
                        <div className="fw-semibold">
                          {isRequester ?
                        swap.offeredItem?.title :
                        swap.requestedItem?.title}
                        </div>
                      </div>
                      <div className="mx-3 fs-3 text-muted">🔄</div>
                      <div className="flex-fill">
                        <div className="text-muted small">You Received</div>
                        <div className="fw-semibold">
                          {isRequester ?
                        swap.requestedItem?.title :
                        swap.offeredItem?.title}
                        </div>
                      </div>
                    </div>

                    <div className="bg-light p-3 rounded mt-auto">
                      <div className="mb-2">
                        <strong>Trade Partner:</strong>{' '}
                        {tradePartner?.username || tradePartner?.name || 'Collector'}
                        {tradePartner?.hobbyNiche &&
                        <span className="ms-2 align-middle">
                            <HobbyBadge niche={tradePartner.hobbyNiche} />
                          </span>
                        }
                      </div>
                      <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap mb-2">
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => reportSwap(swap._id)}
                          disabled={reportingId === swap._id}>
                          {reportingId === swap._id ? 'Reporting...' : 'Report dispute'}
                        </button>
                        <span className="small text-muted">For issues like “Used labeled Mint”.</span>
                      </div>
                      <ReviewForm
                      swapId={swap._id}
                      revieweeId={tradePartner?._id}
                      onReviewSubmitted={() => window.location.reload()} />
                    
                    </div>
                  </div>
                </div>
              </div>);

        })}
        </div>
      }
    </div>);

};

export default TransactionHistory;
