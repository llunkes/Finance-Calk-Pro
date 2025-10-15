import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';

const RoasCalculator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [adSpend, setAdSpend] = useState(1000);
    const [adRevenue, setAdRevenue] = useState(5000);

    const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.ROAS_CALCULATOR);

    const { roas, roasPercentage, netProfit } = useMemo(() => {
        if (adSpend <= 0) {
            return { roas: 0, roasPercentage: 0, netProfit: 0 };
        }
        const calculatedRoas = adRevenue / adSpend;
        const profit = adRevenue - adSpend;
        return {
            roas: calculatedRoas,
            roasPercentage: calculatedRoas * 100,
            netProfit: profit,
        };
    }, [adSpend, adRevenue]);
    
    const handleSave = () => {
        saveEntry({
            inputs: { adSpend, adRevenue },
            results: { roas }
        });
    };

    const handleLoad = (data: any) => {
        setAdSpend(data.inputs.adSpend);
        setAdRevenue(data.inputs.adRevenue);
    };

    const renderHistoryEntry = (data: any) => (
        <>
            <p>Gasto: {formatCurrency(data.inputs.adSpend)} | Receita: {formatCurrency(data.inputs.adRevenue)}</p>
            <p><strong>ROAS:</strong> {data.results.roas.toFixed(2)} : 1</p>
        </>
    );

    const inputStyle = "mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent";

    return (
        <CalculatorWrapper 
            title="Calculadora de ROAS (Retorno sobre Gasto com Anúncios)" 
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
                    <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Dados da Campanha</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate dark:text-slate-light">Gasto Total com Anúncios (R$)</label>
                            <input type="number" value={adSpend} onChange={e => setAdSpend(parseFloat(e.target.value) || 0)} className={inputStyle} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate dark:text-slate-light">Receita Gerada pelos Anúncios (R$)</label>
                            <input type="number" value={adRevenue} onChange={e => setAdRevenue(parseFloat(e.target.value) || 0)} className={inputStyle} />
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4 text-center">Análise de Performance</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-center">
                        <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
                            <h3 className="text-lg font-bold text-slate dark:text-slate-light">ROAS (Proporção)</h3>
                            <p className="text-4xl font-mono text-green-accent">
                                {roas.toFixed(2)} : 1
                            </p>
                            <p className="text-xs text-slate dark:text-slate-light mt-1">Para cada R$1 gasto, você gerou {formatCurrency(roas)}</p>
                        </div>
                        <div className="p-4 bg-gray-100 dark:bg-navy rounded-lg">
                            <h3 className="text-lg font-bold text-slate dark:text-slate-light">ROAS (Percentual)</h3>
                            <p className="text-4xl font-mono text-green-accent">
                                {roasPercentage.toFixed(0)}%
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-dark text-center">
                        <p className="text-lg text-slate dark:text-slate-light">
                            Lucro Líquido da Campanha: <span className={`font-bold font-mono ${netProfit >= 0 ? 'text-white' : 'text-red-400'}`}>{formatCurrency(netProfit)}</span>
                        </p>
                    </div>
                </div>
            </div>
        </CalculatorWrapper>
    );
};

export default RoasCalculator;