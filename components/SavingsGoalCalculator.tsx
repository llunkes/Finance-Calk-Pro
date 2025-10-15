import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';

interface SavingsGoalCalculatorProps {
  onBack: () => void;
}

const SavingsGoalCalculator: React.FC<SavingsGoalCalculatorProps> = ({ onBack }) => {
  const [targetAmount, setTargetAmount] = useState(100000);
  const [initialAmount, setInitialAmount] = useState(5000);
  const [time, setTime] = useState(10); // Years
  const [annualRate, setAnnualRate] = useState(8);

  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.SAVINGS_GOAL);

  const monthlyContribution = useMemo(() => {
    if (targetAmount <= initialAmount) return 0;
    if (time <= 0) return Infinity;

    const monthlyRate = annualRate / 100 / 12;
    const n = time * 12; // total number of months

    if (monthlyRate === 0) {
        return (targetAmount - initialAmount) / n;
    }

    // PMT = [FV - PV * (1 + r)^n] / [((1 + r)^n - 1) / r]
    const futureValueOfPV = initialAmount * Math.pow(1 + monthlyRate, n);
    const pmt = (targetAmount - futureValueOfPV) / ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate);
    
    return pmt > 0 ? pmt : 0;
  }, [targetAmount, initialAmount, time, annualRate]);

  const handleSave = () => {
    saveEntry({
      inputs: { targetAmount, initialAmount, time, annualRate },
      results: { monthlyContribution }
    });
  };

  const handleLoad = (data: any) => {
    setTargetAmount(data.inputs.targetAmount);
    setInitialAmount(data.inputs.initialAmount);
    setTime(data.inputs.time);
    setAnnualRate(data.inputs.annualRate);
  };

  const renderHistoryEntry = (data: any) => (
    <>
      <p><strong>Meta:</strong> {formatCurrency(data.inputs.targetAmount)} em {data.inputs.time} anos</p>
      <p><strong>Aporte Mensal:</strong> {formatCurrency(data.results.monthlyContribution)}</p>
    </>
  );

  return (
    <CalculatorWrapper 
      title="Planejador de Metas Financeiras" 
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
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Quanto você quer juntar (R$)?</label>
              <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Quanto você já tem (R$)?</label>
              <input type="number" value={initialAmount} onChange={(e) => setInitialAmount(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Em quantos anos?</label>
              <input type="number" value={time} onChange={(e) => setTime(parseInt(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Rentabilidade Anual Estimada (%)</label>
              <input type="number" value={annualRate} onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg flex items-center justify-center">
          <div className="text-center p-4">
              <p className="text-lg text-slate dark:text-slate-light">
                Para atingir sua meta de <span className="font-bold text-white">{formatCurrency(targetAmount)}</span> em {time} anos, você precisa economizar:
              </p>
              <p className="text-5xl font-bold text-green-accent my-4 font-mono">
                {monthlyContribution === Infinity ? 'Prazo inválido' : formatCurrency(monthlyContribution)}
              </p>
              <p className="text-lg text-slate dark:text-slate-light">
                por mês.
              </p>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default SavingsGoalCalculator;
