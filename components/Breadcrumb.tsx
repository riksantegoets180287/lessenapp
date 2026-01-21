
import React from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface BreadcrumbProps {
  path: string[];
  onBack: () => void;
  onNavigate: (index: number) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, onBack, onNavigate }) => {
  return (
    <div className="flex items-center gap-2 mb-6 overflow-hidden whitespace-nowrap text-sm sm:text-base">
      <button 
        onClick={onBack}
        className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full shadow-sm text-[#20126E] font-semibold hover:bg-gray-50 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Terug</span>
      </button>
      
      <div className="flex items-center gap-1 text-gray-400 overflow-hidden">
        {path.map((item, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight size={16} className="shrink-0" />
            <button 
              onClick={() => onNavigate(idx)}
              className={`truncate hover:underline ${idx === path.length - 1 ? 'text-[#20126E] font-bold' : 'text-gray-500'}`}
              title={item}
            >
              {item}
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumb;
