import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { InterestDataPoint, CalculatorView } from '../types';
import CalculatorWrapper from './CalculatorWrapper';
import { useHistory } from '../utils/useHistory';

interface InterestCalculatorProps {
  onBack: () => void;
}

const InterestCalculator: React.FC<InterestCalculatorProps> = ({ onBack }) => {
  const [principal, setPrincipal] = useState(1000);
  const [rate, setRate] = useState(5);
  const [time, setTime] = useState(10);
  const [period, setPeriod] = useState<'years' | 'months'>('years');
  
  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.INTEREST);

  const data = useMemo<InterestDataPoint[]>(() => {
    const results: InterestDataPoint[] = [];
    const monthlyRate = period === 'years' ? rate / 100 / 12 : rate / 100;
    const totalPeriods = period === 'years' ? time * 12 : time;
    let totalSimple = principal;
    let totalCompound = principal;

    for (let i = 1; i <= totalPeriods; i++) {
        const simpleInterestForPeriod = principal * monthlyRate;
        totalSimple += simpleInterestForPeriod;

        const compoundInterestForPeriod = totalCompound * monthlyRate;
        totalCompound += compoundInterestForPeriod;
        
        if (i % (period === 'years' ? 12 : 1) === 0) {
            const currentPeriod = i / (period === 'years' ? 12 : 1);
            results.push({
                period: currentPeriod,
                simpleInterest: totalSimple - principal,
                compoundInterest: totalCompound - principal,
                totalSimple: totalSimple,
                totalCompound: totalCompound,
            });
        }
    }
    return results;
  }, [principal, rate, time, period]);

  const finalValues = data[data.length - 1] || { totalSimple: principal, totalCompound: principal, simpleInterest: 0, compoundInterest: 0 };

  const handleSave = () => {
    saveEntry({
        inputs: { principal, rate, time, period },
        results: { totalSimple: finalValues.totalSimple, totalCompound: finalValues.totalCompound }
    });
  };

  const handleLoad = (data: any) => {
    setPrincipal(data.inputs.principal);
    setRate(data.inputs.rate);
    setTime(data.inputs.time);
    setPeriod(data.inputs.period);
  };

  const renderHistoryEntry = (data: any) => (
    <>
        <p><strong>Principal:</strong> {formatCurrency(data.inputs.principal)} @ {data.inputs.rate}% por {data.inputs.time} {data.inputs.period}</p>
        <p><strong>Resultado (Composto):</strong> {formatCurrency(data.results.totalCompound)}</p>
    </>
  );

  const pieDataSimple = [
    { name: 'Principal', value: principal },
    { name: 'Juros Simples', value: finalValues.simpleInterest },
  ];

  const pieDataCompound = [
    { name: 'Principal', value: principal },
    { name: 'Juros Compostos', value: finalValues.compoundInterest },
  ];

  const COLORS = ['#8892B0', '#64FFDA'];

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
        title="Calculadora de Juros Simples e Compostos" 
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
        <div className="md:col-span-1 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Parâmetros</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Principal (R$)</label>
              <input type="number" value={principal} onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Taxa de Juros (%)</label>
              <input type="number" value={rate} onChange={(e) => setRate(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate dark:text-slate-light">Período</label>
                <input type="number" value={time} onChange={(e) => setTime(parseInt(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate dark:text-slate-light">Unidade</label>
                <select value={period} onChange={(e) => setPeriod(e.target.value as 'years' | 'months')} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent">
                  <option value="years">Anos</option>
                  <option value="months">Meses</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="md:col-span-2 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Resultados Finais</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
              <h3 className="text-lg font-bold text-slate dark:text-slate-light">Juros Simples</h3>
              <p className="text-2xl font-mono text-green-accent">{formatCurrency(finalValues.totalSimple)}</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
              <h3 className="text-lg font-bold text-slate dark:text-slate-light">Juros Compostos</h3>
              <p className="text-2xl font-mono text-green-accent">{formatCurrency(finalValues.totalCompound)}</p>
            </div>
          </div>
          {renderExportButton()}
        </div>
      </div>

      {/* Charts */}
      <div className="mt-8 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Evolução do Investimento</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#495670" />
              <XAxis dataKey="period" stroke="#A8B2D1" label={{ value: `Período (${period === 'years' ? 'Anos' : 'Meses'})`, position: 'insideBottom', offset: -5, fill: '#A8B2D1' }} />
              <YAxis stroke="#A8B2D1" tickFormatter={(value) => formatCurrency(value as number)} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0A192F', border: '1px solid #64FFDA' }}
                labelStyle={{ color: '#A8B2D1' }}
                formatter={(value: number, name: string) => [formatCurrency(value), name === 'totalSimple' ? 'Juros Simples' : 'Juros Compostos']}
              />
              <Legend wrapperStyle={{ color: '#A8B2D1' }} />
              <Line type="monotone" dataKey="totalSimple" name="Juros Simples" stroke="#8892B0" />
              <Line type="monotone" dataKey="totalCompound" name="Juros Compostos" stroke="#64FFDA" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4 text-center">Composição - Juros Simples</h2>
            <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={pieDataSimple} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                            {pieDataSimple.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
         <div className="bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4 text-center">Composição - Juros Compostos</h2>
            <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={pieDataCompound} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                            {pieDataCompound.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default InterestCalculator;
