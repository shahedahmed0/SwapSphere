import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <section id="services" className="services section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Platform Features</h2>
        <p>Everything you need to find, trade, and manage your hobby collections in one place.</p>
      </div>

      <div className="container">
        <div className="row gy-4">
          <div className="col-md-6" data-aos="fade-up" data-aos-delay="100">
            <div className="service-item d-flex position-relative h-100">
              <i className="bi bi-collection icon flex-shrink-0"></i>
              <div>
                <h4 className="title"><Link to="/inventory" className="stretched-link">Personal Vault</Link></h4>
                <p className="description">Catalog your entire collection with high-quality photos, condition reports, and rarity tags to show fellow collectors what you have.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6" data-aos="fade-up" data-aos-delay="200">
            <div className="service-item d-flex position-relative h-100">
              <i className="bi bi-arrow-left-right icon flex-shrink-0"></i>
              <div>
                <h4 className="title"><Link to="/swaps" className="stretched-link">Smart Swap Requests</Link></h4>
                <p className="description">Send and receive 1-on-1 swap proposals. Our system tracks negotiations and helps finalize the deal securely.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6" data-aos="fade-up" data-aos-delay="300">
            <div className="service-item d-flex position-relative h-100">
              <i className="bi bi-search icon flex-shrink-0"></i>
              <div>
                <h4 className="title"><Link to="/marketplace" className="stretched-link">Advanced Discovery</Link></h4>
                <p className="description">Use powerful filters to search by hobby niche, item condition, or geographical location to find local traders.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6" data-aos="fade-up" data-aos-delay="400">
            <div className="service-item d-flex position-relative h-100">
              <i className="bi bi-person-badge icon flex-shrink-0"></i>
              <div>
                <h4 className="title"><Link to="/reputation" className="stretched-link">Collector Reputation</Link></h4>
                <p className="description">Build trust within the community through our rating system. Verified successful swaps increase your collector score.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6" data-aos="fade-up" data-aos-delay="500">
            <div className="service-item d-flex position-relative h-100">
              <i className="bi bi-bell icon flex-shrink-0"></i>
              <div>
                <h4 className="title"><Link to="/alerts" className="stretched-link">Wishlist Notifications</Link></h4>
                <p className="description">Add rare items to your wishlist and get notified the moment another hobbyist lists them for trade.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6" data-aos="fade-up" data-aos-delay="600">
            <div className="service-item d-flex position-relative h-100">
              <i className="bi bi-chat-quote icon flex-shrink-0"></i>
              <div>
                <h4 className="title"><Link to="/messages" className="stretched-link">Secure Messaging</Link></h4>
                <p className="description">Discuss item details and coordinate swap logistics directly with other users through the integrated chat system.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Services;
