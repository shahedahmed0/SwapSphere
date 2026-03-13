import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Login successful');
        // Navigate to home or dashboard
        window.location.href = '/';
      } else {
        alert(data.msg);
      }
    } catch (error) {
      alert('Server error');
    }
  };

  return (
    <section id="login" className="login section" style={{ 
      minHeight: '100vh', 
      paddingTop: '120px', // Increased padding to prevent header overlap
      backgroundColor: '#f8f9fa' 
    }}>
      <div className="container" data-aos="fade-up">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  {/* Strong Professional Charcoal Color */}
                  <h2 className="fw-bold" style={{ color: '#2c3e50', letterSpacing: '1px' }}>SwapSphere</h2>
                  <p className="text-muted">Welcome back, Hobbyist!</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: '#444' }}>Email Address</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="name@example.com"
                      style={{ borderRadius: '8px', padding: '0.75rem' }}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ color: '#444' }}>Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="Enter password"
                      style={{ borderRadius: '8px', padding: '0.75rem' }}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required 
                    />
                  </div>
                  {/* Button changed to a strong professional color */}
                  <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" style={{ backgroundColor: '#2c3e50', border: 'none', borderRadius: '8px' }}>
                    Sign In
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="mb-0 small">Don't have an account? <Link to="/register" style={{ color: '#e84545', fontWeight: '600', textDecoration: 'none' }}>Join the community</Link></p>
                  <Link to="/" className="d-block mt-3 text-secondary small">← Back to Home</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
