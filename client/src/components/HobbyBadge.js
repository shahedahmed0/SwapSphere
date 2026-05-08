import React from 'react';

const HobbyBadge = ({ niche }) => {
  const badgeStyles = {
    'Trading Cards': { icon: '🃏', className: 'text-bg-primary' },
    'Comics': { icon: '🦸‍♂️', className: 'text-bg-danger' },
    'Electronics': { icon: '💻', className: 'text-bg-dark' },
    'Vinyl Records': { icon: '💿', className: 'text-bg-secondary' },
    'Sneakers': { icon: '👟', className: 'text-bg-warning' },
    'Board Games': { icon: '🎲', className: 'text-bg-success' },
    'Rare Seeds': { icon: '🌱', className: 'text-bg-success' },
    'Vintage Cards': { icon: '🃏', className: 'text-bg-primary' },
    'Retro Gaming': { icon: '🕹️', className: 'text-bg-info' },
    General: { icon: '🏷️', className: 'text-bg-secondary' }
  };

  const safeNiche = niche && String(niche).trim() ? String(niche).trim() : 'General';
  const style = badgeStyles[safeNiche] || badgeStyles.General;

  return (
    <span className={`badge rounded-pill ${style.className}`} title={`Hobby niche: ${safeNiche}`}>
      <span className="me-1" aria-hidden="true">{style.icon}</span>
      {safeNiche}
    </span>
  );
};

export default HobbyBadge;