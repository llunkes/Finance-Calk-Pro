import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';

interface RuleOf72CalculatorProps {
  onBack: () => void;
}

const RuleOf72Calculator: React.FC<RuleOf72CalculatorProps> = ({ onBack }) => {
  const [rate, setRate] = useState(8);
  
  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.RULE_OF_72);

  const yearsToDouble = useMemo(() => {
    if (rate <= 0) {
      return Infinity;
    }
    return 72 / rate;
  }, [rate]);
  
  const handleSave = () => {
    saveEntry({
      inputs: { rate },
      results: { yearsToDouble }
    });
  };

  const handleLoad = (data: any) => {
    setRate(data.inputs.rate);
  };

  const renderHistoryEntry = (data: any) => (
    <p>
      Com {data.inputs.rate}% de retorno, dobra em <strong>{data.results.yearsToDouble.toFixed(2)} anos</strong>.
    </p>
  );

  return (
    <CalculatorWrapper 
      title="Calculadora da Regra dos 72" 
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
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Taxa de Retorno Anual (%)</label>
              <input 
                type="number" 
                value={rate} 
                onChange={(e) => setRate(parseFloat(e.target.value) || 0)} 
                className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" 
                placeholder="Ex: 8"
              />
            </div>
             <p className="text-xs text-slate dark:text-slate-light mt-2">
                A Regra dos 72 é uma forma rápida de estimar o número de anos necessários para duplicar o dinheiro de um investimento com uma taxa de juros anual fixa.
            </p>
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg flex items-center justify-center">
            <div className="text-center p-4">
                <p className="text-lg text-slate dark:text-slate-light">
                    Com uma taxa de retorno de {rate}%, seu investimento levará aproximadamente:
                </p>
                <p className="text-5xl font-bold text-green-accent my-4 font-mono">
                    {isFinite(yearsToDouble) ? `${yearsToDouble.toFixed(2)} anos` : 'N/A'}
                </p>
                <p className="text-lg text-slate dark:text-slate-light">
                    para dobrar de valor.
                </p>
            </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default RuleOf72Calculator;
