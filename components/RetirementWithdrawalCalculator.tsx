// fix: Removed stale comment.
import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';

interface RetirementWithdrawalCalculatorProps {
  onBack: () => void;
}

const RetirementWithdrawalCalculator: React.FC<RetirementWithdrawalCalculatorProps> = ({ onBack }) => {
  const [portfolioValue, setPortfolioValue] = useState(1000000);
  const [withdrawalRate, setWithdrawalRate] = useState(4); // in percent
  const [inflationRate, setInflationRate] = useState(3); // in percent

  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.RETIREMENT_WITHDRAWAL);

  const {
    annualWithdrawal,
    monthlyWithdrawal,
    isSustainable
  } = useMemo(() => {
    const annual = portfolioValue * (withdrawalRate / 100);
    const monthly = annual / 12;
    // A common rule of thumb is that the withdrawal rate should be close to or less than the expected real return.
    // This is a gross simplification.
    const sustainable = withdrawalRate <= 7; // Very simplified sustainability check

    return {
      annualWithdrawal: annual,
      monthlyWithdrawal: monthly,
      isSustainable: sustainable,
    };
  }, [portfolioValue, withdrawalRate]);
  
  const handleSave = () => {
    saveEntry({
        inputs: { portfolioValue, withdrawalRate, inflationRate },
        results: { monthlyWithdrawal }
    });
  };

  const handleLoad = (data: any) => {
    setPortfolioValue(data.inputs.portfolioValue);
    setWithdrawalRate(data.inputs.withdrawalRate);
    setInflationRate(data.inputs.inflationRate);
  };

  const renderHistoryEntry = (data: any) => (
    <>
        <p>Patrimônio: {formatCurrency(data.inputs.portfolioValue)} | Taxa: {data.inputs.withdrawalRate}%</p>
        <p><strong>Saque Mensal:</strong> {formatCurrency(data.results.monthlyWithdrawal)}</p>
    </>
  );

  return (
    <CalculatorWrapper 
        title="Calculadora de Saque na Aposentadoria" 
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
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Parâmetros</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Valor Total do Patrimônio (R$)</label>
              <input type="number" value={portfolioValue} onChange={(e) => setPortfolioValue(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Taxa de Saque Anual (%)</label>
              <input type="number" value={withdrawalRate} onChange={(e) => setWithdrawalRate(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Taxa de Inflação Anual Estimada (%)</label>
              <input type="number" value={inflationRate} onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4 text-center">Projeção de Retiradas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
              <h3 className="text-md font-bold text-slate dark:text-slate-light">Retirada Mensal</h3>
              <p className="text-3xl font-mono text-green-accent">{formatCurrency(monthlyWithdrawal)}</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
              <h3 className="text-md font-bold text-slate dark:text-slate-light">Retirada Anual</h3>
              <p className="text-3xl font-mono text-slate-light">{formatCurrency(annualWithdrawal)}</p>
            </div>
          </div>
          <div className={`mt-6 p-4 rounded-lg text-center ${isSustainable ? 'bg-green-accent/20 text-green-accent' : 'bg-red-400/20 text-red-400'}`}>
            <p className="font-bold">
              {isSustainable 
                ? 'Esta taxa de saque é geralmente considerada sustentável.' 
                : 'Atenção: Esta taxa de saque pode ser muito alta e esgotar seu patrimônio prematuramente.'}
            </p>
            <p className="text-xs mt-2">A "regra dos 4%" é um ponto de partida comum, mas consulte um profissional financeiro para um plano personalizado.</p>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default RetirementWithdrawalCalculator;