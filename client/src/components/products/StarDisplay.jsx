import React from 'react';

const StarDisplay = ({ rating }) => {
  // Ensure the rating is within a valid range (e.g., 0 to 5)
  const clampedRating = Math.max(0, Math.min(5, rating));

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        // Each star represents an index from 1 to 5
        const starValue = index + 1;
        return (
          <span
            key={index}
            className={`
              text-xl
              ${starValue <= clampedRating ? 'text-yellow-400' : 'text-gray-300'}
            `}
          >
            &#9733; {/* Unicode character for a star */}
          </span>
        );
      })}
    </div>
  );
};

export default StarDisplay;