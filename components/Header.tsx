import React from 'react';
import { SunIcon, MoonIcon, CalculatorIcon } from './Icons';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="bg-white/80 dark:bg-navy-light/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b border-slate-dark/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <CalculatorIcon className="w-8 h-8 text-green-accent" />
            <span className="text-xl font-bold text-navy dark:text-gray-100">
              FinanceCalc Pro
            </span>
          </div>
          <div className="flex items-center">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-full text-slate dark:text-slate-light hover:bg-gray-200 dark:hover:bg-slate-dark transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <MoonIcon className="w-6 h-6" />
              ) : (
                <SunIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;