import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';

interface InflationCalculatorProps {
  onBack: () => void;
}

// Mock CPI data (Consumer Price Index). In a real app, this would be updated regularly.
// Using IPCA (Índice Nacional de Preços ao Consumidor Amplo) accumulated values for Brazil as a base
const MOCK_CPI_DATA: { [year: number]: number } = {
  2000: 100.0,
  2001: 107.7,
  2002: 120.3,
  2003: 131.6,
  2004: 141.6,
  2005: 150.0,
  2006: 154.7,
  2007: 161.6,
  2008: 171.2,
  2009: 178.6,
  2010: 189.1,
  2011: 201.3,
  2012: 212.9,
  2013: 225.4,
  2014: 239.9,
  2015: 265.6,
  2016: 282.2,
  2017: 290.6,
  2018: 301.5,
  2019: 314.5,
  2020: 328.7,
  2021: 361.7,
  2022: 382.6,
  2023: 400.2,
};
const AVAILABLE_YEARS = Object.keys(MOCK_CPI_DATA).map(Number);
const CURRENT_YEAR = Math.max(...AVAILABLE_YEARS);


const InflationCalculator: React.FC<InflationCalculatorProps> = ({ onBack }) => {
  const [amount, setAmount] = useState(100);
  const [startYear, setStartYear] = useState(2010);
  const [endYear, setEndYear] = useState(CURRENT_YEAR);
  
  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.INFLATION);

  const { adjustedValue, inflationRate } = useMemo(() => {
    if (amount <= 0) return { adjustedValue: 0, inflationRate: 0 };

    const startCPI = MOCK_CPI_DATA[startYear];
    const endCPI = MOCK_CPI_DATA[endYear];

    if (!startCPI || !endCPI) return { adjustedValue: 0, inflationRate: 0 };
    
    const adjusted = amount * (endCPI / startCPI);
    const rate = ((endCPI - startCPI) / startCPI) * 100;
    
    return { adjustedValue: adjusted, inflationRate: rate };
  }, [amount, startYear, endYear]);
  
  const handleSave = () => {
    saveEntry({
      inputs: { amount, startYear, endYear },
      results: { adjustedValue, inflationRate }
    });
  };

  const handleLoad = (data: any) => {
    setAmount(data.inputs.amount);
    setStartYear(data.inputs.startYear);
    setEndYear(data.inputs.endYear);
  };

  const renderHistoryEntry = (data: any) => (
    <p>
      {formatCurrency(data.inputs.amount)} de {data.inputs.startYear} → {formatCurrency(data.results.adjustedValue)} em {data.inputs.endYear}
    </p>
  );

  return (
    <CalculatorWrapper 
      title="Calculadora de Inflação" 
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
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Valor (R$)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Ano Inicial</label>
              <select value={startYear} onChange={(e) => setStartYear(parseInt(e.target.value))} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent">
                {AVAILABLE_YEARS.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Ano Final</label>
              <select value={endYear} onChange={(e) => setEndYear(parseInt(e.target.value))} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent">
                {AVAILABLE_YEARS.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Resultado</h2>
           <div className="text-center p-4">
              <p className="text-slate dark:text-slate-light">
                {formatCurrency(amount)} em {startYear} equivalem a
              </p>
              <p className="text-4xl font-bold text-green-accent my-4 font-mono">
                {formatCurrency(adjustedValue)}
              </p>
              <p className="text-slate dark:text-slate-light">
                em {endYear}.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-dark">
                <p className="text-lg font-semibold text-navy dark:text-gray-100">
                  Inflação acumulada no período: <span className="text-green-accent">{inflationRate.toFixed(2)}%</span>
                </p>
              </div>
            </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default InflationCalculator;
