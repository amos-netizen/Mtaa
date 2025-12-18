'use client';

import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ rating, onChange, onRatingChange, readonly = false, interactive = false, size = 'md' }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (value: number) => {
    if (!readonly && (onChange || onRatingChange)) {
      onChange?.(value);
      onRatingChange?.(value);
    }
  };

  const isInteractive = interactive || !readonly;

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleClick(value)}
          onMouseEnter={() => isInteractive && setHoverRating(value)}
          onMouseLeave={() => isInteractive && setHoverRating(0)}
          disabled={!isInteractive}
          className={`${sizeClasses[size]} transition-colors ${
            isInteractive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
          }`}
        >
          {value <= displayRating ? (
            <svg className="w-full h-full text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ) : (
            <svg className="w-full h-full text-gray-300 dark:text-gray-600 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          )}
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

