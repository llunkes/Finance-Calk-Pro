import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { BudgetCategory } from '../types';
import { PlusIcon, XMarkIcon } from './Icons';

const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});

const BudgetPlanner: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [categories, setCategories] = useState<BudgetCategory[]>([
        { id: uuidv4(), name: 'Moradia', budgeted: 1500, spent: 1450 },
        { id: uuidv4(), name: 'Alimentação', budgeted: 800, spent: 650 },
        { id: uuidv4(), name: 'Transporte', budgeted: 300, spent: 350 },
        { id: uuidv4(), name: 'Lazer', budgeted: 400, spent: 200 },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryBudget, setNewCategoryBudget] = useState<number | ''>('');

    const { totalBudgeted, totalSpent, totalRemaining } = useMemo(() => {
        const budgeted = categories.reduce((sum, c) => sum + c.budgeted, 0);
        const spent = categories.reduce((sum, c) => sum + c.spent, 0);
        return {
            totalBudgeted: budgeted,
            totalSpent: spent,
            totalRemaining: budgeted - spent,
        };
    }, [categories]);

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        // fix: Check if newCategoryBudget is not an empty string before numeric comparison.
        if (newCategoryName && newCategoryBudget !== '' && newCategoryBudget > 0) {
            setCategories([...categories, {
                id: uuidv4(),
                name: newCategoryName,
                budgeted: Number(newCategoryBudget),
                spent: 0
            }]);
            setNewCategoryName('');
            setNewCategoryBudget('');
            setIsModalOpen(false);
        }
    };

    const handleUpdateCategory = (id: string, field: 'budgeted' | 'spent', value: number) => {
        setCategories(categories.map(c => c.id === id ? { ...c, [field]: value } : c));
    };
    
    const handleDeleteCategory = (id: string) => {
        setCategories(categories.filter(c => c.id !== id));
    };

    const ProgressBar: React.FC<{ value: number, max: number }> = ({ value, max }) => {
        const percentage = max > 0 ? (value / max) * 100 : 0;
        let color = 'bg-green-accent';
        if (percentage > 100) color = 'bg-red-500';
        else if (percentage > 85) color = 'bg-yellow-500';

        return (
            <div className="w-full bg-slate-dark rounded-full h-2.5">
                <div className={`${color} h-2.5 rounded-full`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
            </div>
        );
    };

    return (
        <CalculatorWrapper title="Planejador de Orçamento Mensal" onBack={onBack}>
            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-white dark:bg-navy-light rounded-lg text-center shadow-lg">
                    <h3 className="text-md font-bold text-slate dark:text-slate-light">Orçado</h3>
                    <p className="text-2xl font-mono text-slate-light">{formatCurrency(totalBudgeted)}</p>
                </div>
                <div className="p-4 bg-white dark:bg-navy-light rounded-lg text-center shadow-lg">
                    <h3 className="text-md font-bold text-slate dark:text-slate-light">Gasto</h3>
                    <p className="text-2xl font-mono text-red-400">{formatCurrency(totalSpent)}</p>
                </div>
                <div className="p-4 bg-white dark:bg-navy-light rounded-lg text-center shadow-lg">
                    <h3 className="text-md font-bold text-slate dark:text-slate-light">Restante</h3>
                    <p className={`text-2xl font-mono ${totalRemaining >= 0 ? 'text-green-accent' : 'text-red-400'}`}>{formatCurrency(totalRemaining)}</p>
                </div>
            </div>
            
            {/* Categories List */}
             <div className="bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-navy dark:text-gray-100">Categorias do Orçamento</h2>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-green-accent text-navy font-bold rounded-md hover:bg-green-accent-dark transition-colors">
                        <PlusIcon className="w-5 h-5" /> Nova Categoria
                    </button>
                </div>
                <div className="space-y-4">
                    {categories.map(cat => {
                        const remaining = cat.budgeted - cat.spent;
                        return (
                             <div key={cat.id} className="p-4 bg-gray-100 dark:bg-navy rounded-md">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-navy dark:text-white">{cat.name}</h3>
                                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-slate hover:text-red-400"><XMarkIcon className="w-4 h-4"/></button>
                                </div>
                                <ProgressBar value={cat.spent} max={cat.budgeted} />
                                <div className="flex justify-between text-xs mt-2 text-slate dark:text-slate-light">
                                    <span>{formatCurrency(cat.spent)} de {formatCurrency(cat.budgeted)}</span>
                                    <span className={remaining < 0 ? 'text-red-400' : ''}>
                                        {formatCurrency(remaining)} {remaining >= 0 ? 'restante' : 'acima'}
                                    </span>
                                </div>
                                 <div className="flex items-center gap-2 mt-2">
                                    <span className="text-sm text-slate dark:text-slate-light">Gasto: R$</span>
                                    <input 
                                        type="number" 
                                        value={cat.spent}
                                        onChange={e => handleUpdateCategory(cat.id, 'spent', parseFloat(e.target.value) || 0)}
                                        className="w-full p-1 bg-white dark:bg-slate-dark rounded text-navy dark:text-white text-sm"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Add Category Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white dark:bg-navy-light p-8 rounded-lg shadow-2xl w-full max-w-md relative">
                         <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate hover:text-red-400">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-bold text-navy dark:text-white mb-6">Nova Categoria</h2>
                        <form onSubmit={handleAddCategory} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate dark:text-slate-light">Nome da Categoria</label>
                                <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate dark:text-slate-light">Valor Orçado (R$)</label>
                                <input type="number" value={newCategoryBudget} onChange={e => setNewCategoryBudget(e.target.value === '' ? '' : parseFloat(e.target.value))} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" required min="0.01" step="0.01" />
                            </div>
                            <button type="submit" className="w-full mt-4 px-4 py-2 bg-green-accent text-navy font-bold rounded-md hover:bg-green-accent-dark transition-colors">
                                Salvar Categoria
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </CalculatorWrapper>
    );
};

export default BudgetPlanner;