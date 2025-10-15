import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';

interface TipCalculatorProps {
  onBack: () => void;
}

const TipCalculator: React.FC<TipCalculatorProps> = ({ onBack }) => {
  const [billAmount, setBillAmount] = useState(100);
  const [tipPercentage, setTipPercentage] = useState(15);
  const [people, setPeople] = useState(1);

  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.TIP);

  const { tipAmount, totalAmount, perPersonAmount } = useMemo(() => {
    if (billAmount <= 0) {
      return { tipAmount: 0, totalAmount: 0, perPersonAmount: 0 };
    }
    const tip = billAmount * (tipPercentage / 100);
    const total = billAmount + tip;
    const perPerson = people > 0 ? total / people : 0;
    return { tipAmount: tip, totalAmount: total, perPersonAmount: perPerson };
  }, [billAmount, tipPercentage, people]);
  
  const tipOptions = [10, 15, 18, 20, 25];

  const handleSave = () => {
    saveEntry({
        inputs: { billAmount, tipPercentage, people },
        results: { totalAmount, perPersonAmount }
    });
  };

  const handleLoad = (data: any) => {
    setBillAmount(data.inputs.billAmount);
    setTipPercentage(data.inputs.tipPercentage);
    setPeople(data.inputs.people);
  };

  const renderHistoryEntry = (data: any) => (
    <>
        <p>Conta: {formatCurrency(data.inputs.billAmount)} para {data.inputs.people} pessoa(s)</p>
        <p><strong>Total por Pessoa:</strong> {formatCurrency(data.results.perPersonAmount)}</p>
    </>
  );

  return (
    <CalculatorWrapper 
        title="Calculadora de Gorjeta e Divisão de Contas" 
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
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Detalhes da Conta</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Valor da Conta (R$)</label>
              <input type="number" value={billAmount} onChange={(e) => setBillAmount(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Porcentagem da Gorjeta (%)</label>
              <input type="number" value={tipPercentage} onChange={(e) => setTipPercentage(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
              <div className="flex justify-between mt-2">
                {tipOptions.map(tip => (
                    <button key={tip} onClick={() => setTipPercentage(tip)} className={`px-3 py-1 text-sm rounded-md transition-colors ${tipPercentage === tip ? 'bg-green-accent text-navy font-bold' : 'bg-slate-dark text-slate-light'}`}>
                        {tip}%
                    </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Dividir entre (pessoas)</label>
              <input type="number" min="1" step="1" value={people} onChange={(e) => setPeople(parseInt(e.target.value) || 1)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg flex items-center justify-center">
          <div className="w-full">
            <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4 text-center">Resumo</h2>
            <div className="space-y-4">
                <div className="flex justify-between items-baseline p-4 bg-gray-100 dark:bg-navy rounded-lg">
                    <span className="text-lg text-slate dark:text-slate-light">Gorjeta:</span>
                    <span className="text-2xl font-mono text-green-accent">{formatCurrency(tipAmount)}</span>
                </div>
                <div className="flex justify-between items-baseline p-4 bg-gray-100 dark:bg-navy rounded-lg">
                    <span className="text-lg text-slate dark:text-slate-light">Total da Conta:</span>
                    <span className="text-2xl font-mono text-green-accent">{formatCurrency(totalAmount)}</span>
                </div>
                {people > 1 && (
                     <div className="flex justify-between items-baseline p-4 bg-slate-dark rounded-lg">
                        <span className="text-xl text-white font-bold">Total por Pessoa:</span>
                        <span className="text-3xl font-mono text-green-accent font-bold">{formatCurrency(perPersonAmount)}</span>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default TipCalculator;