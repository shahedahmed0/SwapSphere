import React from 'react';

const Hero = () => {
  return (
    <section id="hero" className="hero section dark-background" style={{ paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0, scrollMarginTop: 0 }}>
      <div id="hero-carousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000" tabIndex="0">
        <div className="carousel-item active">
          <img src="/assets/img/hero-carousel/hero-carousel-1.jpg" alt="Vintage Collection" />
          <div className="carousel-container">
            <h2>Your Hobby, Reimagined</h2>
            <p>Welcome to SwapSphere, a destination for hobbyists to trade, grow, and share their passions. Give your cherished items a new home and find your next treasure.</p>
            <a href="create-listing" className="btn-get-started">Start Swapping</a>
          </div>
        </div>

        <div className="carousel-item">
          <img src="/assets/img/hero-carousel/hero-carousel-2.jpg" alt="Board Games and Cards" />
          <div className="carousel-container">
            <h2>Discover Hidden Gems</h2>
            <p>From rare board games to vintage trading cards, explore micro-niches curated by enthusiasts just like you. The perfect trade is just one click away.</p>
            <a href="item-gallery" className="btn-get-started">Explore Marketplace</a>
          </div>
        </div>
        <div className="carousel-item">
          <img src="/assets/img/hero-carousel/hero-carousel-3.jpg" alt="Plant and Seed Exchange" />
          <div className="carousel-container">
            <h2>Sustainable Collecting</h2>
            <p>Join the circular economy. Swapping reduces waste and keeps the hobby alive by ensuring items circulate within the community instead of gathering dust.</p>
            <a href="#about" className="btn-get-started">Our Mission</a>
          </div>
        </div>

        <div className="carousel-item">
          <img src="/assets/img/hero-carousel/hero-carousel-4.jpg" alt="Enthusiast Community" />
          <div className="carousel-container">
            <h2>Connected Collectors</h2>
            <p>Trade with confidence using clear item details, direct messaging, and a growing network of passionate collectors.</p>
            <a href="#safety" className="btn-get-started">Safety First</a>
          </div>
        </div>

        <div className="carousel-item">
          <img src="/assets/img/hero-carousel/hero-carousel-5.jpg" alt="Listing Hobby Items" />
          <div className="carousel-container">
            <h2>Catalog Your Collection</h2>
            <p>Ready to move on to your next hobby? Easily list your items, track their condition, and manage swap requests all in one intuitive dashboard.</p>
            <a href="#featured-services" className="btn-get-started">List an Item</a>
          </div>
        </div>

        <a className="carousel-control-prev" href="#hero-carousel" role="button" data-bs-slide="prev">
          <span className="carousel-control-prev-icon bi bi-chevron-left" aria-hidden="true"></span>
        </a>
        <a className="carousel-control-next" href="#hero-carousel" role="button" data-bs-slide="next">
          <span className="carousel-control-next-icon bi bi-chevron-right" aria-hidden="true"></span>
        </a>

        <ol className="carousel-indicators">
          <li data-bs-target="#hero-carousel" data-bs-slide-to="0" className="active"></li>
          <li data-bs-target="#hero-carousel" data-bs-slide-to="1"></li>
          <li data-bs-target="#hero-carousel" data-bs-slide-to="2"></li>
          <li data-bs-target="#hero-carousel" data-bs-slide-to="3"></li>
          <li data-bs-target="#hero-carousel" data-bs-slide-to="4"></li>
        </ol>
      </div>
    </section>
  );
};

export default Hero;
