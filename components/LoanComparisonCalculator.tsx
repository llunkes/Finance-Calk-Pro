import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';

interface LoanComparisonCalculatorProps {
  onBack: () => void;
}

const LoanComparisonCalculator: React.FC<LoanComparisonCalculatorProps> = ({ onBack }) => {
  const [loanA, setLoanA] = useState({ amount: 100000, rate: 8, term: 30 });
  const [loanB, setLoanB] = useState({ amount: 100000, rate: 7.5, term: 25 });
  
  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.LOAN_COMPARISON);
  
  const calculateLoan = (amount: number, annualRate: number, termYears: number) => {
    if (amount <= 0 || annualRate <= 0 || termYears <= 0) {
      return { monthlyPayment: 0, totalInterest: 0, totalCost: 0 };
    }
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = termYears * 12;
    
    const monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const totalCost = monthlyPayment * numberOfPayments;
    const totalInterest = totalCost - amount;

    return { monthlyPayment, totalInterest, totalCost };
  };

  const resultsA = useMemo(() => calculateLoan(loanA.amount, loanA.rate, loanA.term), [loanA]);
  const resultsB = useMemo(() => calculateLoan(loanB.amount, loanB.rate, loanB.term), [loanB]);
  
  const betterOption = useMemo(() => {
    if (resultsA.totalCost > 0 && resultsB.totalCost > 0) {
      if (resultsA.totalCost < resultsB.totalCost) return 'A';
      if (resultsB.totalCost < resultsA.totalCost) return 'B';
    }
    return null;
  }, [resultsA, resultsB]);

  const handleSave = () => {
    saveEntry({
        inputs: { loanA, loanB },
        results: { betterOption, totalCostA: resultsA.totalCost, totalCostB: resultsB.totalCost }
    });
  };

  const handleLoad = (data: any) => {
    setLoanA(data.inputs.loanA);
    setLoanB(data.inputs.loanB);
  };

  const renderHistoryEntry = (data: any) => (
    <p>
      Comparação A ({formatCurrency(data.inputs.loanA.amount)}) vs B ({formatCurrency(data.inputs.loanB.amount)}). 
      Melhor: {data.results.betterOption || 'N/A'}
    </p>
  );

  const LoanInputColumn: React.FC<{
      title: string;
      loan: { amount: number; rate: number; term: number };
      setLoan: React.Dispatch<React.SetStateAction<{ amount: number; rate: number; term: number }>>;
      isBetter: boolean;
  }> = ({ title, loan, setLoan, isBetter }) => (
      <div className={`p-6 rounded-lg shadow-lg h-fit ${isBetter ? 'bg-green-accent/10 dark:bg-green-accent/20 border-2 border-green-accent' : 'bg-white dark:bg-navy-light'}`}>
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">{title}</h2>
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-slate dark:text-slate-light">Valor (R$)</label>
                  <input type="number" value={loan.amount} onChange={(e) => setLoan(l => ({ ...l, amount: parseFloat(e.target.value) || 0}))} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate dark:text-slate-light">Taxa de Juros Anual (%)</label>
                  <input type="number" value={loan.rate} onChange={(e) => setLoan(l => ({ ...l, rate: parseFloat(e.target.value) || 0}))} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate dark:text-slate-light">Prazo (Anos)</label>
                  <input type="number" value={loan.term} onChange={(e) => setLoan(l => ({ ...l, term: parseInt(e.target.value) || 0}))} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
              </div>
          </div>
      </div>
  );

  return (
    <CalculatorWrapper 
        title="Comparador de Empréstimos" 
        onBack={onBack}
        onSave={handleSave}
        history={history}
        onLoadHistory={handleLoad}
        onDeleteHistory={deleteEntry}
        onClearHistory={clearHistory}
        renderHistoryEntry={renderHistoryEntry}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <LoanInputColumn title="Empréstimo A" loan={loanA} setLoan={setLoanA} isBetter={betterOption === 'A'} />
        <LoanInputColumn title="Empréstimo B" loan={loanB} setLoan={setLoanB} isBetter={betterOption === 'B'} />
      </div>

      <div className="bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4 text-center">Resultado da Comparação</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-center text-slate dark:text-slate-light">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-navy">
              <tr>
                <th scope="col" className="px-6 py-3">Métrica</th>
                <th scope="col" className="px-6 py-3">Empréstimo A</th>
                <th scope="col" className="px-6 py-3">Empréstimo B</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-dark">
                <td className="px-6 py-4 font-bold">Parcela Mensal</td>
                <td className={`px-6 py-4 font-mono text-lg ${betterOption && resultsA.monthlyPayment < resultsB.monthlyPayment ? 'text-green-accent' : ''}`}>{formatCurrency(resultsA.monthlyPayment)}</td>
                <td className={`px-6 py-4 font-mono text-lg ${betterOption && resultsB.monthlyPayment < resultsA.monthlyPayment ? 'text-green-accent' : ''}`}>{formatCurrency(resultsB.monthlyPayment)}</td>
              </tr>
              <tr className="border-b border-slate-dark">
                <td className="px-6 py-4 font-bold">Total de Juros Pagos</td>
                <td className={`px-6 py-4 font-mono text-lg ${betterOption === 'A' ? 'text-green-accent' : ''}`}>{formatCurrency(resultsA.totalInterest)}</td>
                <td className={`px-6 py-4 font-mono text-lg ${betterOption === 'B' ? 'text-green-accent' : ''}`}>{formatCurrency(resultsB.totalInterest)}</td>
              </tr>
              <tr className="">
                <td className="px-6 py-4 font-bold">Custo Total do Empréstimo</td>
                <td className={`px-6 py-4 font-mono text-lg ${betterOption === 'A' ? 'text-green-accent' : ''}`}>{formatCurrency(resultsA.totalCost)}</td>
                <td className={`px-6 py-4 font-mono text-lg ${betterOption === 'B' ? 'text-green-accent' : ''}`}>{formatCurrency(resultsB.totalCost)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {betterOption && (
            <div className="mt-6 p-4 bg-green-accent/20 text-green-accent font-bold rounded-lg text-center">
                O Empréstimo {betterOption} parece ser a opção mais econômica com base no custo total.
            </div>
        )}
      </div>
    </CalculatorWrapper>
  );
};

export default LoanComparisonCalculator;