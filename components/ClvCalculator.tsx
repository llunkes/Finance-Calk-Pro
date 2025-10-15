import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';

const ClvCalculator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [avgPurchaseValue, setAvgPurchaseValue] = useState(150);
  const [purchaseFrequency, setPurchaseFrequency] = useState(4); // purchases per year
  const [customerLifespan, setCustomerLifespan] = useState(5); // in years
  const [grossMargin, setGrossMargin] = useState(60); // in percent
  const [cac, setCac] = useState(80); // Customer Acquisition Cost

  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.CLV_CALCULATOR);

  const { customerValue, clv, netClv } = useMemo(() => {
    const cv = avgPurchaseValue * purchaseFrequency;
    const calculatedClv = cv * customerLifespan * (grossMargin / 100);
    const calculatedNetClv = calculatedClv - cac;
    
    return {
      customerValue: cv,
      clv: calculatedClv,
      netClv: calculatedNetClv,
    };
  }, [avgPurchaseValue, purchaseFrequency, customerLifespan, grossMargin, cac]);
  
  const handleSave = () => {
    saveEntry({
        inputs: { avgPurchaseValue, purchaseFrequency, customerLifespan, grossMargin, cac },
        results: { netClv }
    });
  };

  const handleLoad = (data: any) => {
    const { inputs } = data;
    setAvgPurchaseValue(inputs.avgPurchaseValue);
    setPurchaseFrequency(inputs.purchaseFrequency);
    setCustomerLifespan(inputs.customerLifespan);
    setGrossMargin(inputs.grossMargin);
    setCac(inputs.cac);
  };

  const renderHistoryEntry = (data: any) => (
    <>
        <p>Ticket Médio: {formatCurrency(data.inputs.avgPurchaseValue)} | CAC: {formatCurrency(data.inputs.cac)}</p>
        <p><strong>CLV Líquido:</strong> {formatCurrency(data.results.netClv)}</p>
    </>
  );

  const inputStyle = "mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent";

  return (
    <CalculatorWrapper 
        title="Calculadora de Valor Vitalício do Cliente (CLV)" 
        onBack={onBack}
        onSave={handleSave}
        history={history}
        onLoadHistory={handleLoad}
        onDeleteHistory={deleteEntry}
        onClearHistory={clearHistory}
        renderHistoryEntry={renderHistoryEntry}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg h-fit">
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Métricas do Cliente</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Valor Médio da Compra (R$)</label>
              <input type="number" value={avgPurchaseValue} onChange={(e) => setAvgPurchaseValue(parseFloat(e.target.value) || 0)} className={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Frequência de Compra (por ano)</label>
              <input type="number" value={purchaseFrequency} onChange={(e) => setPurchaseFrequency(parseFloat(e.target.value) || 0)} className={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Tempo de Vida do Cliente (anos)</label>
              <input type="number" value={customerLifespan} onChange={(e) => setCustomerLifespan(parseFloat(e.target.value) || 0)} className={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Margem Bruta (%)</label>
              <input type="number" value={grossMargin} onChange={(e) => setGrossMargin(parseFloat(e.target.value) || 0)} className={inputStyle} />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Custo de Aquisição (CAC) (R$)</label>
              <input type="number" value={cac} onChange={(e) => setCac(parseFloat(e.target.value) || 0)} className={inputStyle} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4 text-center">Resultados</h2>
            <div className="space-y-4 text-center">
                <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
                    <h3 className="text-md font-bold text-slate dark:text-slate-light">Valor do Cliente (Anual)</h3>
                    <p className="text-2xl font-mono text-slate-light">{formatCurrency(customerValue)}</p>
                </div>
                 <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
                    <h3 className="text-md font-bold text-slate dark:text-slate-light">CLV (Valor Vitalício Bruto)</h3>
                    <p className="text-3xl font-mono text-white">{formatCurrency(clv)}</p>
                </div>
                 <div className="p-4 bg-green-accent/20 rounded-lg">
                    <h3 className="text-md font-bold text-slate dark:text-slate-light">CLV Líquido (após CAC)</h3>
                    <p className="text-4xl font-mono text-green-accent font-bold">{formatCurrency(netClv)}</p>
                </div>
            </div>
            <p className="text-center text-slate dark:text-slate-light mt-6 text-sm">
                O CLV ajuda a tomar decisões sobre marketing, vendas e suporte ao cliente. Um CLV alto indica um negócio saudável.
            </p>
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default ClvCalculator;