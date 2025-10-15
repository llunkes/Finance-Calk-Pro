import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/formatters';
import CalculatorWrapper from './CalculatorWrapper';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';

interface RetirementCalculatorProps {
  onBack: () => void;
}

const RetirementCalculator: React.FC<RetirementCalculatorProps> = ({ onBack }) => {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualRate, setAnnualRate] = useState(7);

  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.RETIREMENT);

  const chartData = useMemo(() => {
    const results: { age: number; totalValue: number; totalContributed: number }[] = [];
    const monthlyRate = annualRate / 100 / 12;
    const yearsToInvest = retirementAge - currentAge;
    if (yearsToInvest <= 0) return [];

    let currentValue = currentSavings;
    let totalContributed = currentSavings;
    
    results.push({ age: currentAge, totalValue: currentValue, totalContributed: totalContributed });

    for (let year = 1; year <= yearsToInvest; year++) {
      for (let month = 1; month <= 12; month++) {
        currentValue = currentValue * (1 + monthlyRate) + monthlyContribution;
        totalContributed += monthlyContribution;
      }
      results.push({
        age: currentAge + year,
        totalValue: currentValue,
        totalContributed: totalContributed,
      });
    }
    return results;
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, annualRate]);

  const finalValues = chartData[chartData.length - 1] || { totalValue: currentSavings, totalContributed: currentSavings };
  const totalInterest = finalValues.totalValue - finalValues.totalContributed;

  const handleSave = () => {
    saveEntry({
      inputs: { currentAge, retirementAge, currentSavings, monthlyContribution, annualRate },
      results: { totalValue: finalValues.totalValue }
    });
  };

  const handleLoad = (data: any) => {
    setCurrentAge(data.inputs.currentAge);
    setRetirementAge(data.inputs.retirementAge);
    setCurrentSavings(data.inputs.currentSavings);
    setMonthlyContribution(data.inputs.monthlyContribution);
    setAnnualRate(data.inputs.annualRate);
  };

  const renderHistoryEntry = (data: any) => (
    <>
      <p>Aposentadoria aos {data.inputs.retirementAge} anos</p>
      <p><strong>Resultado Estimado:</strong> {formatCurrency(data.results.totalValue)}</p>
    </>
  );

  return (
    <CalculatorWrapper 
      title="Calculadora de Aposentadoria" 
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
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Seus Dados</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate dark:text-slate-light">Idade Atual</label>
                <input type="number" value={currentAge} onChange={(e) => setCurrentAge(parseInt(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate dark:text-slate-light">Idade Aposent.</label>
                <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(parseInt(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Poupança Atual (R$)</label>
              <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Contribuição Mensal (R$)</label>
              <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Taxa de Retorno Anual (%)</label>
              <input type="number" value={annualRate} onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Resultado da Simulação</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
             <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
              <h3 className="text-md font-bold text-slate dark:text-slate-light">Valor Estimado</h3>
              <p className="text-2xl font-mono text-green-accent">{formatCurrency(finalValues.totalValue)}</p>
            </div>
             <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
              <h3 className="text-md font-bold text-slate dark:text-slate-light">Total Contribuído</h3>
              <p className="text-2xl font-mono text-slate-light">{formatCurrency(finalValues.totalContributed)}</p>
            </div>
             <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
              <h3 className="text-md font-bold text-slate dark:text-slate-light">Total em Juros</h3>
              <p className="text-2xl font-mono text-slate-light">{formatCurrency(totalInterest)}</p>
            </div>
          </div>
          <p className="text-center text-slate dark:text-slate-light mt-4">
            Aos {retirementAge} anos, você terá um patrimônio estimado de {formatCurrency(finalValues.totalValue)}.
          </p>
        </div>
      </div>
      
      <div className="mt-8 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Projeção de Crescimento do Patrimônio</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#495670" />
              <XAxis dataKey="age" name="Idade" stroke="#A8B2D1" />
              <YAxis stroke="#A8B2D1" tickFormatter={(value) => formatCurrency(value as number)} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0A192F', border: '1px solid #64FFDA' }}
                labelStyle={{ color: '#A8B2D1' }}
                formatter={(value: number, name: string) => [formatCurrency(value), name === 'totalValue' ? 'Patrimônio Total' : 'Total Contribuído']}
              />
              <Legend wrapperStyle={{ color: '#A8B2D1' }} />
              <Area type="monotone" dataKey="totalContributed" name="Total Contribuído" stroke="#8892B0" fill="#8892B0" fillOpacity={0.3} />
              <Area type="monotone" dataKey="totalValue" name="Patrimônio Total" stroke="#64FFDA" fill="#64FFDA" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default RetirementCalculator;
