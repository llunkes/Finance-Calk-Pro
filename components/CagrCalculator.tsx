import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';

interface CagrCalculatorProps {
  onBack: () => void;
}

const CagrCalculator: React.FC<CagrCalculatorProps> = ({ onBack }) => {
  const [startValue, setStartValue] = useState(10000);
  const [endValue, setEndValue] = useState(50000);
  const [years, setYears] = useState(5);
  
  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.CAGR);

  const cagr = useMemo(() => {
    if (startValue <= 0 || endValue <= 0 || years <= 0) {
      return 0;
    }
    const rate = Math.pow(endValue / startValue, 1 / years) - 1;
    return rate * 100;
  }, [startValue, endValue, years]);
  
  const handleSave = () => {
    saveEntry({
      inputs: { startValue, endValue, years },
      results: { cagr }
    });
  };

  const handleLoad = (data: any) => {
    setStartValue(data.inputs.startValue);
    setEndValue(data.inputs.endValue);
    setYears(data.inputs.years);
  };

  const renderHistoryEntry = (data: any) => (
    <>
      <p><strong>Investimento:</strong> {formatCurrency(data.inputs.startValue)} → {formatCurrency(data.inputs.endValue)} em {data.inputs.years} anos</p>
      <p><strong>CAGR:</strong> {data.results.cagr.toFixed(2)}%</p>
    </>
  );

  return (
    <CalculatorWrapper 
      title="Calculadora CAGR (Crescimento Anual Composto)" 
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
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Parâmetros do Investimento</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Valor Inicial (R$)</label>
              <input type="number" value={startValue} onChange={(e) => setStartValue(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Valor Final (R$)</label>
              <input type="number" value={endValue} onChange={(e) => setEndValue(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Período (Anos)</label>
              <input type="number" value={years} onChange={(e) => setYears(parseInt(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg flex items-center justify-center">
            <div className="text-center p-4">
                <p className="text-lg text-slate dark:text-slate-light">
                    A taxa de crescimento anual composta (CAGR) do seu investimento foi de:
                </p>
                <p className="text-5xl font-bold text-green-accent my-4 font-mono">
                    {cagr.toFixed(2)}%
                </p>
                <p className="text-lg text-slate dark:text-slate-light">
                    ao ano.
                </p>
            </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default CagrCalculator;
