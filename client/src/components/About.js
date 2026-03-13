import React from 'react';

const About = () => {
  return (
    <section id="about" className="about section">
      {/* Section Title */}
      <div className="container section-title" data-aos="fade-up">
        <h2>About SwapSphere</h2>
        <p>Connecting enthusiasts and collectors through a sustainable, peer-to-peer exchange community.</p>
      </div>

      <div className="container">
        <div className="row gy-4">
          {/* Text Content */}
          <div className="col-lg-6 content" data-aos="fade-up" data-aos-delay="100">
            <p className="who-we-are">The Hobbyist's Haven</p>
            <h3>Trading Passion, One Item at a Time</h3>
            <p className="fst-italic">
              SwapSphere was built for those who value the story behind a collection. Whether you're looking for a rare board game, a vintage stamp, or a unique seed cutting, we make the exchange seamless.
            </p>
            <ul>
              <li>
                <i className="bi bi-check-circle"></i> 
                <span><strong>Curated Micro-Niches:</strong> Dedicated spaces for specific hobbies to ensure you find exactly what you're looking for.</span>
              </li>
              <li>
                <i className="bi bi-check-circle"></i> 
                <span><strong>Direct Peer-to-Peer Trading:</strong> Skip the middleman and connect directly with fellow collectors in a secure environment.</span>
              </li>
              <li>
                <i className="bi bi-check-circle"></i> 
                <span><strong>Sustainable Community:</strong> Promoting a circular economy by giving hobbyist items a second life through swapping rather than buying.</span>
              </li>
            </ul>
            <a href="#how-it-works" className="read-more">
              <span>Our Vision</span><i className="bi bi-arrow-right"></i>
            </a>
          </div>

          {/* Visual Content */}
          <div className="col-lg-6 about-images" data-aos="fade-up" data-aos-delay="200">
            <div className="row gy-4">
              <div className="col-lg-6">
                {/* Placeholder for hobby-related images */}
                <div className="placeholder-image">Image Placeholder</div>
              </div>
              <div className="col-lg-6">
                <div className="row gy-4">
                  <div className="col-lg-12">
                    <div className="placeholder-image">Image Placeholder</div>
                  </div>
                  <div className="col-lg-12">
                    <div className="placeholder-image">Image Placeholder</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;