import React from 'react';
import { Link } from 'react-router-dom';

const Safety = () => {
  return (
    <>
      <section className="section light-background" style={{ paddingTop: '100px' }}>
        <div className="container" data-aos="fade-up">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-10">
              <p className="text-uppercase text-muted small fw-semibold mb-2">SwapSphere Safety Center</p>
              <h1 className="mb-3">Trade with confidence</h1>
              <p className="lead text-muted mb-0">
                This page expands on the safety ideas referenced across the homepage and services: verify listings, use in-app
                negotiation and reviews, and know how disputes are handled.
              </p>
            </div>
          </div>

          <div className="row gy-4">
            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex align-items-start gap-3">
                    <div className="icon flex-shrink-0 text-success fs-3">
                      <i className="bi bi-search" aria-hidden="true"></i>
                    </div>
                    <div>
                      <h3 className="h5">Before you swap</h3>
                      <p className="text-muted mb-0">
                        Read listing descriptions, condition notes, and photos carefully. Ask clarifying questions in{' '}
                        <Link to="/marketplace">negotiation</Link> before accepting a trade. If something feels off, walk away.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="150">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex align-items-start gap-3">
                    <div className="icon flex-shrink-0 text-success fs-3">
                      <i className="bi bi-chat-dots" aria-hidden="true"></i>
                    </div>
                    <div>
                      <h3 className="h5">Negotiation &amp; chat</h3>
                      <p className="text-muted mb-0">
                        Keep agreements and condition discussions in the app chat tied to your swap when possible. Clear
                        expectations reduce misunderstandings later.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex align-items-start gap-3">
                    <div className="icon flex-shrink-0 text-success fs-3">
                      <i className="bi bi-star" aria-hidden="true"></i>
                    </div>
                    <div>
                      <h3 className="h5">Reviews &amp; reputation</h3>
                      <p className="text-muted mb-0">
                        After a completed swap, leave an honest review on{' '}
                        <Link to="/transaction-history">History &amp; Reviews</Link>. Karma and ratings help the community spot
                        reliable traders over time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="250">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex align-items-start gap-3">
                    <div className="icon flex-shrink-0 text-success fs-3">
                      <i className="bi bi-shield-exclamation" aria-hidden="true"></i>
                    </div>
                    <div>
                      <h3 className="h5">Disputes &amp; reports</h3>
                      <p className="text-muted mb-0">
                        If an item arrives not as described, use the dispute report flow from your transaction history. Admins
                        can review cases when needed. Never share passwords or payment details in chat.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="300">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex align-items-start gap-3">
                    <div className="icon flex-shrink-0 text-success fs-3">
                      <i className="bi bi-geo-alt" aria-hidden="true"></i>
                    </div>
                    <div>
                      <h3 className="h5">Local handoffs</h3>
                      <p className="text-muted mb-0">
                        For in-person exchanges, meet in public places, bring a friend when practical, and inspect items before
                        finalizing. SwapSphere does not coordinate shipping or payments—plan logistics safely on your own terms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="350">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex align-items-start gap-3">
                    <div className="icon flex-shrink-0 text-success fs-3">
                      <i className="bi bi-person-lock" aria-hidden="true"></i>
                    </div>
                    <div>
                      <h3 className="h5">Account security</h3>
                      <p className="text-muted mb-0">
                        Use a strong password, sign out on shared devices, and treat DMs from strangers with caution. Official
                        notices will never ask for your password.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link to="/" className="btn btn-success me-2">
              Back to home
            </Link>
            <Link to="/how-it-works" className="btn btn-outline-success">
              How it works
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Safety;
