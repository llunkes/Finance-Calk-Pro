import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';

interface BreakEvenCalculatorProps {
  onBack: () => void;
}

const BreakEvenCalculator: React.FC<BreakEvenCalculatorProps> = ({ onBack }) => {
  const [fixedCosts, setFixedCosts] = useState(10000);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(30);
  const [salePricePerUnit, setSalePricePerUnit] = useState(50);

  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.BREAK_EVEN);

  const { breakEvenUnits, breakEvenRevenue, contributionMargin } = useMemo(() => {
    const margin = salePricePerUnit - variableCostPerUnit;
    if (margin <= 0 || fixedCosts <= 0) {
      return { breakEvenUnits: Infinity, breakEvenRevenue: Infinity, contributionMargin: 0 };
    }
    const units = fixedCosts / margin;
    const revenue = units * salePricePerUnit;
    return { breakEvenUnits: units, breakEvenRevenue: revenue, contributionMargin: margin };
  }, [fixedCosts, variableCostPerUnit, salePricePerUnit]);
  
  const handleSave = () => {
    saveEntry({
        inputs: { fixedCosts, variableCostPerUnit, salePricePerUnit },
        results: { breakEvenUnits, breakEvenRevenue }
    });
  };

  const handleLoad = (data: any) => {
    setFixedCosts(data.inputs.fixedCosts);
    setVariableCostPerUnit(data.inputs.variableCostPerUnit);
    setSalePricePerUnit(data.inputs.salePricePerUnit);
  };

  const renderHistoryEntry = (data: any) => (
    <>
        <p>Custos Fixos: {formatCurrency(data.inputs.fixedCosts)}</p>
        <p><strong>Resultado:</strong> {Math.ceil(data.results.breakEvenUnits)} unidades</p>
    </>
  );

  return (
    <CalculatorWrapper 
        title="Calculadora de Ponto de Equilíbrio (Break-Even)" 
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
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Custos e Preços</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Custos Fixos Totais (R$)</label>
              <input type="number" value={fixedCosts} onChange={(e) => setFixedCosts(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Custo Variável por Unidade (R$)</label>
              <input type="number" value={variableCostPerUnit} onChange={(e) => setVariableCostPerUnit(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Preço de Venda por Unidade (R$)</label>
              <input type="number" value={salePricePerUnit} onChange={(e) => setSalePricePerUnit(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4 text-center">Seu Ponto de Equilíbrio</h2>
            <div className="text-center">
                 <p className="text-slate dark:text-slate-light">Para cobrir seus custos, você precisa alcançar:</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-center">
                <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
                    <h3 className="text-lg font-bold text-slate dark:text-slate-light">Ponto de Equilíbrio em Unidades</h3>
                    <p className="text-3xl font-mono text-green-accent">
                        {isFinite(breakEvenUnits) ? Math.ceil(breakEvenUnits) : 'N/A'}
                    </p>
                    <p className="text-sm text-slate dark:text-slate-light mt-1">unidades vendidas</p>
                </div>
                 <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
                    <h3 className="text-lg font-bold text-slate dark:text-slate-light">Ponto de Equilíbrio em Receita</h3>
                    <p className="text-3xl font-mono text-green-accent">
                        {isFinite(breakEvenRevenue) ? formatCurrency(breakEvenRevenue) : 'N/A'}
                    </p>
                    <p className="text-sm text-slate dark:text-slate-light mt-1">em faturamento</p>
                </div>
            </div>
             <div className="mt-6 pt-4 border-t border-slate-dark text-center">
                <p className="text-lg text-slate dark:text-slate-light">
                    Sua margem de contribuição por unidade é de <span className="font-bold text-white">{formatCurrency(contributionMargin)}</span>.
                </p>
            </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default BreakEvenCalculator;