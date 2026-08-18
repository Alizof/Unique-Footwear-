import React from 'react';
import { useStore } from '../context/StoreContext';

interface LogoProps {
  className?: string;
  isDark?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  isDark = false,
  size = 'md',
  showTagline = false,
  onClick,
}) => {
  const { settings } = useStore();

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-sm tracking-tight',
    md: 'text-base sm:text-lg tracking-normal',
    lg: 'text-xl sm:text-2xl tracking-tight',
  };

  return (
    <div
      id="brand-logo"
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none cursor-pointer group ${className}`}
    >
      {settings.logoUrl ? (
        <img
          src={settings.logoUrl}
          alt={settings.brandName}
          referrerPolicy="no-referrer"
          className={`${iconSizes[size]} object-contain rounded-lg`}
        />
      ) : (
        <div
          className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 shadow-md shadow-red-600/25 group-hover:scale-105 transition-transform duration-200 border border-red-500/40`}
        >
          {/* Custom Original Footwear Icon - Stylized Shoe Contour */}
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5/6 h-5/6 text-white drop-shadow"
          >
            {/* Sneaker/Shoe upper curve and dynamic wing */}
            <path
              d="M4 21C4 21 6 22 9 22C14 22 17 19.5 20 19.5C23 19.5 26 21 28 21C28.8 21 29 20 28.5 19C27 16 23.5 14 20 14C17.5 14 16 11 13 11C11.5 11 10.5 12 9 14.5L6 17C4.5 18.2 4 20 4 21Z"
              fill="currentColor"
              fillOpacity="0.95"
            />
            {/* Outsole cushion tread */}
            <path
              d="M3.5 22.5C5.5 24 8.5 24.5 12 24.5C18 24.5 22 23 28.5 23C29.2 23 29.5 23.8 29 24.5C27.5 26.2 23 27 18 27C11 27 5.5 25.5 3 23.8C2.6 23.5 2.8 22.8 3.5 22.5Z"
              fill="#fbbf24"
            />
            {/* Dynamic speed lace accent */}
            <path
              d="M14 13L18 17M11.5 15L15.5 19"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      <div className="flex flex-col leading-tight">
        <span
          className={`font-black uppercase tracking-wider font-sans ${titleSizes[size]} ${
            isDark ? 'text-white' : 'text-slate-950'
          }`}
        >
          {settings.brandName || 'UNIQUE STYLE'}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.22em] text-red-600">
            FOOTWEAR
          </span>
          <span className="w-1 h-1 rounded-full bg-red-600"></span>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest hidden sm:inline">
            Pithoria
          </span>
        </div>
        {showTagline && (
          <span className="text-xs text-slate-500 font-normal mt-0.5 max-w-xs">
            {settings.tagline}
          </span>
        )}
      </div>
    </div>
  );
};
