
export const COLORS = {
  indigo: '#20126E',
  white: '#FFFFFF',
  lightGray: '#F4F4F4',
  blue: '#0064B4',
  purple: '#9678DC',
  pink: '#F491C8',
  green: '#008273',
  lime: '#E3F523',
  yellow: '#FFC800',
  orange: '#FF8F1C',
  fuchsia: '#DC1E50',
  aqua: '#19E196',
  aqua2: '#47D7AC',
};

export const GRADIENTS = [
  'linear-gradient(45deg, #0064B4, #9678DC)',
  'linear-gradient(35deg, #F491C8, #DC1E50)',
  'linear-gradient(55deg, #008273, #47D7AC)',
  'linear-gradient(40deg, #FFC800, #FF8F1C)',
  'linear-gradient(30deg, #9678DC, #F491C8)',
  'linear-gradient(60deg, #19E196, #008273)',
];

export const getRadius = () => {
  // Mock responsive radius calc logic
  // Real implementation uses Tailwind or JS to sync with viewport
  return "clamp(12px, 3vw, 22px)";
};

export const getInnerRadius = (radius: string) => {
  // Using a simplified approach for radius tokens
  return "calc(" + radius + " * 0.8)";
};
