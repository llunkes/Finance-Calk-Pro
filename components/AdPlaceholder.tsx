
import React from 'react';

interface AdPlaceholderProps {
  label: string;
  className?: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ label, className = '' }) => {
  return (
    <div className={`flex items-center justify-center bg-gray-200 dark:bg-slate-dark border-2 border-dashed border-gray-400 dark:border-slate-light rounded-lg text-gray-500 dark:text-slate-light ${className}`}>
      <div className="text-center">
        <p className="font-semibold">Google AdSense</p>
        <p className="text-sm">{label}</p>
      </div>
    </div>
  );
};

export default AdPlaceholder;
