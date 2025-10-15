import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { Debt, CalculatorView } from '../types';
import { PlusIcon, XMarkIcon } from './Icons';
import { useHistory } from '../utils/useHistory';

interface DebtPayoffPlannerProps {
  onBack: () => void;
}

const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});

type Strategy = 'avalanche' | 'snowball';

const DebtPayoffPlanner: React.FC<DebtPayoffPlannerProps> = ({ onBack }) => {
  const [debts, setDebts] = useState<Debt[]>([
    { id: uuidv4(), name: 'Cartão de Crédito', balance: 5000, rate: 18.5, minPayment: 150 },
    { id: uuidv4(), name: 'Financiamento Estudantil', balance: 20000, rate: 5.0, minPayment: 250 },
    { id: uuidv4(), name: 'Empréstimo Carro', balance: 15000, rate: 9.0, minPayment: 400 },
  ]);
  const [extraPayment, setExtraPayment] = useState(200);
  const [strategy, setStrategy] = useState<Strategy>('avalanche');

  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.DEBT_PAYOFF);

  const handleDebtChange = (id: string, field: keyof Omit<Debt, 'id'>, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setDebts(debts.map(d => d.id === id ? { ...d, [field]: numericValue } : d));
  };

  const addDebt = () => {
    setDebts([...debts, { id: uuidv4(), name: 'Nova Dívida', balance: 0, rate: 0, minPayment: 0 }]);
  };

  const removeDebt = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  const payoffPlan = useMemo(() => {
    if (debts.some(d => d.balance <= 0)) return { schedule: [], totalInterest: 0, totalMonths: 0 };
    
    let currentDebts = JSON.parse(JSON.stringify(debts)) as Debt[];
    let availableExtra = extraPayment;
    const schedule: { month: number, payments: { name: string, payment: number }[], totalPaid: number, remainingBalance: number }[] = [];
    let months = 0;
    let totalInterestPaid = 0;

    const sortFunction = (a: Debt, b: Debt) => {
      if (strategy === 'avalanche') return b.rate - a.rate;
      return a.balance - b.balance;
    };
    
    while(currentDebts.some(d => d.balance > 0) && months < 360) { // Cap at 30 years
        months++;
        let monthTotalPayment = 0;
        const monthPayments: { name: string, payment: number }[] = [];
        currentDebts.sort(sortFunction);

        // Apply interest
        currentDebts.forEach(debt => {
            const monthlyRate = debt.rate / 100 / 12;
            const interest = debt.balance * monthlyRate;
            debt.balance += interest;
            totalInterestPaid += interest;
        });

        let extraForSnowball = availableExtra;
        
        // Make minimum payments
        currentDebts.forEach(debt => {
            const payment = Math.min(debt.balance, debt.minPayment);
            debt.balance -= payment;
            monthTotalPayment += payment;
            monthPayments.push({ name: debt.name, payment: payment });
        });
        
        // Apply extra payment to target debt
        if (extraForSnowball > 0) {
            for (const debt of currentDebts) {
                if (debt.balance > 0) {
                    const payment = Math.min(debt.balance, extraForSnowball);
                    debt.balance -= payment;
                    monthTotalPayment += payment;
                    const existingPayment = monthPayments.find(p => p.name === debt.name);
                    if(existingPayment) existingPayment.payment += payment;
                    else monthPayments.push({name: debt.name, payment: payment});
                    extraForSnowball -= payment;
                    if (extraForSnowball <= 0) break;
                }
            }
        }
        
        // Check for paid-off debts and reallocate their min payments
        const paidOffDebts = currentDebts.filter(d => d.balance <= 0);
        paidOffDebts.forEach(paidDebt => {
            availableExtra += paidDebt.minPayment;
            paidDebt.minPayment = 0;
        });
        currentDebts = currentDebts.filter(d => d.balance > 0);

        const totalRemaining = currentDebts.reduce((sum, d) => sum + d.balance, 0);
        schedule.push({ month: months, payments: monthPayments, totalPaid: monthTotalPayment, remainingBalance: totalRemaining });
    }

    return { schedule, totalInterest: totalInterestPaid, totalMonths: months };

  }, [debts, extraPayment, strategy]);

  const totalMinimumPayments = debts.reduce((sum, d) => sum + d.minPayment, 0);
  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);

  const handleSave = () => {
    saveEntry({
        inputs: { debts, extraPayment, strategy },
        results: { totalMonths: payoffPlan.totalMonths, totalInterest: payoffPlan.totalInterest }
    });
  };

  const handleLoad = (data: any) => {
    setDebts(data.inputs.debts);
    setExtraPayment(data.inputs.extraPayment);
    setStrategy(data.inputs.strategy);
  };

  const renderHistoryEntry = (data: any) => (
    <>
        <p>Plano com {data.inputs.debts.length} dívida(s) e {formatCurrency(data.inputs.extraPayment)} extra.</p>
        <p><strong>Tempo:</strong> {Math.floor(data.results.totalMonths / 12)}a {data.results.totalMonths % 12}m</p>
    </>
  );

  return (
    <CalculatorWrapper 
        title="Planejador de Quitação de Dívidas" 
        onBack={onBack}
        onSave={handleSave}
        history={history}
        onLoadHistory={handleLoad}
        onDeleteHistory={deleteEntry}
        onClearHistory={clearHistory}
        renderHistoryEntry={renderHistoryEntry}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {/* Inputs */}
          <div className="bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg h-fit">
            <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Suas Dívidas</h2>
            <div className="space-y-4">
              {debts.map((debt) => (
                <div key={debt.id} className="p-3 bg-gray-100 dark:bg-navy rounded-md relative">
                   <button onClick={() => removeDebt(debt.id)} className="absolute top-2 right-2 text-slate hover:text-red-400 p-1 rounded-full"><XMarkIcon className="w-4 h-4" /></button>
                   <input value={debt.name} onChange={(e) => handleDebtChange(debt.id, 'name', e.target.value)} className="font-bold bg-transparent w-full mb-2 text-navy dark:text-white" />
                   <div className="grid grid-cols-3 gap-2 text-xs">
                     <div><label className="text-slate dark:text-slate-light">Saldo</label><input type="number" value={debt.balance} onChange={e => handleDebtChange(debt.id, 'balance', e.target.value)} className="w-full p-1 bg-white dark:bg-slate-dark rounded text-navy dark:text-white" /></div>
                     <div><label className="text-slate dark:text-slate-light">Juros (%)</label><input type="number" value={debt.rate} onChange={e => handleDebtChange(debt.id, 'rate', e.target.value)} className="w-full p-1 bg-white dark:bg-slate-dark rounded text-navy dark:text-white" /></div>
                     <div><label className="text-slate dark:text-slate-light">Mínimo</label><input type="number" value={debt.minPayment} onChange={e => handleDebtChange(debt.id, 'minPayment', e.target.value)} className="w-full p-1 bg-white dark:bg-slate-dark rounded text-navy dark:text-white" /></div>
                   </div>
                </div>
              ))}
              <button onClick={addDebt} className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-slate-dark text-slate dark:text-slate-light rounded-md hover:bg-slate-dark hover:text-white transition-colors">
                  <PlusIcon className="w-5 h-5"/> Adicionar Dívida
              </button>
            </div>
          </div>
          {/* Strategy */}
          <div className="bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg h-fit">
              <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Estratégia</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate dark:text-slate-light">Pagamento Extra Mensal (R$)</label>
                  <input type="number" value={extraPayment} onChange={e => setExtraPayment(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate dark:text-slate-light">Método de Pagamento</label>
                  <select value={strategy} onChange={e => setStrategy(e.target.value as Strategy)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent">
                    <option value="avalanche">Avalanche (Juros mais altos primeiro)</option>
                    <option value="snowball">Bola de Neve (Saldo mais baixo primeiro)</option>
                  </select>
                </div>
              </div>
          </div>
        </div>
        {/* Results */}
        <div className="lg:col-span-2 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Plano de Pagamento</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-6">
              <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
                  <h3 className="text-md font-bold text-slate dark:text-slate-light">Tempo para Quitar</h3>
                  <p className="text-2xl font-mono text-green-accent">{Math.floor(payoffPlan.totalMonths / 12)}a {payoffPlan.totalMonths % 12}m</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
                  <h3 className="text-md font-bold text-slate dark:text-slate-light">Total de Juros</h3>
                  <p className="text-2xl font-mono text-green-accent">{formatCurrency(payoffPlan.totalInterest)}</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
                  <h3 className="text-md font-bold text-slate dark:text-slate-light">Pagamento Total</h3>
                  <p className="text-2xl font-mono text-green-accent">{formatCurrency(totalDebt + payoffPlan.totalInterest)}</p>
              </div>
          </div>
          <p className="text-sm text-center text-slate dark:text-slate-light mb-4">Pagamento mensal total: {formatCurrency(totalMinimumPayments + extraPayment)}</p>
           <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-sm text-left text-slate dark:text-slate-light">
                  <thead className="text-xs text-slate-dark dark:text-slate-light uppercase bg-gray-100 dark:bg-navy sticky top-0">
                      <tr>
                          <th className="px-4 py-2">Mês</th>
                          <th className="px-4 py-2">Pagamento Total</th>
                          <th className="px-4 py-2">Saldo Devedor</th>
                      </tr>
                  </thead>
                  <tbody>
                      {payoffPlan.schedule.map(row => (
                          <tr key={row.month} className="border-b border-slate-dark">
                              <td className="px-4 py-2">{row.month}</td>
                              <td className="px-4 py-2 font-mono">{formatCurrency(row.totalPaid)}</td>
                              <td className="px-4 py-2 font-mono">{formatCurrency(row.remainingBalance)}</td>
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

export default DebtPayoffPlanner;