import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../config/api';

const AdminDisputesPage = () => {
  const token = useMemo(() => localStorage.getItem('token') || '', []);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(apiUrl('/api/admin/disputes'), {
        headers: { 'x-auth-token': token }
      });
      setDisputes(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError('Failed to load disputes (admin only).');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(apiUrl(`/api/admin/disputes/${id}`), { status }, {
        headers: { 'x-auth-token': token }
      });
      await load();
    } catch (e) {
      alert('Failed to update dispute.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
        <div>
          <h2 className="mb-1">Admin Dispute Resolution</h2>
          <p className="text-muted mb-0">Review flagged swaps/items and resolve reports.</p>
        </div>
        <button type="button" className="btn btn-outline-secondary" onClick={load} disabled={loading}>
          Refresh
        </button>
      </div>

      {loading && <p className="text-muted">Loading disputes...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && disputes.length === 0 && (
        <p className="text-muted">No disputes found.</p>
      )}

      <div className="row g-3">
        {disputes.map((d) => (
          <div key={d._id} className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
                  <div>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="badge bg-warning text-dark">{d.status}</span>
                      <span className="fw-semibold">{d.reason}</span>
                    </div>
                    <div className="small text-muted mt-1">
                      Reported by: {d.createdBy?.username || 'User'} {d.createdBy?.email ? `(${d.createdBy.email})` : ''}
                      {' '}• {d.createdAt ? new Date(d.createdAt).toLocaleString() : ''}
                    </div>
                    {d.details && <div className="mt-2">{d.details}</div>}
                  </div>

                  <div className="d-flex gap-2 align-items-start">
                    <button className="btn btn-outline-primary btn-sm" onClick={() => updateStatus(d._id, 'Under Review')}>
                      Under Review
                    </button>
                    <button className="btn btn-success btn-sm" onClick={() => updateStatus(d._id, 'Resolved')}>
                      Resolve
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => updateStatus(d._id, 'Dismissed')}>
                      Dismiss
                    </button>
                  </div>
                </div>

                {(d.itemId || d.swapId) && (
                  <div className="mt-3 small">
                    {d.itemId && <div><strong>Item:</strong> {d.itemId.title || d.itemId._id}</div>}
                    {d.swapId && <div><strong>Swap:</strong> {d.swapId._id}</div>}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDisputesPage;
