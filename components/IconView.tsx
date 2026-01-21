
import React from 'react';
import * as Icons from 'lucide-react';
import { IconData } from '../types';
import { COLORS } from '../theme';

interface IconViewProps {
  icon?: IconData;
  className?: string;
  color?: string;
}

const IconView: React.FC<IconViewProps> = ({ icon, className = "w-8 h-8", color = COLORS.indigo }) => {
  if (!icon) return null;

  if (icon.kind === 'image' && icon.dataUrl) {
    return <img src={icon.dataUrl} alt="Icon" className={`${className} object-cover rounded-[inherit]`} />;
  }

  if (icon.kind === 'lucide' && icon.name) {
    const LucideIcon = (Icons as any)[icon.name];
    if (LucideIcon) {
      return <LucideIcon className={className} color={color} strokeWidth={1.5} />;
    }
  }

  return <Icons.HelpCircle className={className} color={color} strokeWidth={1.5} />;
};

export default IconView;
