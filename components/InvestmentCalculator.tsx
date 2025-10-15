import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { InvestmentDataPoint, CalculatorView } from '../types';
import CalculatorWrapper from './CalculatorWrapper';
import { useHistory } from '../utils/useHistory';

interface InvestmentCalculatorProps {
  onBack: () => void;
}

const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({ onBack }) => {
  const [initialInvestment, setInitialInvestment] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [rate, setRate] = useState(8); // Annual rate
  const [time, setTime] = useState(10); // Years
  
  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.INVESTMENT);

  const data = useMemo<InvestmentDataPoint[]>(() => {
    const results: InvestmentDataPoint[] = [];
    const monthlyRate = rate / 100 / 12;
    const totalMonths = time * 12;
    let currentValue = initialInvestment;
    let totalInvested = initialInvestment;

    results.push({
      period: 0,
      totalInvested: initialInvestment,
      totalValue: initialInvestment,
    });

    for (let i = 1; i <= totalMonths; i++) {
      // Interest is earned on the current balance
      currentValue *= (1 + monthlyRate);
      // Contribution is added at the end of the month
      currentValue += monthlyContribution;
      totalInvested += monthlyContribution;
      
      if (i % 12 === 0 || i === totalMonths) {
        results.push({
          period: i / 12,
          totalInvested,
          totalValue: currentValue,
        });
      }
    }
    return results;
  }, [initialInvestment, monthlyContribution, rate, time]);

  const finalValues = data[data.length - 1] || { totalValue: initialInvestment, totalInvested: initialInvestment };
  const totalInterest = finalValues.totalValue - finalValues.totalInvested;
  
  const handleSave = () => {
    saveEntry({
      inputs: { initialInvestment, monthlyContribution, rate, time },
      results: { totalValue: finalValues.totalValue, totalInvested: finalValues.totalInvested }
    });
  };

  const handleLoad = (data: any) => {
    setInitialInvestment(data.inputs.initialInvestment);
    setMonthlyContribution(data.inputs.monthlyContribution);
    setRate(data.inputs.rate);
    setTime(data.inputs.time);
  };

  const renderHistoryEntry = (data: any) => (
    <>
      <p><strong>Inicial:</strong> {formatCurrency(data.inputs.initialInvestment)} + {formatCurrency(data.inputs.monthlyContribution)}/mês por {data.inputs.time} anos</p>
      <p><strong>Resultado:</strong> {formatCurrency(data.results.totalValue)}</p>
    </>
  );

  const renderExportButton = () => (
    <div className="mt-6">
      <button
        onClick={() => alert('Exportando para PDF...')}
        className="w-full sm:w-auto px-6 py-2 bg-green-accent text-navy font-bold rounded-md hover:bg-green-accent-dark transition-colors"
      >
        Exportar PDF/Excel
      </button>
    </div>
  );

  return (
    <CalculatorWrapper 
      title="Simulador de Investimentos" 
      onBack={onBack}
      onSave={handleSave}
      history={history}
      onLoadHistory={handleLoad}
      onDeleteHistory={deleteEntry}
      onClearHistory={clearHistory}
      renderHistoryEntry={renderHistoryEntry}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Inputs */}
        <div className="md:col-span-1 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg h-fit">
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Parâmetros</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Investimento Inicial (R$)</label>
              <input type="number" value={initialInvestment} onChange={(e) => setInitialInvestment(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Aporte Mensal (R$)</label>
              <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Rentabilidade Anual (%)</label>
              <input type="number" value={rate} onChange={(e) => setRate(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Período (Anos)</label>
              <input type="number" value={time} onChange={(e) => setTime(parseInt(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="md:col-span-2 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Resultado da Simulação</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
              <h3 className="text-md font-bold text-slate dark:text-slate-light">Valor Final Bruto</h3>
              <p className="text-2xl font-mono text-green-accent">{formatCurrency(finalValues.totalValue)}</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
              <h3 className="text-md font-bold text-slate dark:text-slate-light">Total Investido</h3>
              <p className="text-2xl font-mono text-slate-light">{formatCurrency(finalValues.totalInvested)}</p>
            </div>
             <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
              <h3 className="text-md font-bold text-slate dark:text-slate-light">Total em Juros</h3>
              <p className="text-2xl font-mono text-slate-light">{formatCurrency(totalInterest)}</p>
            </div>
          </div>
          {renderExportButton()}
        </div>
      </div>

      {/* Chart */}
      <div className="mt-8 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Projeção de Crescimento</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#495670" />
              <XAxis dataKey="period" stroke="#A8B2D1" unit="a" label={{ value: `Período (Anos)`, position: 'insideBottom', offset: -5, fill: '#A8B2D1' }} />
              <YAxis stroke="#A8B2D1" tickFormatter={(value) => formatCurrency(value as number)} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0A192F', border: '1px solid #64FFDA' }}
                labelStyle={{ color: '#A8B2D1' }}
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Legend wrapperStyle={{ color: '#A8B2D1' }} />
              <Area type="monotone" dataKey="totalInvested" name="Total Investido" stroke="#8892B0" fill="#8892B0" fillOpacity={0.3} />
              <Area type="monotone" dataKey="totalValue" name="Valor Total" stroke="#64FFDA" fill="#64FFDA" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default InvestmentCalculator;
