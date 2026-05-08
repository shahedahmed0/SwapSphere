import React, { useState } from 'react';
import { apiUrl } from '../../config/api';

const ReviewForm = ({ swapId, revieweeId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(apiUrl('/api/swaps/review'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        body: JSON.stringify({ swapId, revieweeId, rating, comment })
      });

      if (response.ok) {
        alert('Review posted! Karma points have been updated.');
        onReviewSubmitted && onReviewSubmitted();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to post review.');
      }
    } catch (err) {
      alert('Network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-3 rounded bg-white mt-2">
      <h5 className="mb-2">Leave a Review</h5>

      <div className="mb-2">
        <label className="form-label">Rating (1-5 Stars)</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="form-select form-select-sm">
          
          <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
          <option value={4}>⭐⭐⭐⭐ (4 - Good)</option>
          <option value={3}>⭐⭐⭐ (3 - Okay)</option>
          <option value={2}>⭐⭐ (2 - Poor)</option>
          <option value={1}>⭐ (1 - Terrible)</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="form-label">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="How was the swap?"
          className="form-control"
          rows={2}
          maxLength={500}
          required />
        
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-sm btn-primary">
        
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>);

};

export default ReviewForm;
