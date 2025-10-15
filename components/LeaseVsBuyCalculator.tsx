// fix: Removed stale comment.
import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';

interface LeaseVsBuyCalculatorProps {
  onBack: () => void;
}

const LeaseVsBuyCalculator: React.FC<LeaseVsBuyCalculatorProps> = ({ onBack }) => {
  const [propertyValue, setPropertyValue] = useState(500000);
  const [downPayment, setDownPayment] = useState(100000);
  const [loanTerm, setLoanTerm] = useState(30); // years
  const [interestRate, setInterestRate] = useState(8); // %
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2); // %
  const [maintenance, setMaintenance] = useState(5000); // annual
  
  const [monthlyRent, setMonthlyRent] = useState(2000);
  const [investmentReturnRate, setInvestmentReturnRate] = useState(6); // %
  
  const [comparisonPeriod, setComparisonPeriod] = useState(10); // years

  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.LEASE_VS_BUY);

  const { totalCostToBuy, totalCostToRent, advantage } = useMemo(() => {
    const loanAmount = propertyValue - downPayment;
    const monthlyInterestRate = (interestRate / 100) / 12;
    const numPayments = loanTerm * 12;

    const mortgagePayment = loanAmount > 0 
      ? loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numPayments)) / (Math.pow(1 + monthlyInterestRate, numPayments) - 1)
      : 0;

    let costToBuy = downPayment;
    let equity = downPayment;
    let rentCost = 0;
    let opportunityCost = 0;
    
    for (let i = 1; i <= comparisonPeriod * 12; i++) {
        const buyMonthlyCost = mortgagePayment + (propertyValue * (propertyTaxRate / 100) / 12) + (maintenance / 12);
        costToBuy += buyMonthlyCost;
        
        // Simplified equity calculation
        if(loanAmount > 0) {
            const interestPayment = (loanAmount - (equity - downPayment)) * monthlyInterestRate;
            const principalPayment = mortgagePayment - interestPayment;
            equity += principalPayment;
        }

        rentCost += monthlyRent;
        // Opportunity cost of down payment and cost differences
        opportunityCost = (opportunityCost + (downPayment / (comparisonPeriod*12)) + (buyMonthlyCost - monthlyRent)) * (1 + (investmentReturnRate / 100 / 12));
    }

    // Simplified final calculation without property appreciation for neutrality
    const finalBuyCost = costToBuy - equity;
    const finalRentCost = rentCost + opportunityCost;
    
    return { 
        totalCostToBuy: finalBuyCost, 
        totalCostToRent: finalRentCost,
        advantage: finalRentCost - finalBuyCost,
    };
  }, [propertyValue, downPayment, loanTerm, interestRate, propertyTaxRate, maintenance, monthlyRent, investmentReturnRate, comparisonPeriod]);

  const handleSave = () => {
    saveEntry({
        inputs: { propertyValue, downPayment, loanTerm, interestRate, propertyTaxRate, maintenance, monthlyRent, investmentReturnRate, comparisonPeriod },
        results: { advantage }
    });
  };

  const handleLoad = (data: any) => {
    const { inputs } = data;
    setPropertyValue(inputs.propertyValue);
    setDownPayment(inputs.downPayment);
    setLoanTerm(inputs.loanTerm);
    setInterestRate(inputs.interestRate);
    setPropertyTaxRate(inputs.propertyTaxRate);
    setMaintenance(inputs.maintenance);
    setMonthlyRent(inputs.monthlyRent);
    setInvestmentReturnRate(inputs.investmentReturnRate);
    setComparisonPeriod(inputs.comparisonPeriod);
  };

  const renderHistoryEntry = (data: any) => (
    <>
        <p>Comparação em {data.inputs.comparisonPeriod} anos</p>
        <p><strong>Vantagem:</strong> {formatCurrency(data.results.advantage)}</p>
    </>
  );

  const inputStyle = "mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent";

  return (
    <CalculatorWrapper 
        title="Calculadora: Alugar vs. Comprar Imóvel" 
        onBack={onBack}
        onSave={handleSave}
        history={history}
        onLoadHistory={handleLoad}
        onDeleteHistory={deleteEntry}
        onClearHistory={clearHistory}
        renderHistoryEntry={renderHistoryEntry}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-8">
            <div className="bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Parâmetros da Compra</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate dark:text-slate-light">Valor do Imóvel</label>
                        <input type="number" value={propertyValue} onChange={(e) => setPropertyValue(parseFloat(e.target.value) || 0)} className={inputStyle} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate dark:text-slate-light">Entrada</label>
                        <input type="number" value={downPayment} onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)} className={inputStyle} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate dark:text-slate-light">Prazo Finan. (anos)</label>
                        <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(parseInt(e.target.value) || 0)} className={inputStyle} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate dark:text-slate-light">Juros Finan. (% a.a.)</label>
                        <input type="number" value={interestRate} onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)} className={inputStyle} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate dark:text-slate-light">Impostos (% a.a.)</label>
                        <input type="number" value={propertyTaxRate} onChange={(e) => setPropertyTaxRate(parseFloat(e.target.value) || 0)} className={inputStyle} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate dark:text-slate-light">Manutenção (R$/ano)</label>
                        <input type="number" value={maintenance} onChange={(e) => setMaintenance(parseFloat(e.target.value) || 0)} className={inputStyle} />
                    </div>
                </div>
            </div>
             <div className="bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Parâmetros do Aluguel</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate dark:text-slate-light">Aluguel Mensal</label>
                        <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(parseFloat(e.target.value) || 0)} className={inputStyle} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate dark:text-slate-light">Retorno Invest. (% a.a.)</label>
                        <input type="number" value={investmentReturnRate} onChange={(e) => setInvestmentReturnRate(parseFloat(e.target.value) || 0)} className={inputStyle} />
                    </div>
                </div>
            </div>
        </div>

        {/* Results */}
        <div className="bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4 text-center">Análise de Custo em {comparisonPeriod} Anos</h2>
             <div className="mb-4">
                <label className="block text-sm font-medium text-slate dark:text-slate-light text-center">Período de Comparação (Anos)</label>
                <input type="range" min="1" max="30" value={comparisonPeriod} onChange={(e) => setComparisonPeriod(parseInt(e.target.value))} className="w-full h-2 bg-slate-dark rounded-lg appearance-none cursor-pointer" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center mb-6">
                 <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
                    <h3 className="text-md font-bold text-slate dark:text-slate-light">Custo Total de Comprar</h3>
                    <p className="text-2xl font-mono text-red-400">{formatCurrency(totalCostToBuy)}</p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
                    <h3 className="text-md font-bold text-slate dark:text-slate-light">Custo Total de Alugar</h3>
                    <p className="text-2xl font-mono text-blue-400">{formatCurrency(totalCostToRent)}</p>
                </div>
            </div>
            <div className={`p-4 rounded-lg text-center ${advantage > 0 ? 'bg-green-accent/20 text-green-accent' : 'bg-blue-400/20 text-blue-400'}`}>
                <p className="font-bold text-lg">
                    {advantage > 0 
                        ? `Comprar é ${formatCurrency(advantage)} mais vantajoso.`
                        : `Alugar é ${formatCurrency(Math.abs(advantage))} mais vantajoso.`
                    }
                </p>
                <p className="text-sm">No período de {comparisonPeriod} anos.</p>
            </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default LeaseVsBuyCalculator;