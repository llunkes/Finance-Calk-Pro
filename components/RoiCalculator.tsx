import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';

interface RoiCalculatorProps {
  onBack: () => void;
}

const RoiCalculator: React.FC<RoiCalculatorProps> = ({ onBack }) => {
  const [investmentCost, setInvestmentCost] = useState(5000);
  const [investmentGain, setInvestmentGain] = useState(7500);

  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.ROI);

  const { roi, netProfit } = useMemo(() => {
    if (investmentCost <= 0) {
      return { roi: 0, netProfit: 0 };
    }
    const net = investmentGain - investmentCost;
    const calculatedRoi = (net / investmentCost) * 100;
    return { roi: calculatedRoi, netProfit: net };
  }, [investmentCost, investmentGain]);
  
  const handleSave = () => {
    saveEntry({
        inputs: { investmentCost, investmentGain },
        results: { roi, netProfit }
    });
  };

  const handleLoad = (data: any) => {
    setInvestmentCost(data.inputs.investmentCost);
    setInvestmentGain(data.inputs.investmentGain);
  };

  const renderHistoryEntry = (data: any) => (
    <>
        <p>Custo: {formatCurrency(data.inputs.investmentCost)} | Ganho: {formatCurrency(data.inputs.investmentGain)}</p>
        <p><strong>ROI:</strong> {data.results.roi.toFixed(2)}%</p>
    </>
  );

  return (
    <CalculatorWrapper 
        title="Calculadora de ROI (Retorno sobre Investimento)" 
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
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Dados do Investimento</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Custo do Investimento (R$)</label>
              <input type="number" value={investmentCost} onChange={(e) => setInvestmentCost(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Ganho do Investimento (R$)</label>
              <input type="number" value={investmentGain} onChange={(e) => setInvestmentGain(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg flex items-center justify-center">
            <div className="text-center p-4">
                <p className="text-lg text-slate dark:text-slate-light">
                    O Retorno sobre o Investimento (ROI) foi de:
                </p>
                <p className="text-5xl font-bold text-green-accent my-4 font-mono">
                    {roi.toFixed(2)}%
                </p>
                <div className="mt-6 pt-4 border-t border-slate-dark w-full">
                    <p className="text-lg text-slate dark:text-slate-light">
                        Lucro Líquido: <span className="font-bold text-white">{formatCurrency(netProfit)}</span>
                    </p>
                </div>
            </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default RoiCalculator;