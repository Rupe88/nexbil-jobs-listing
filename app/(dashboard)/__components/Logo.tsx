import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <svg
        viewBox="0 0 100 100"
        className="w-10 h-10"
      >
        {/* Animated briefcase */}
        <rect
          x="20"
          y="40"
          width="60"
          height="45"
          fill="#0EA5E9"
          className="animate-pulse"
          rx="6"
        />
        <path
          d="M40 40 V30 C40 25 45 25 50 25 C55 25 60 25 60 30 V40"
          fill="#0EA5E9"
          className="animate-bounce"
        />
        
        {/* Animated search circle */}
        <circle
          cx="50"
          cy="55"
          r="12"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          className="animate-spin"
          style={{ transformOrigin: '50% 55%' }}
        />
        
        {/* Search handle */}
        <line
          x1="58"
          y1="63"
          x2="65"
          y2="70"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      
      <span className="text-2xl font-bold text-sky-500 tracking-tight">
        JobsHub
      </span>
    </div>
  );
};

export default Logo;