import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { StockPurchase, CalculatorView } from '../types';
import { PlusIcon, XMarkIcon } from './Icons';
import { useHistory } from '../utils/useHistory';

const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});

interface StockAverageCalculatorProps {
  onBack: () => void;
}

const StockAverageCalculator: React.FC<StockAverageCalculatorProps> = ({ onBack }) => {
  const [purchases, setPurchases] = useState<StockPurchase[]>([
    { id: uuidv4(), shares: 100, price: 10.50 },
    { id: uuidv4(), shares: 50, price: 12.00 },
  ]);

  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.STOCK_AVERAGE);

  const handlePurchaseChange = (id: string, field: 'shares' | 'price', value: string) => {
    const numericValue = parseFloat(value) || 0;
    setPurchases(purchases.map(p => p.id === id ? { ...p, [field]: numericValue } : p));
  };

  const addPurchase = () => {
    setPurchases([...purchases, { id: uuidv4(), shares: 0, price: 0 }]);
  };

  const removePurchase = (id: string) => {
    setPurchases(purchases.filter(p => p.id !== id));
  };

  const { averagePrice, totalShares, totalCost } = useMemo(() => {
    const validPurchases = purchases.filter(p => p.shares > 0 && p.price > 0);
    if (validPurchases.length === 0) {
      return { averagePrice: 0, totalShares: 0, totalCost: 0 };
    }

    const totalCostVal = validPurchases.reduce((acc, p) => acc + (p.shares * p.price), 0);
    const totalSharesVal = validPurchases.reduce((acc, p) => acc + p.shares, 0);
    const avgPrice = totalSharesVal > 0 ? totalCostVal / totalSharesVal : 0;

    return { averagePrice: avgPrice, totalShares: totalSharesVal, totalCost: totalCostVal };
  }, [purchases]);
  
  const handleSave = () => {
    saveEntry({
        inputs: { purchases },
        results: { averagePrice, totalShares }
    });
  };

  const handleLoad = (data: any) => {
    // Ensure loaded data has unique IDs if they are missing
    const loadedPurchases = data.inputs.purchases.map((p: StockPurchase) => ({...p, id: p.id || uuidv4() }));
    setPurchases(loadedPurchases);
  };

  const renderHistoryEntry = (data: any) => (
    <>
        <p>{data.inputs.purchases.length} compras salvas.</p>
        <p><strong>Preço Médio:</strong> {formatCurrency(data.results.averagePrice)}</p>
    </>
  );

  return (
    <CalculatorWrapper 
        title="Calculadora de Preço Médio de Ações" 
        onBack={onBack}
        onSave={handleSave}
        history={history}
        onLoadHistory={handleLoad}
        onDeleteHistory={deleteEntry}
        onClearHistory={clearHistory}
        renderHistoryEntry={renderHistoryEntry}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg h-fit">
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Ordens de Compra</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="p-3 bg-gray-100 dark:bg-navy rounded-md relative">
                <button onClick={() => removePurchase(purchase.id)} className="absolute top-2 right-2 text-slate hover:text-red-400 p-1 rounded-full">
                  <XMarkIcon className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-slate dark:text-slate-light">Ações</label>
                    <input type="number" value={purchase.shares} onChange={e => handlePurchaseChange(purchase.id, 'shares', e.target.value)} className="w-full p-1 bg-white dark:bg-slate-dark rounded text-navy dark:text-white" />
                  </div>
                  <div>
                    <label className="text-slate dark:text-slate-light">Preço (R$)</label>
                    <input type="number" value={purchase.price} onChange={e => handlePurchaseChange(purchase.id, 'price', e.target.value)} className="w-full p-1 bg-white dark:bg-slate-dark rounded text-navy dark:text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={addPurchase} className="w-full mt-4 flex items-center justify-center gap-2 py-2 border-2 border-dashed border-slate-dark text-slate dark:text-slate-light rounded-md hover:bg-slate-dark hover:text-white transition-colors">
            <PlusIcon className="w-5 h-5" /> Adicionar Compra
          </button>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4 text-center">Resultado Consolidado</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
              <h3 className="text-md font-bold text-slate dark:text-slate-light">Preço Médio</h3>
              <p className="text-3xl font-mono text-green-accent">{formatCurrency(averagePrice)}</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
              <h3 className="text-md font-bold text-slate dark:text-slate-light">Total de Ações</h3>
              <p className="text-3xl font-mono text-slate-light">{totalShares}</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
              <h3 className="text-md font-bold text-slate dark:text-slate-light">Custo Total</h3>
              <p className="text-3xl font-mono text-slate-light">{formatCurrency(totalCost)}</p>
            </div>
          </div>
          <p className="text-center text-slate dark:text-slate-light mt-6 text-sm">
            O preço médio é crucial para calcular seu lucro ou prejuízo ao vender os ativos.
          </p>
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default StockAverageCalculator;