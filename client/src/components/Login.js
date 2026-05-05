import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiUrl } from '../config/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Login successful');
        navigate('/');
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
      paddingTop: '120px',
      backgroundColor: '#f8f9fa'
    }}>
      <div className="container" data-aos="fade-up">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
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
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required />
                    
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ color: '#444' }}>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter password"
                      style={{ borderRadius: '8px', padding: '0.75rem' }}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required />
                    
                  </div>
                  <button type="submit" className="btn btn-success w-100 py-2 fw-bold rounded-3">
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
    </section>);

};

export default Login;
