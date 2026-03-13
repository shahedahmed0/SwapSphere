import React, { useEffect } from 'react';

const Stats = () => {
  useEffect(() => {
    if (window.PureCounter) {
      new window.PureCounter();
    }
  }, []);

  return (
    <section id="stats" className="stats section light-background">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row gy-4">
          <div className="col-lg-3 col-md-6">
            <div className="stats-item text-center w-100 h-100">
              <span data-purecounter-start="0" data-purecounter-end="1250" data-purecounter-duration="1" className="purecounter"></span>
              <p>Active Collectors</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item text-center w-100 h-100">
              <span data-purecounter-start="0" data-purecounter-end="3420" data-purecounter-duration="1" className="purecounter"></span>
              <p>Successful Swaps</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item text-center w-100 h-100">
              <span data-purecounter-start="0" data-purecounter-end="8500" data-purecounter-duration="1" className="purecounter"></span>
              <p>Items Listed</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item text-center w-100 h-100">
              <span data-purecounter-start="0" data-purecounter-end="45" data-purecounter-duration="1" className="purecounter"></span>
              <p>Hobby Niches</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Stats;
