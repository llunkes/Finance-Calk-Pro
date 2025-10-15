import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';

interface PresentValueCalculatorProps {
  onBack: () => void;
}

const PresentValueCalculator: React.FC<PresentValueCalculatorProps> = ({ onBack }) => {
  const [futureValue, setFutureValue] = useState(100000);
  const [annualRate, setAnnualRate] = useState(8);
  const [years, setYears] = useState(10);

  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.PRESENT_VALUE);

  const presentValue = useMemo(() => {
    if (futureValue <= 0 || annualRate <= 0 || years <= 0) {
      return 0;
    }
    const rate = annualRate / 100;
    // PV = FV / (1 + r)^n
    const pv = futureValue / Math.pow(1 + rate, years);
    return pv;
  }, [futureValue, annualRate, years]);

  const handleSave = () => {
    saveEntry({
        inputs: { futureValue, annualRate, years },
        results: { presentValue }
    });
  };

  const handleLoad = (data: any) => {
    setFutureValue(data.inputs.futureValue);
    setAnnualRate(data.inputs.annualRate);
    setYears(data.inputs.years);
  };

  const renderHistoryEntry = (data: any) => (
    <>
        <p>Meta: {formatCurrency(data.inputs.futureValue)} em {data.inputs.years} anos</p>
        <p><strong>Valor Presente:</strong> {formatCurrency(data.results.presentValue)}</p>
    </>
  );

  return (
    <CalculatorWrapper 
        title="Calculadora de Valor Presente (PV)" 
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
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Parâmetros da Meta</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Valor Futuro Desejado (R$)</label>
              <input type="number" value={futureValue} onChange={(e) => setFutureValue(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Taxa de Juros Anual (%)</label>
              <input type="number" value={annualRate} onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
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
                    Para ter {formatCurrency(futureValue)} em {years} anos, você precisa investir hoje:
                </p>
                <p className="text-5xl font-bold text-green-accent my-4 font-mono">
                    {formatCurrency(presentValue)}
                </p>
                <p className="text-lg text-slate dark:text-slate-light">
                    considerando uma taxa de {annualRate}% ao ano.
                </p>
            </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default PresentValueCalculator;