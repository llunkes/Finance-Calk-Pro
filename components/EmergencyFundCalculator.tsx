import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';

interface EmergencyFundCalculatorProps {
  onBack: () => void;
}

const EmergencyFundCalculator: React.FC<EmergencyFundCalculatorProps> = ({ onBack }) => {
  const [monthlyExpenses, setMonthlyExpenses] = useState(3000);
  
  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.EMERGENCY_FUND);

  const { threeMonths, sixMonths, nineMonths } = useMemo(() => {
    return {
      threeMonths: monthlyExpenses * 3,
      sixMonths: monthlyExpenses * 6,
      nineMonths: monthlyExpenses * 9,
    };
  }, [monthlyExpenses]);

  const handleSave = () => {
    saveEntry({
        inputs: { monthlyExpenses },
        results: { sixMonthsIdeal: sixMonths }
    });
  };

  const handleLoad = (data: any) => {
    setMonthlyExpenses(data.inputs.monthlyExpenses);
  };

  const renderHistoryEntry = (data: any) => (
    <>
        <p><strong>Despesa Mensal:</strong> {formatCurrency(data.inputs.monthlyExpenses)}</p>
        <p><strong>Meta Ideal (6m):</strong> {formatCurrency(data.results.sixMonthsIdeal)}</p>
    </>
  );

  return (
    <CalculatorWrapper 
        title="Calculadora de Fundo de Emergência" 
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
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Seus Custos</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Despesas Mensais Essenciais (R$)</label>
              <input 
                type="number" 
                value={monthlyExpenses} 
                onChange={(e) => setMonthlyExpenses(parseFloat(e.target.value) || 0)} 
                className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" 
                placeholder="Ex: 3000"
              />
            </div>
             <p className="text-xs text-slate dark:text-slate-light mt-2">
                Inclua apenas os gastos essenciais como moradia, alimentação, saúde e transporte. O ideal é ter entre 3 a 6 meses de despesas guardado para imprevistos.
            </p>
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4 text-center">Sua Meta de Fundo de Emergência</h2>
            <div className="space-y-4">
                <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg text-center">
                    <h3 className="text-lg font-bold text-slate dark:text-slate-light">Meta Mínima (3 Meses)</h3>
                    <p className="text-3xl font-mono text-green-accent">{formatCurrency(threeMonths)}</p>
                    <p className="text-sm text-slate dark:text-slate-light mt-1">Para maior segurança</p>
                </div>
                 <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg text-center">
                    <h3 className="text-lg font-bold text-slate dark:text-slate-light">Meta Ideal (6 Meses)</h3>
                    <p className="text-3xl font-mono text-green-accent">{formatCurrency(sixMonths)}</p>
                    <p className="text-sm text-slate dark:text-slate-light mt-1">Para profissionais autônomos ou maior estabilidade</p>
                </div>
                 <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg text-center">
                    <h3 className="text-lg font-bold text-slate dark:text-slate-light">Meta Conservadora (9 Meses)</h3>
                    <p className="text-3xl font-mono text-green-accent">{formatCurrency(nineMonths)}</p>
                </div>
            </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default EmergencyFundCalculator;