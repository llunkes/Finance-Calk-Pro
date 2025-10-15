import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';


interface NetSalaryCalculatorProps {
  onBack: () => void;
}

const NetSalaryCalculator: React.FC<NetSalaryCalculatorProps> = ({ onBack }) => {
  const [grossSalary, setGrossSalary] = useState(5000);
  const [otherDiscounts, setOtherDiscounts] = useState(0);

  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.NET_SALARY);

  const { netSalary, inss, irrf, totalDiscounts } = useMemo(() => {
    // Simplified INSS calculation (mocking 2024 brackets)
    let inssContribution = 0;
    if (grossSalary <= 1412) inssContribution = grossSalary * 0.075;
    else if (grossSalary <= 2666.68) inssContribution = grossSalary * 0.09;
    else if (grossSalary <= 4000.03) inssContribution = grossSalary * 0.12;
    else if (grossSalary <= 7786.02) inssContribution = grossSalary * 0.14;
    else inssContribution = 908.85; // INSS cap
    
    // Simplified IRRF calculation (mocking 2024 brackets)
    const irrfBase = grossSalary - inssContribution;
    let irrfContribution = 0;
    if (irrfBase > 2259.20 && irrfBase <= 2826.65) irrfContribution = (irrfBase * 0.075) - 169.44;
    else if (irrfBase > 2826.65 && irrfBase <= 3751.05) irrfContribution = (irrfBase * 0.15) - 381.44;
    else if (irrfBase > 3751.05 && irrfBase <= 4664.68) irrfContribution = (irrfBase * 0.225) - 662.77;
    else if (irrfBase > 4664.68) irrfContribution = (irrfBase * 0.275) - 896.00;

    irrfContribution = Math.max(0, irrfContribution);

    const total = inssContribution + irrfContribution + otherDiscounts;
    const net = grossSalary - total;

    return { netSalary: net, inss: inssContribution, irrf: irrfContribution, totalDiscounts: total };
  }, [grossSalary, otherDiscounts]);

  const pieData = [
    { name: 'Salário Líquido', value: netSalary },
    { name: 'INSS', value: inss },
    { name: 'IRRF', value: irrf },
    { name: 'Outros Descontos', value: otherDiscounts },
  ].filter(item => item.value > 0);
  
  const COLORS = ['#64FFDA', '#8892B0', '#495670', '#A8B2D1'];

  const handleSave = () => {
    saveEntry({
        inputs: { grossSalary, otherDiscounts },
        results: { netSalary }
    });
  };

  const handleLoad = (data: any) => {
    setGrossSalary(data.inputs.grossSalary);
    setOtherDiscounts(data.inputs.otherDiscounts);
  };

  const renderHistoryEntry = (data: any) => (
    <>
        <p><strong>Salário Bruto:</strong> {formatCurrency(data.inputs.grossSalary)}</p>
        <p><strong>Salário Líquido:</strong> {formatCurrency(data.results.netSalary)}</p>
    </>
  );

  return (
    <CalculatorWrapper 
        title="Calculadora de Salário Líquido" 
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
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Seus Ganhos e Descontos</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Salário Bruto Mensal (R$)</label>
              <input type="number" value={grossSalary} onChange={(e) => setGrossSalary(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Outros Descontos (R$)</label>
              <input type="number" value={otherDiscounts} onChange={(e) => setOtherDiscounts(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
             <p className="text-xs text-slate dark:text-slate-light mt-2">
                Valores de INSS e IRRF são estimativas baseadas em tabelas simplificadas e podem variar.
            </p>
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4 text-center">Resumo do seu Salário</h2>
            <div className="text-center p-4 bg-gray-100 dark:bg-navy rounded-lg mb-6">
                <p className="text-lg text-slate dark:text-slate-light">Seu salário líquido é</p>
                <p className="text-5xl font-bold text-green-accent my-2 font-mono">{formatCurrency(netSalary)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-gray-100 dark:bg-navy rounded"><strong>Salário Bruto:</strong> <span className="float-right font-mono">{formatCurrency(grossSalary)}</span></div>
                <div className="p-3 bg-gray-100 dark:bg-navy rounded"><strong>INSS:</strong> <span className="float-right font-mono text-red-400">-{formatCurrency(inss)}</span></div>
                <div className="p-3 bg-gray-100 dark:bg-navy rounded"><strong>IRRF:</strong> <span className="float-right font-mono text-red-400">-{formatCurrency(irrf)}</span></div>
                <div className="p-3 bg-gray-100 dark:bg-navy rounded"><strong>Outros Descontos:</strong> <span className="float-right font-mono text-red-400">-{formatCurrency(otherDiscounts)}</span></div>
                <div className="col-span-2 p-3 bg-slate-dark text-white rounded"><strong>Total Descontos:</strong> <span className="float-right font-mono">{formatCurrency(totalDiscounts)}</span></div>
            </div>
        </div>
      </div>
      <div className="mt-8 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4 text-center">Composição do Salário Bruto</h2>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default NetSalaryCalculator;