import React, { useState } from 'react';

const StarRating = ({ value, onStarClick }) => {
  const [hoveredStar, setHoveredStar] = useState(null);

  const handleStarClick = (rating) => {
    onStarClick(rating);
  };

  return (
    <div style={{ display: 'flex' }}>
      {[1, 2, 3, 4, 5].map((rating) => (
        <span
          key={rating}
          style={{ cursor: 'pointer', color: (hoveredStar || value) >= rating ? 'gold' : 'gray' }}
          onMouseEnter={() => setHoveredStar(rating)}
          onMouseLeave={() => setHoveredStar(null)}
          onClick={() => handleStarClick(rating)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
