// StarRating.tsx
import React from 'react';
import { Star } from 'lucide-react';

type StarRatingProps = {
    rating: number;
    size?: number;
};

const StarRating = ({ rating, size = 16 }: StarRatingProps) => {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          color={i < rating ? '#FFD700' : '#E0E0E0'}
          fill={i < rating ? '#FFD700' : 'none'}
        />
      ))}
    </div>
  );
};

export default StarRating;
