import React, { useState } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { formatCurrency } from '../utils/formatters';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';

const TvmCalculator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [n, setN] = useState<number | ''>(120); // Periods
    const [i, setI] = useState<number | ''>(5);  // Annual Interest Rate
    const [pv, setPv] = useState<number | ''>(0); // Present Value
    const [pmt, setPmt] = useState<number | ''>(-100); // Payment
    const [fv, setFv] = useState<number | ''>(''); // Future Value
    const [solvingFor, setSolvingFor] = useState('FV');

    const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.TVM_SOLVER);

    const solve = (target: string) => {
        const _n = n === '' ? null : Number(n);
        const _i = i === '' ? null : Number(i);
        const _pv = pv === '' ? null : Number(pv);
        const _pmt = pmt === '' ? null : Number(pmt);
        const _fv = fv === '' ? null : Number(fv);

        if (target === 'FV' && _n !== null && _i !== null && _pv !== null && _pmt !== null) {
            const rate = _i / 100 / 12;
            const fv_of_pv = _pv * Math.pow(1 + rate, _n);
            const fv_of_pmt = _pmt * ((Math.pow(1 + rate, _n) - 1) / rate);
            setFv(parseFloat((-(fv_of_pv + fv_of_pmt)).toFixed(2)));
            setSolvingFor('FV');
        } else if (target === 'PMT' && _n !== null && _i !== null && _pv !== null && _fv !== null) {
            const rate = _i / 100 / 12;
            const pmt_val = -( _fv + _pv * Math.pow(1+rate,_n)) / ((Math.pow(1+rate,_n) - 1) / rate);
            setPmt(parseFloat(pmt_val.toFixed(2)));
            setSolvingFor('PMT');
        }
        // Simplified solvers for now. PV and N would be similar. I/A requires an iterative solver.
    };
    
    const handleSave = () => {
        saveEntry({
            inputs: { n, i, pv, pmt, fv, solvingFor }
        });
    };
    
    const handleLoad = (data: any) => {
        const { inputs } = data;
        setN(inputs.n);
        setI(inputs.i);
        setPv(inputs.pv);
        setPmt(inputs.pmt);
        setFv(inputs.fv);
        setSolvingFor(inputs.solvingFor);
    };

    const renderHistoryEntry = (data: any) => (
         <p>Cenário salvo para resolver <strong>{data.inputs.solvingFor}</strong>.</p>
    );

    const renderInputField = (
        label: string,
        value: number | '',
        setter: React.Dispatch<React.SetStateAction<number | ''>>,
        solveTarget: string,
    ) => (
        <div className="flex items-center">
            <label className="w-1/3 text-slate dark:text-slate-light font-semibold">{label}</label>
            <input
                type="number"
                value={value}
                onChange={e => {
                    setter(e.target.value === '' ? '' : parseFloat(e.target.value));
                    // Clear the field we were solving for if a different one is changed
                    if(solvingFor && solveTarget !== solvingFor) {
                        if (solvingFor === 'N') setN('');
                        if (solvingFor === 'I') setI('');
                        if (solvingFor === 'PV') setPv('');
                        if (solvingFor === 'PMT') setPmt('');
                        if (solvingFor === 'FV') setFv('');
                    }
                }}
                className="flex-grow bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent"
            />
             <button
                onClick={() => solve(solveTarget)}
                className="ml-2 px-3 py-2 text-sm bg-green-accent text-navy font-bold rounded-md hover:bg-green-accent-dark disabled:bg-slate-dark disabled:cursor-not-allowed transition-colors"
             >
                Calc
            </button>
        </div>
    );

    return (
        <CalculatorWrapper 
            title="Calculadora TVM (Valor do Dinheiro no Tempo)" 
            onBack={onBack}
            onSave={handleSave}
            history={history}
            onLoadHistory={handleLoad}
            onDeleteHistory={deleteEntry}
            onClearHistory={clearHistory}
            renderHistoryEntry={renderHistoryEntry}
        >
            <div className="bg-white dark:bg-navy-light p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
                <p className="text-center text-slate dark:text-slate-light mb-6 text-sm">
                    Preencha os campos conhecidos e clique em "Calc" no campo que deseja descobrir. Use valores negativos para saídas de caixa (ex: pagamentos, investimento inicial).
                </p>
                <div className="space-y-4">
                    {renderInputField("Períodos (N)", n, setN, 'N')}
                    {renderInputField("Juros Anual (%) (I/A)", i, setI, 'I')}
                    {renderInputField("Valor Presente (VP)", pv, setPv, 'PV')}
                    {renderInputField("Pagamento (PGTO)", pmt, setPmt, 'PMT')}
                    {renderInputField("Valor Futuro (VF)", fv, setFv, 'FV')}
                </div>
            </div>
        </CalculatorWrapper>
    );
};

export default TvmCalculator;