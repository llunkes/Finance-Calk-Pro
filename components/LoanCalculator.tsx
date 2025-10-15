import React, { useState, useMemo } from 'react';
import { LoanSystem, AmortizationEntry, CalculatorView } from '../types';
import { formatCurrency } from '../utils/formatters';
import CalculatorWrapper from './CalculatorWrapper';
import { useHistory } from '../utils/useHistory';

interface LoanCalculatorProps {
  onBack: () => void;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({ onBack }) => {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(1);
  const [periods, setPeriods] = useState(360);
  const [system, setSystem] = useState<LoanSystem>(LoanSystem.PRICE);
  
  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.LOAN);

  const amortizationTable = useMemo<AmortizationEntry[]>(() => {
    const table: AmortizationEntry[] = [];
    const monthlyRate = rate / 100;
    let balance = amount;

    if (amount <= 0 || monthlyRate <= 0 || periods <= 0) return [];

    if (system === LoanSystem.PRICE) {
      const installment = amount * (monthlyRate * Math.pow(1 + monthlyRate, periods)) / (Math.pow(1 + monthlyRate, periods) - 1);
      for (let i = 1; i <= periods; i++) {
        const interest = balance * monthlyRate;
        const amortization = installment - interest;
        balance -= amortization;
        table.push({ installment: i, payment: installment, interest, amortization, balance: balance > 0 ? balance : 0 });
      }
    } else { // SAC
      const amortization = amount / periods;
      for (let i = 1; i <= periods; i++) {
        const interest = balance * monthlyRate;
        const payment = amortization + interest;
        balance -= amortization;
        table.push({ installment: i, payment, interest, amortization, balance: balance > 0 ? balance : 0 });
      }
    }
    return table;
  }, [amount, rate, periods, system]);

  const handleSave = () => {
    saveEntry({
      inputs: { amount, rate, periods, system },
      results: { firstPayment: amortizationTable[0]?.payment || 0, lastPayment: amortizationTable[amortizationTable.length - 1]?.payment || 0 }
    });
  };

  const handleLoad = (data: any) => {
    setAmount(data.inputs.amount);
    setRate(data.inputs.rate);
    setPeriods(data.inputs.periods);
    setSystem(data.inputs.system);
  };

  const renderHistoryEntry = (data: any) => (
    <>
      <p><strong>Valor:</strong> {formatCurrency(data.inputs.amount)} por {data.inputs.periods} meses</p>
      <p><strong>Sistema:</strong> {data.inputs.system}</p>
      <p><strong>1ª Parcela:</strong> {formatCurrency(data.results.firstPayment)}</p>
    </>
  );

  return (
    <CalculatorWrapper 
      title="Calculadora de Financiamentos e Empréstimos" 
      onBack={onBack}
      onSave={handleSave}
      history={history}
      onLoadHistory={handleLoad}
      onDeleteHistory={deleteEntry}
      onClearHistory={clearHistory}
      renderHistoryEntry={renderHistoryEntry}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg h-fit">
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Parâmetros</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Valor do Empréstimo (R$)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Taxa de Juros Mensal (%)</label>
              <input type="number" value={rate} onChange={(e) => setRate(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Número de Parcelas</label>
              <input type="number" value={periods} onChange={(e) => setPeriods(parseInt(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Sistema de Amortização</label>
              <select value={system} onChange={(e) => setSystem(e.target.value as LoanSystem)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent">
                <option value={LoanSystem.PRICE}>Tabela Price</option>
                <option value={LoanSystem.SAC}>Sistema SAC</option>
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
            <h2 className="text-xl font-semibold text-navy dark:text-gray-100">Tabela de Amortização</h2>
            <div>
              <button
                onClick={() => alert('Exportando Tabela...')}
                className="w-full mt-4 sm:mt-0 sm:w-auto px-4 py-2 bg-green-accent text-navy font-bold rounded-md hover:bg-green-accent-dark transition-colors"
              >
                Exportar
              </button>
            </div>
          </div>
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-sm text-left text-slate dark:text-slate-light">
              <thead className="text-xs text-slate-dark dark:text-slate-light uppercase bg-gray-100 dark:bg-navy sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3">Parcela</th>
                  <th scope="col" className="px-6 py-3">Pagamento</th>
                  <th scope="col" className="px-6 py-3">Juros</th>
                  <th scope="col" className="px-6 py-3">Amortização</th>
                  <th scope="col" className="px-6 py-3">Saldo Devedor</th>
                </tr>
              </thead>
              <tbody>
                {amortizationTable.map((row) => (
                  <tr key={row.installment} className="bg-white dark:bg-navy-light border-b border-gray-200 dark:border-slate-dark hover:bg-gray-50 dark:hover:bg-navy">
                    <td className="px-6 py-4 font-medium">{row.installment}</td>
                    <td className="px-6 py-4 text-green-accent font-mono">{formatCurrency(row.payment)}</td>
                    <td className="px-6 py-4 font-mono">{formatCurrency(row.interest)}</td>
                    <td className="px-6 py-4 font-mono">{formatCurrency(row.amortization)}</td>
                    <td className="px-6 py-4 font-mono">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default LoanCalculator;
