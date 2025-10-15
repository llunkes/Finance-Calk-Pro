import React, { useState } from 'react';
import { ArrowLeftIcon, HistoryIcon } from './Icons';
import { HistoryPanel } from './HistoryPanel';
import { HistoryEntry } from '../utils/useHistory';

interface CalculatorWrapperProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
  onSave?: () => void;
  history?: HistoryEntry<any>[];
  onLoadHistory?: (data: any) => void;
  onDeleteHistory?: (id: string) => void;
  onClearHistory?: () => void;
  renderHistoryEntry?: (data: any) => React.ReactNode;
}

const CalculatorWrapper: React.FC<CalculatorWrapperProps> = ({ 
    title, onBack, children, onSave, history, onLoadHistory,
    onDeleteHistory, onClearHistory, renderHistoryEntry 
}) => {
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  
    const handleLoad = (data: any) => {
        if (onLoadHistory) {
            onLoadHistory(data);
            setIsHistoryVisible(false);
        }
    };
    
    const hasHistory = !!(onSave && history && onLoadHistory && onDeleteHistory && onClearHistory && renderHistoryEntry);
    
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <div className="mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-4 py-2 rounded-md text-slate dark:text-slate-light bg-gray-200 dark:bg-slate-dark hover:bg-gray-300 dark:hover:bg-slate-dark/70 transition-colors"
                        aria-label="Voltar ao dashboard"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        <span className="font-semibold">Voltar</span>
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-navy dark:text-gray-100 flex-grow">{title}</h1>
                    {hasHistory && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onSave}
                                className="px-4 py-2 bg-green-accent text-navy font-bold rounded-md hover:bg-green-accent-dark transition-colors"
                            >
                                Salvar
                            </button>
                            <button
                                onClick={() => setIsHistoryVisible(!isHistoryVisible)}
                                className="p-2 rounded-full text-slate dark:text-slate-light bg-gray-200 dark:bg-slate-dark hover:bg-gray-300 dark:hover:bg-slate-dark/70 transition-colors"
                                aria-label="Ver histórico"
                            >
                                <HistoryIcon className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {hasHistory && isHistoryVisible && (
                <div className="mb-8 p-6 bg-white dark:bg-navy-light rounded-lg shadow-lg animate-fade-in">
                    <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Histórico de Cálculos</h2>
                    <HistoryPanel
                        history={history}
                        onLoad={handleLoad}
                        onDelete={onDeleteHistory}
                        onClear={onClearHistory}
                        renderEntry={renderHistoryEntry}
                    />
                </div>
            )}

            {children}
        </div>
    );
};

export default CalculatorWrapper;
