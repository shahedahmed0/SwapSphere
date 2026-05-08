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
              <i className="bi bi-shop icon flex-shrink-0"></i>
              <div>
                <h4 className="title"><Link to="/marketplace" className="stretched-link">Marketplace Discovery</Link></h4>
                <p className="description">Browse listings with search and filters for category, location, tags, and availability.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6" data-aos="fade-up" data-aos-delay="200">
            <div className="service-item d-flex position-relative h-100">
              <i className="bi bi-arrow-left-right icon flex-shrink-0"></i>
              <div>
                <h4 className="title"><Link to="/my-requests" className="stretched-link">Swap Requests</Link></h4>
                <p className="description">Send swap proposals and manage incoming requests with realtime notifications.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6" data-aos="fade-up" data-aos-delay="300">
            <div className="service-item d-flex position-relative h-100">
              <i className="bi bi-stars icon flex-shrink-0"></i>
              <div>
                <h4 className="title"><Link to="/marketplace" className="stretched-link">Smart Match Suggestions</Link></h4>
                <p className="description">Get item suggestions based on your wishlist, so you can find better matches faster.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6" data-aos="fade-up" data-aos-delay="400">
            <div className="service-item d-flex position-relative h-100">
              <i className="bi bi-person-badge icon flex-shrink-0"></i>
              <div>
                <h4 className="title"><Link to="/transaction-history" className="stretched-link">Reputation & Reviews</Link></h4>
                <p className="description">Complete swaps and leave reviews to grow karma and build trust in your niche.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6" data-aos="fade-up" data-aos-delay="500">
            <div className="service-item d-flex position-relative h-100">
              <i className="bi bi-bell icon flex-shrink-0"></i>
              <div>
                <h4 className="title"><Link to="/wishlist" className="stretched-link">Wishlist</Link></h4>
                <p className="description">Save items you want and use it to power Smart Match recommendations.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6" data-aos="fade-up" data-aos-delay="600">
            <div className="service-item d-flex position-relative h-100">
              <i className="bi bi-file-earmark-arrow-down icon flex-shrink-0"></i>
              <div>
                <h4 className="title"><Link to="/export" className="stretched-link">Inventory Export</Link></h4>
                <p className="description">Export your private collection and transaction history to CSV or PDF.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>);

};

export default Services;
