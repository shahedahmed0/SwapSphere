import React from 'react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <div>
          <h2 className="mb-1">How SwapSphere Works</h2>
          <p className="text-muted mb-0">A quick walkthrough from listing to completed swap.</p>
        </div>
        <Link className="btn btn-outline-primary" to="/marketplace">Browse Marketplace</Link>
      </div>

      <div className="row g-3">
        <div className="col-md-6 col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="fw-semibold mb-2">1) Create your collector profile</div>
              <p className="text-muted mb-0">
                Pick your primary hobby niche so others can recognize your community identity quickly.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="fw-semibold mb-2">2) List items</div>
              <p className="text-muted mb-0">
                Add condition, category, tags, and availability (“Available for Swap” vs “Private Collection”).
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="fw-semibold mb-2">3) Build your wishlist</div>
              <p className="text-muted mb-0">
                Save listings you’re hunting for—this powers Smart Match suggestions in the Marketplace.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="fw-semibold mb-2">4) Propose swaps</div>
              <p className="text-muted mb-0">
                Offer one item for most listings, or bundle 2+ items when requesting a “Rare” item.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="fw-semibold mb-2">5) Negotiate via chat</div>
              <p className="text-muted mb-0">
                Use “My Negotiations” to discuss shipping, meetups, bundle details, and timing.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="fw-semibold mb-2">6) Confirm and review</div>
              <p className="text-muted mb-0">
                After a swap is completed, leave a review to build trust (karma + rating).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;

