import React from 'react';

const FeaturedServices = () => {
  return (
    <section id="featured-services" className="featured-services section dark-background">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="100">
            <div className="icon flex-shrink-0"><i className="bi bi-box-seam"></i></div>
            <div>
              <h4 className="title">Easy Cataloging</h4>
              <p className="description">Quickly list your hobby items with specialized tags for condition, rarity, and category to show them off to the community.</p>
              <a href="item-gallery" className="readmore stretched-link"><span>View Listings</span><i className="bi bi-arrow-right"></i></a>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="200">
            <div className="icon flex-shrink-0"><i className="bi bi-arrow-repeat"></i></div>
            <div>
              <h4 className="title">Seamless Swapping</h4>
              <p className="description">Propose trades directly with other collectors. A secure request system helps you track the exchange from start to finish.</p>
              <a href="#how-it-works" className="readmore stretched-link"><span>How it Works</span><i className="bi bi-arrow-right"></i></a>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="300">
            <div className="icon flex-shrink-0"><i className="bi bi-shield-check"></i></div>
            <div>
              <h4 className="title">Safe Swapping</h4>
              <p className="description">Trade with confidence using clear item details, transparent swap terms, and safety guidelines tailored for hobbyists.</p>
              <a href="#safety" className="readmore stretched-link"><span>Safety Center</span><i className="bi bi-arrow-right"></i></a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
