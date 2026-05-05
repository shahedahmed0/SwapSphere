import React, { useMemo, useState } from 'react';
import { API_BASE_URL } from '../config/api';

const ExportPage = () => {
  const token = useMemo(() => localStorage.getItem('token') || '', []);
  const [format, setFormat] = useState('csv');
  const [scope, setScope] = useState('private');

  const openDownload = (path) => {
    fetch(`${API_BASE_URL}${path}`, {
      headers: { 'x-auth-token': token }
    })
      .then(async (r) => {
        if (!r.ok) throw new Error('export failed');
        const blob = await r.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const cd = r.headers.get('content-disposition') || '';
        const match = cd.match(/filename="([^"]+)"/);
        a.download = match ? match[1] : 'export';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => alert('Export failed. Are you logged in?'));
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-2">Inventory Export</h2>
      <p className="text-muted">
        Export your Private Collection or transaction history to CSV/PDF for your records.
      </p>

      <div className="card">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Format</label>
              <select className="form-select" value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Inventory scope</label>
              <select className="form-select" value={scope} onChange={(e) => setScope(e.target.value)}>
                <option value="private">Private Collection</option>
                <option value="all">All my items</option>
              </select>
            </div>
            <div className="col-md-5 d-flex gap-2 flex-wrap">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => openDownload(`/api/export/inventory?format=${format}&scope=${scope}`)}
              >
                Export inventory
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => openDownload(`/api/export/history?format=${format}`)}
              >
                Export transaction history
              </button>
            </div>
          </div>
          {!token && (
            <div className="alert alert-warning mt-3 mb-0">
              You must be logged in to export.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportPage;

