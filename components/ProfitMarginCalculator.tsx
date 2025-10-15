import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';

interface ProfitMarginCalculatorProps {
  onBack: () => void;
}

const ProfitMarginCalculator: React.FC<ProfitMarginCalculatorProps> = ({ onBack }) => {
  const [revenue, setRevenue] = useState(100000);
  const [cost, setCost] = useState(60000);

  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.PROFIT_MARGIN);

  const { grossProfit, grossMargin } = useMemo(() => {
    if (revenue <= 0) {
      return { grossProfit: 0, grossMargin: 0 };
    }
    const profit = revenue - cost;
    const margin = (profit / revenue) * 100;
    return { grossProfit: profit, grossMargin: margin };
  }, [revenue, cost]);

  const handleSave = () => {
    saveEntry({
        inputs: { revenue, cost },
        results: { grossProfit, grossMargin }
    });
  };

  const handleLoad = (data: any) => {
    setRevenue(data.inputs.revenue);
    setCost(data.inputs.cost);
  };

  const renderHistoryEntry = (data: any) => (
    <>
        <p>Receita: {formatCurrency(data.inputs.revenue)} | Custo: {formatCurrency(data.inputs.cost)}</p>
        <p><strong>Margem:</strong> {data.results.grossMargin.toFixed(2)}%</p>
    </>
  );

  return (
    <CalculatorWrapper 
        title="Calculadora de Margem de Lucro" 
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
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Dados Financeiros</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Receita Total (R$)</label>
              <input type="number" value={revenue} onChange={(e) => setRevenue(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Custo da Mercadoria Vendida (R$)</label>
              <input type="number" value={cost} onChange={(e) => setCost(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4 text-center">Análise de Rentabilidade</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-center">
                <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
                    <h3 className="text-lg font-bold text-slate dark:text-slate-light">Lucro Bruto</h3>
                    <p className="text-3xl font-mono text-green-accent">
                        {formatCurrency(grossProfit)}
                    </p>
                </div>
                 <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
                    <h3 className="text-lg font-bold text-slate dark:text-slate-light">Margem de Lucro Bruta</h3>
                    <p className="text-3xl font-mono text-green-accent">
                        {grossMargin.toFixed(2)}%
                    </p>
                </div>
            </div>
             <div className="mt-6 pt-4 border-t border-slate-dark text-center">
                <p className="text-sm text-slate dark:text-slate-light">
                    A margem de lucro indica a porcentagem da receita que se transformou em lucro. Quanto maior, melhor.
                </p>
            </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default ProfitMarginCalculator;