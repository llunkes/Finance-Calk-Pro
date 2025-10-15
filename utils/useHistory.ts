import { useState, useCallback } from 'react';
import { CalculatorView } from '../types';

const STORAGE_KEY = 'financeCalcHistory';

const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});

export interface HistoryEntry<T> {
  id: string;
  timestamp: string;
  data: T;
}

const getStoredHistory = (): Record<string, HistoryEntry<any>[]> => {
    try {
        const item = window.localStorage.getItem(STORAGE_KEY);
        return item ? JSON.parse(item) : {};
    } catch (error) {
        console.error("Error reading history from localStorage", error);
        return {};
    }
};

const setStoredHistory = (history: Record<string, HistoryEntry<any>[]>) => {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
        console.error("Error saving history to localStorage", error);
    }
};

export function useHistory<T>(calculatorKey: CalculatorView) {
    const [history, setHistory] = useState<HistoryEntry<T>[]>(() => {
        const allHistory = getStoredHistory();
        return allHistory[calculatorKey] || [];
    });

    const saveEntry = useCallback((data: T) => {
        const newEntry: HistoryEntry<T> = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            data,
        };

        setHistory(prev => {
            const updatedEntries = [newEntry, ...prev].slice(0, 50); // Keep max 50 entries
            const allHistory = getStoredHistory();
            allHistory[calculatorKey] = updatedEntries;
            setStoredHistory(allHistory);
            return updatedEntries;
        });
    }, [calculatorKey]);

    const deleteEntry = useCallback((id: string) => {
        setHistory(prev => {
            const updatedEntries = prev.filter(entry => entry.id !== id);
            const allHistory = getStoredHistory();
            allHistory[calculatorKey] = updatedEntries;
            setStoredHistory(allHistory);
            return updatedEntries;
        });
    }, [calculatorKey]);

    const clearHistory = useCallback(() => {
        setHistory([]);
        const allHistory = getStoredHistory();
        delete allHistory[calculatorKey];
        setStoredHistory(allHistory);
    }, [calculatorKey]);

    const loadEntries = useCallback((entries: T[]) => {
        const newHistory: HistoryEntry<T>[] = entries.map((data: T) => ({
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            data,
        }));
        setHistory(newHistory);
        const allHistory = getStoredHistory();
        allHistory[calculatorKey] = newHistory;
        setStoredHistory(allHistory);
    }, [calculatorKey]);

    return { history, saveEntry, deleteEntry, clearHistory, loadEntries };
}
