import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';

const RentalPropertyCalculator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    // Purchase Info
    const [purchasePrice, setPurchasePrice] = useState(300000);
    const [closingCosts, setClosingCosts] = useState(9000);
    const [downPayment, setDownPayment] = useState(60000);
    const [interestRate, setInterestRate] = useState(7.5);
    const [loanTerm, setLoanTerm] = useState(30);

    // Income
    const [monthlyRent, setMonthlyRent] = useState(2500);
    
    // Expenses
    const [propertyTaxes, setPropertyTaxes] = useState(300);
    const [insurance, setInsurance] = useState(100);
    const [vacancyRate, setVacancyRate] = useState(5); // percent
    const [maintenanceRate, setMaintenanceRate] = useState(8); // percent
    const [managementFee, setManagementFee] = useState(10); // percent

    const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.RENTAL_PROPERTY);

    const {
        monthlyIncome, monthlyExpenses, monthlyCashFlow,
        totalInvestment, capRate, cashOnCashReturn, monthlyNOI
    } = useMemo(() => {
        const loanAmount = purchasePrice - downPayment;
        const totalInvested = downPayment + closingCosts;

        // Income
        const grossMonthlyIncome = monthlyRent;
        const vacancyCost = grossMonthlyIncome * (vacancyRate / 100);
        const effectiveMonthlyIncome = grossMonthlyIncome - vacancyCost;

        // Mortgage Payment
        const monthlyRate = interestRate / 100 / 12;
        const n = loanTerm * 12;
        const mortgage = loanAmount > 0 ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1) : 0;
        
        // Operating Expenses
        const maintenanceCost = grossMonthlyIncome * (maintenanceRate / 100);
        const managementCost = grossMonthlyIncome * (managementFee / 100);
        const operatingExpenses = propertyTaxes + insurance + maintenanceCost + managementCost;
        
        const netOperatingIncome = effectiveMonthlyIncome - operatingExpenses;
        
        // Totals
        const totalMonthlyExpenses = operatingExpenses + mortgage;
        const cashFlow = effectiveMonthlyIncome - totalMonthlyExpenses;
        
        // Metrics
        const annualNOI = netOperatingIncome * 12;
        const calculatedCapRate = (annualNOI / purchasePrice) * 100;
        const annualCashFlow = cashFlow * 12;
        const calculatedCoC = (annualCashFlow / totalInvested) * 100;

        return {
            monthlyIncome: effectiveMonthlyIncome,
            monthlyExpenses: totalMonthlyExpenses,
            monthlyCashFlow: cashFlow,
            totalInvestment: totalInvested,
            capRate: isFinite(calculatedCapRate) ? calculatedCapRate : 0,
            cashOnCashReturn: isFinite(calculatedCoC) ? calculatedCoC : 0,
            monthlyNOI: netOperatingIncome
        };
    }, [purchasePrice, closingCosts, downPayment, interestRate, loanTerm, monthlyRent, propertyTaxes, insurance, vacancyRate, maintenanceRate, managementFee]);
    
    const handleSave = () => {
        saveEntry({
            inputs: { purchasePrice, closingCosts, downPayment, interestRate, loanTerm, monthlyRent, propertyTaxes, insurance, vacancyRate, maintenanceRate, managementFee },
            results: { monthlyCashFlow, capRate, cashOnCashReturn }
        });
    };
    
    const handleLoad = (data: any) => {
        const { inputs } = data;
        setPurchasePrice(inputs.purchasePrice);
        setClosingCosts(inputs.closingCosts);
        setDownPayment(inputs.downPayment);
        setInterestRate(inputs.interestRate);
        setLoanTerm(inputs.loanTerm);
        setMonthlyRent(inputs.monthlyRent);
        setPropertyTaxes(inputs.propertyTaxes);
        setInsurance(inputs.insurance);
        setVacancyRate(inputs.vacancyRate);
        setMaintenanceRate(inputs.maintenanceRate);
        setManagementFee(inputs.managementFee);
    };

    const renderHistoryEntry = (data: any) => (
        <>
            <p>Imóvel de {formatCurrency(data.inputs.purchasePrice)}</p>
            <p><strong>Fluxo de Caixa:</strong> {formatCurrency(data.results.monthlyCashFlow)}/mês</p>
        </>
    );

    const inputStyle = "mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent";

    return (
        <CalculatorWrapper 
            title="Análise de Imóvel para Aluguel" 
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
                <div className="space-y-6">
                    <div className="bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-bold text-navy dark:text-white mb-3">Compra e Financiamento</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label>Preço</label><input type="number" value={purchasePrice} onChange={e=>setPurchasePrice(parseFloat(e.target.value)||0)} className={inputStyle} /></div>
                            <div><label>Custos Iniciais</label><input type="number" value={closingCosts} onChange={e=>setClosingCosts(parseFloat(e.target.value)||0)} className={inputStyle} /></div>
                            <div><label>Entrada</label><input type="number" value={downPayment} onChange={e=>setDownPayment(parseFloat(e.target.value)||0)} className={inputStyle} /></div>
                            <div><label>Taxa Juros (% a.a.)</label><input type="number" value={interestRate} onChange={e=>setInterestRate(parseFloat(e.target.value)||0)} className={inputStyle} /></div>
                            <div><label>Prazo (anos)</label><input type="number" value={loanTerm} onChange={e=>setLoanTerm(parseInt(e.target.value)||0)} className={inputStyle} /></div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-bold text-navy dark:text-white mb-3">Renda e Despesas Mensais</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label>Aluguel</label><input type="number" value={monthlyRent} onChange={e=>setMonthlyRent(parseFloat(e.target.value)||0)} className={inputStyle} /></div>
                            <div><label>Impostos</label><input type="number" value={propertyTaxes} onChange={e=>setPropertyTaxes(parseFloat(e.target.value)||0)} className={inputStyle} /></div>
                            <div><label>Seguro</label><input type="number" value={insurance} onChange={e=>setInsurance(parseFloat(e.target.value)||0)} className={inputStyle} /></div>
                            <div><label>Vacância (%)</label><input type="number" value={vacancyRate} onChange={e=>setVacancyRate(parseFloat(e.target.value)||0)} className={inputStyle} /></div>
                            <div><label>Manutenção (%)</label><input type="number" value={maintenanceRate} onChange={e=>setMaintenanceRate(parseFloat(e.target.value)||0)} className={inputStyle} /></div>
                            <div><label>Administração (%)</label><input type="number" value={managementFee} onChange={e=>setManagementFee(parseFloat(e.target.value)||0)} className={inputStyle} /></div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4 text-center">Análise de Retorno</h2>
                    <div className="text-center p-4 bg-gray-100 dark:bg-navy rounded-lg mb-6">
                        <p className="text-lg text-slate dark:text-slate-light">Fluxo de Caixa Mensal</p>
                        <p className={`text-5xl font-bold font-mono my-2 ${monthlyCashFlow >= 0 ? 'text-green-accent' : 'text-red-400'}`}>{formatCurrency(monthlyCashFlow)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div className="p-3 bg-gray-100 dark:bg-navy rounded"><strong>Renda Efetiva:</strong> <span className="float-right font-mono">{formatCurrency(monthlyIncome)}</span></div>
                        <div className="p-3 bg-gray-100 dark:bg-navy rounded"><strong>Despesa Total:</strong> <span className="float-right font-mono">-{formatCurrency(monthlyExpenses)}</span></div>
                        <div className="col-span-2 p-3 bg-gray-100 dark:bg-navy rounded"><strong>Renda Operacional Líquida (NOI):</strong> <span className="float-right font-mono">{formatCurrency(monthlyNOI)}</span></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-gray-100 dark:bg-navy rounded-lg">
                            <h4 className="font-bold text-slate dark:text-slate-light">Investimento Total</h4>
                            <p className="font-mono text-xl text-white">{formatCurrency(totalInvestment)}</p>
                        </div>
                        <div className="p-3 bg-gray-100 dark:bg-navy rounded-lg">
                            <h4 className="font-bold text-slate dark:text-slate-light">Cap Rate</h4>
                            <p className="font-mono text-xl text-white">{capRate.toFixed(2)}%</p>
                        </div>
                        <div className="p-3 bg-gray-100 dark:bg-navy rounded-lg">
                            <h4 className="font-bold text-slate dark:text-slate-light">Cash-on-Cash</h4>
                            <p className="font-mono text-xl text-white">{cashOnCashReturn.toFixed(2)}%</p>
                        </div>
                    </div>
                </div>
            </div>
        </CalculatorWrapper>
    );
};

export default RentalPropertyCalculator;