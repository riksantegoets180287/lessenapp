
import React from 'react';
import { getRadius } from '../theme';

interface TileProps {
  children: React.ReactNode;
  isDisabled?: boolean;
  gradientIndex?: number;
  className?: string;
  onClick?: () => void;
}

const GRADIENTS = [
  'from-[#0064B4] to-[#9678DC]',
  'from-[#F491C8] to-[#DC1E50]',
  'from-[#008273] to-[#47D7AC]',
  'from-[#FFC800] to-[#FF8F1C]',
  'from-[#9678DC] to-[#F491C8]',
  'from-[#19E196] to-[#008273]',
];

const Tile: React.FC<TileProps> = ({ children, isDisabled, gradientIndex = 0, className = "", onClick }) => {
  const radius = getRadius();
  const grad = GRADIENTS[gradientIndex % GRADIENTS.length];

  return (
    <div 
      className={`
        relative aspect-square sm:aspect-auto flex flex-col p-5 shadow-lg transition-all duration-300
        bg-gradient-to-br ${grad} text-white group
        ${isDisabled ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'}
        ${className}
      `}
      style={{ borderRadius: radius }}
      onClick={!isDisabled ? onClick : undefined}
    >
      {children}
    </div>
  );
};

export default Tile;
