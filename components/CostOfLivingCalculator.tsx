import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';

interface CostData {
    [city: string]: {
        index: number; // Overall index
        rentIndex: number;
        groceriesIndex: number;
        restaurantIndex: number;
    };
}

const MOCK_COST_DATA: CostData = {
    "São Paulo": { index: 100, rentIndex: 100, groceriesIndex: 100, restaurantIndex: 100 },
    "Rio de Janeiro": { index: 95.5, rentIndex: 92.3, groceriesIndex: 98.1, restaurantIndex: 94.0 },
    "Belo Horizonte": { index: 80.1, rentIndex: 70.5, groceriesIndex: 82.3, restaurantIndex: 78.9 },
    "Curitiba": { index: 78.5, rentIndex: 68.0, groceriesIndex: 80.5, restaurantIndex: 75.6 },
    "Brasília": { index: 92.0, rentIndex: 95.2, groceriesIndex: 90.1, restaurantIndex: 93.4 },
    "Porto Alegre": { index: 82.3, rentIndex: 72.1, groceriesIndex: 85.0, restaurantIndex: 81.2 },
};

const CITIES = Object.keys(MOCK_COST_DATA);

const CostOfLivingCalculator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [cityA, setCityA] = useState(CITIES[0]);
    const [cityB, setCityB] = useState(CITIES[1]);
    const [salaryA, setSalaryA] = useState(5000);

    const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.COST_OF_LIVING_COMPARATOR);

    const equivalentSalaryB = useMemo(() => {
        const indexA = MOCK_COST_DATA[cityA].index;
        const indexB = MOCK_COST_DATA[cityB].index;
        if (indexA <= 0) return 0;
        return salaryA * (indexB / indexA);
    }, [cityA, cityB, salaryA]);
    
    const dataA = MOCK_COST_DATA[cityA];
    const dataB = MOCK_COST_DATA[cityB];

    const handleSave = () => {
        saveEntry({
            inputs: { cityA, cityB, salaryA },
            results: { equivalentSalaryB }
        });
    };

    const handleLoad = (data: any) => {
        setCityA(data.inputs.cityA);
        setCityB(data.inputs.cityB);
        setSalaryA(data.inputs.salaryA);
    };

    const renderHistoryEntry = (data: any) => (
        <>
            <p>{data.inputs.cityA} vs {data.inputs.cityB}</p>
            <p><strong>Salário Equivalente:</strong> {formatCurrency(data.results.equivalentSalaryB)}</p>
        </>
    );

    return (
        <CalculatorWrapper 
            title="Comparador de Custo de Vida" 
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
                    <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Sua Situação</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate dark:text-slate-light">Sua Cidade Atual</label>
                            <select value={cityA} onChange={e => setCityA(e.target.value)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent">
                                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate dark:text-slate-light">Seu Salário Mensal (R$)</label>
                            <input type="number" value={salaryA} onChange={e => setSalaryA(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate dark:text-slate-light">Cidade de Destino</label>
                            <select value={cityB} onChange={e => setCityB(e.target.value)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent">
                                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4 text-center">Resultado da Comparação</h2>
                    <div className="text-center p-4 bg-gray-100 dark:bg-navy rounded-lg mb-6">
                        <p className="text-lg text-slate dark:text-slate-light">Para manter seu padrão de vida em {cityB}, você precisaria de um salário de</p>
                        <p className="text-5xl font-bold text-green-accent my-2 font-mono">{formatCurrency(equivalentSalaryB)}</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-center text-slate dark:text-slate-light">
                            <thead className="text-xs uppercase bg-gray-100 dark:bg-navy">
                                <tr>
                                    <th className="px-6 py-3">Índice</th>
                                    <th className="px-6 py-3">{cityA}</th>
                                    <th className="px-6 py-3">{cityB}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-slate-dark">
                                    <td className="px-6 py-4 font-bold">Custo de Vida Geral</td>
                                    <td className="px-6 py-4 font-mono">{dataA.index.toFixed(1)}</td>
                                    <td className="px-6 py-4 font-mono">{dataB.index.toFixed(1)}</td>
                                </tr>
                                 <tr className="border-b border-slate-dark">
                                    <td className="px-6 py-4 font-bold">Aluguel</td>
                                    <td className="px-6 py-4 font-mono">{dataA.rentIndex.toFixed(1)}</td>
                                    <td className="px-6 py-4 font-mono">{dataB.rentIndex.toFixed(1)}</td>
                                </tr>
                                 <tr className="border-b border-slate-dark">
                                    <td className="px-6 py-4 font-bold">Supermercado</td>
                                    <td className="px-6 py-4 font-mono">{dataA.groceriesIndex.toFixed(1)}</td>
                                    <td className="px-6 py-4 font-mono">{dataB.groceriesIndex.toFixed(1)}</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 font-bold">Restaurantes</td>
                                    <td className="px-6 py-4 font-mono">{dataA.restaurantIndex.toFixed(1)}</td>
                                    <td className="px-6 py-4 font-mono">{dataB.restaurantIndex.toFixed(1)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                     <p className="text-center text-slate dark:text-slate-light mt-6 text-xs">
                        *Dados simulados. O índice de São Paulo é a base 100.
                    </p>
                </div>
            </div>
        </CalculatorWrapper>
    );
};

export default CostOfLivingCalculator;