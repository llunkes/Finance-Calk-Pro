import React from 'react';
import { HistoryEntry } from '../utils/useHistory';
import { XMarkIcon } from './Icons';

interface HistoryPanelProps<T> {
    history: HistoryEntry<T>[];
    onLoad: (data: T) => void;
    onDelete: (id: string) => void;
    onClear: () => void;
    renderEntry: (data: T) => React.ReactNode;
}

export function HistoryPanel<T>({ history, onLoad, onDelete, onClear, renderEntry }: HistoryPanelProps<T>) {
    if (history.length === 0) {
        return <p className="text-center text-slate dark:text-slate-light py-4">Nenhum histórico salvo.</p>;
    }

    return (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            <div className="flex justify-end">
                <button
                    onClick={onClear}
                    className="text-sm text-red-400 hover:underline"
                >
                    Limpar Histórico
                </button>
            </div>
            {history.map(entry => (
                <div key={entry.id} className="p-4 bg-gray-100 dark:bg-navy rounded-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate dark:text-slate-light mb-2">
                                Salvo em: {new Date(entry.timestamp).toLocaleString('pt-BR')}
                            </p>
                            <div className="text-sm text-navy dark:text-slate-light">{renderEntry(entry.data)}</div>
                        </div>
                        <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
                            <button
                                onClick={() => onLoad(entry.data)}
                                className="px-3 py-1 text-xs bg-green-accent text-navy font-bold rounded-md hover:bg-green-accent-dark transition-colors"
                            >
                                Carregar
                            </button>
                            <button
                                onClick={() => onDelete(entry.id)}
                                className="text-slate hover:text-red-400 p-1 rounded-full"
                                aria-label="Deletar entrada"
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
