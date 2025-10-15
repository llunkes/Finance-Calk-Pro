import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';

const MortgageRefinanceCalculator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // Current Loan State
  const [currentBalance, setCurrentBalance] = useState(400000);
  const [currentInterestRate, setCurrentInterestRate] = useState(9.5);
  const [currentMonthlyPayment, setCurrentMonthlyPayment] = useState(3500);

  // New Loan State
  const [newInterestRate, setNewInterestRate] = useState(7.5);
  const [newLoanTerm, setNewLoanTerm] = useState(30); // years
  const [closingCosts, setClosingCosts] = useState(5000);
  
  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.MORTGAGE_REFINANCE_CALCULATOR);
  
  const inputStyle = "mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent";

  const { newMonthlyPayment, monthlySavings, breakEvenPointMonths } = useMemo(() => {
    if (currentBalance <= 0 || newInterestRate <= 0 || newLoanTerm <= 0) {
      return { newMonthlyPayment: 0, monthlySavings: 0, breakEvenPointMonths: Infinity };
    }
    
    const monthlyRate = newInterestRate / 100 / 12;
    const numberOfPayments = newLoanTerm * 12;
    
    const newPayment = currentBalance * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const savings = currentMonthlyPayment - newPayment;
    
    const breakEven = savings > 0 ? closingCosts / savings : Infinity;

    return {
      newMonthlyPayment: newPayment,
      monthlySavings: savings,
      breakEvenPointMonths: breakEven,
    };
  }, [currentBalance, currentInterestRate, currentMonthlyPayment, newInterestRate, newLoanTerm, closingCosts]);

  const handleSave = () => {
    saveEntry({
        inputs: { currentBalance, currentInterestRate, currentMonthlyPayment, newInterestRate, newLoanTerm, closingCosts },
        results: { monthlySavings, breakEvenPointMonths }
    });
  };

  const handleLoad = (data: any) => {
    const { inputs } = data;
    setCurrentBalance(inputs.currentBalance);
    setCurrentInterestRate(inputs.currentInterestRate);
    setCurrentMonthlyPayment(inputs.currentMonthlyPayment);
    setNewInterestRate(inputs.newInterestRate);
    setNewLoanTerm(inputs.newLoanTerm);
    setClosingCosts(inputs.closingCosts);
  };

  const renderHistoryEntry = (data: any) => (
    <>
        <p>Refinanciamento de {formatCurrency(data.inputs.currentBalance)}</p>
        <p><strong>Economia Mensal:</strong> {formatCurrency(data.results.monthlySavings)}</p>
    </>
  );
  
  return (
    <CalculatorWrapper 
        title="Calculadora de Refinanciamento de Hipoteca" 
        onBack={onBack}
        onSave={handleSave}
        history={history}
        onLoadHistory={handleLoad}
        onDeleteHistory={deleteEntry}
        onClearHistory={clearHistory}
        renderHistoryEntry={renderHistoryEntry}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-8">
            <div className="bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Empréstimo Atual</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate dark:text-slate-light">Saldo Devedor Atual (R$)</label>
                        <input type="number" value={currentBalance} onChange={e => setCurrentBalance(parseFloat(e.target.value) || 0)} className={inputStyle} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate dark:text-slate-light">Taxa de Juros Atual (% a.a.)</label>
                        <input type="number" value={currentInterestRate} onChange={e => setCurrentInterestRate(parseFloat(e.target.value) || 0)} className={inputStyle} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate dark:text-slate-light">Pagamento Mensal Atual (R$)</label>
                        <input type="number" value={currentMonthlyPayment} onChange={e => setCurrentMonthlyPayment(parseFloat(e.target.value) || 0)} className={inputStyle} />
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Novas Condições de Refinanciamento</h2>
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-slate dark:text-slate-light">Nova Taxa de Juros (% a.a.)</label>
                        <input type="number" value={newInterestRate} onChange={e => setNewInterestRate(parseFloat(e.target.value) || 0)} className={inputStyle} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate dark:text-slate-light">Novo Prazo do Empréstimo (anos)</label>
                        <input type="number" value={newLoanTerm} onChange={e => setNewLoanTerm(parseInt(e.target.value) || 0)} className={inputStyle} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate dark:text-slate-light">Custos de Fechamento (R$)</label>
                        <input type="number" value={closingCosts} onChange={e => setClosingCosts(parseFloat(e.target.value) || 0)} className={inputStyle} />
                    </div>
                </div>
            </div>
        </div>
        
        {/* Results */}
        <div className="bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4 text-center">Análise do Refinanciamento</h2>
            <div className="space-y-4 text-center">
                <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
                    <h3 className="text-md font-bold text-slate dark:text-slate-light">Nova Parcela Mensal</h3>
                    <p className="text-3xl font-mono text-slate-light">{formatCurrency(newMonthlyPayment)}</p>
                </div>
                 <div className="p-4 bg-green-accent/20 rounded-lg">
                    <h3 className="text-md font-bold text-slate dark:text-slate-light">Economia Mensal</h3>
                    <p className={`text-4xl font-mono font-bold ${monthlySavings > 0 ? 'text-green-accent' : 'text-red-400'}`}>{formatCurrency(monthlySavings)}</p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
                    <h3 className="text-md font-bold text-slate dark:text-slate-light">Ponto de Equilíbrio (Break-Even)</h3>
                    <p className="text-3xl font-mono text-slate-light">
                        {isFinite(breakEvenPointMonths) ? `${Math.ceil(breakEvenPointMonths)} meses` : 'Não vantajoso'}
                    </p>
                    <p className="text-xs text-slate dark:text-slate-light mt-1">Tempo para recuperar os custos de fechamento</p>
                </div>
            </div>
             <p className="text-center text-slate dark:text-slate-light mt-6 text-sm">
                Se a economia mensal for positiva e você planeja ficar no imóvel por mais tempo que o ponto de equilíbrio, o refinanciamento pode ser uma boa opção.
            </p>
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default MortgageRefinanceCalculator;