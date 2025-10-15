import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { Transaction } from '../types';
import { PlusIcon, HomeIcon, FoodIcon, TransportIcon, XMarkIcon } from './Icons';

// Simple unique ID generator to avoid external dependencies
const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

interface ExpenseTrackerProps {
  onBack: () => void;
}

interface Category {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
}

const CATEGORIES: Category[] = [
    { name: 'Moradia', icon: HomeIcon, color: 'text-blue-400' },
    { name: 'Alimentação', icon: FoodIcon, color: 'text-orange-400' },
    { name: 'Transporte', icon: TransportIcon, color: 'text-purple-400' },
    // In a real app, you would have more categories here
];

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ onBack }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form state
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState<number | ''>('');
    const [category, setCategory] = useState(CATEGORIES[0].name);
    const [type, setType] = useState<'income' | 'expense'>('expense');

    const { totalIncome, totalExpense, balance } = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        return {
            totalIncome: income,
            totalExpense: expense,
            balance: income - expense,
        };
    }, [transactions]);
    
    const handleAddTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || amount === '' || amount <= 0) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }
        
        const newTransaction: Transaction = {
            id: uuidv4(),
            description,
            amount: Number(amount),
            category: type === 'income' ? 'Renda' : category,
            date: new Date().toISOString(),
            type,
        };
        
        setTransactions(prev => [...prev, newTransaction].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        
        // Reset form and close modal
        setDescription('');
        setAmount('');
        setCategory(CATEGORIES[0].name);
        setType('expense');
        setIsModalOpen(false);
    };
    
    const handleDeleteTransaction = (id: string) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    return (
        <CalculatorWrapper title="Controle de Gastos Mensais" onBack={onBack}>
            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-green-accent/20 rounded-lg text-center">
                    <h3 className="text-md font-bold text-slate dark:text-slate-light">Receita Total</h3>
                    <p className="text-2xl font-mono text-green-accent">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="p-4 bg-red-400/20 rounded-lg text-center">
                    <h3 className="text-md font-bold text-slate dark:text-slate-light">Despesa Total</h3>
                    <p className="text-2xl font-mono text-red-400">{formatCurrency(totalExpense)}</p>
                </div>
                <div className="p-4 bg-slate-dark/50 rounded-lg text-center">
                    <h3 className="text-md font-bold text-slate dark:text-slate-light">Saldo</h3>
                    <p className={`text-2xl font-mono ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>{formatCurrency(balance)}</p>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-navy dark:text-gray-100">Transações Recentes</h2>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-green-accent text-navy font-bold rounded-md hover:bg-green-accent-dark transition-colors">
                        <PlusIcon className="w-5 h-5" /> Adicionar
                    </button>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {transactions.length > 0 ? transactions.map(t => (
                        <div key={t.id} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-navy rounded-md">
                            <div>
                                <p className="font-semibold text-navy dark:text-white">{t.description}</p>
                                <p className="text-sm text-slate dark:text-slate-light">{t.category} - {new Date(t.date).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div className="flex items-center gap-4">
                               <p className={`font-mono font-semibold ${t.type === 'income' ? 'text-green-accent' : 'text-red-400'}`}>
                                 {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                               </p>
                               <button onClick={() => handleDeleteTransaction(t.id)} className="text-slate hover:text-red-400">
                                   <XMarkIcon className="w-5 h-5"/>
                               </button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-slate dark:text-slate-light py-8">Nenhuma transação registrada.</p>
                    )}
                </div>
            </div>

            {/* Add Transaction Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white dark:bg-navy-light p-8 rounded-lg shadow-2xl w-full max-w-md relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate hover:text-red-400">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-bold text-navy dark:text-white mb-6">Nova Transação</h2>
                        <form onSubmit={handleAddTransaction} className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-slate dark:text-slate-light">Tipo</label>
                                <select value={type} onChange={e => setType(e.target.value as any)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent">
                                    <option value="expense">Despesa</option>
                                    <option value="income">Receita</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate dark:text-slate-light">Descrição</label>
                                <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate dark:text-slate-light">Valor (R$)</label>
                                <input type="number" value={amount} onChange={e => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" required min="0.01" step="0.01" />
                            </div>
                            {type === 'expense' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate dark:text-slate-light">Categoria</label>
                                    <select value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent">
                                        {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                            )}
                            <button type="submit" className="w-full mt-4 px-4 py-2 bg-green-accent text-navy font-bold rounded-md hover:bg-green-accent-dark transition-colors">
                                Salvar Transação
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </CalculatorWrapper>
    );
};

export default ExpenseTracker;
