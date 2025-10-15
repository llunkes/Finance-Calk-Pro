// fix: Removed stale comment about default export.
import React, { useState, useEffect } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { SwitchIcon } from './Icons';
import { useHistory } from '../utils/useHistory';
import { CalculatorView } from '../types';

interface CurrencyConverterProps {
  onBack: () => void;
}

// Mock exchange rates. In a real app, this would come from an API.
const MOCK_RATES: { [key: string]: number } = {
  USD: 1, // Base currency
  BRL: 5.45,
  EUR: 0.92,
  JPY: 157.25,
  GBP: 0.78,
  AUD: 1.50,
  CAD: 1.37,
  CHF: 0.90,
  CNY: 7.25,
};

const CURRENCY_NAMES: { [key: string]: string } = {
    USD: "Dólar Americano",
    BRL: "Real Brasileiro",
    EUR: "Euro",
    JPY: "Iene Japonês",
    GBP: "Libra Esterlina",
    AUD: "Dólar Australiano",
    CAD: "Dólar Canadense",
    CHF: "Franco Suíço",
    CNY: "Yuan Chinês",
};


const CURRENCIES = Object.keys(MOCK_RATES);

// Local formatter to avoid changing the shared utils/formatters.ts
const formatGenericCurrency = (value: number, currency: string) => {
    let locale = 'en-US';
    if (currency === 'BRL') locale = 'pt-BR';
    if (currency === 'EUR') locale = 'de-DE';
    if (currency === 'JPY') locale = 'ja-JP';

    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
        }).format(value);
    } catch (e) {
        // Fallback for unsupported currencies in some environments
        return `${currency} ${value.toFixed(2)}`;
    }
};

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ onBack }) => {
  const [amount, setAmount] = useState<number | string>(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BRL');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.CURRENCY);

  useEffect(() => {
    // Simulate API fetch
    const timestamp = new Date();
    setLastUpdated(timestamp.toLocaleString('pt-BR'));
    
    if (typeof amount === 'number' && amount >= 0) {
      const rateFrom = MOCK_RATES[fromCurrency];
      const rateTo = MOCK_RATES[toCurrency];
      if (rateFrom && rateTo) {
        const result = (amount / rateFrom) * rateTo;
        setConvertedAmount(result);
      }
    } else {
      setConvertedAmount(null);
    }
  }, [amount, fromCurrency, toCurrency]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setAmount('');
    } else {
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue) && parsedValue >= 0) {
        setAmount(parsedValue);
      }
    }
  };

  const swapCurrencies = () => {
    const oldFrom = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(oldFrom);
  };
  
  const handleSave = () => {
    if (typeof amount === 'number' && convertedAmount !== null) {
      saveEntry({
        inputs: { amount, fromCurrency, toCurrency },
        results: { convertedAmount }
      });
    }
  };

  const handleLoad = (data: any) => {
    setAmount(data.inputs.amount);
    setFromCurrency(data.inputs.fromCurrency);
    setToCurrency(data.inputs.toCurrency);
  };

  const renderHistoryEntry = (data: any) => (
    <p>
      {formatGenericCurrency(data.inputs.amount, data.inputs.fromCurrency)} → {formatGenericCurrency(data.results.convertedAmount, data.inputs.toCurrency)}
    </p>
  );

  return (
    <CalculatorWrapper 
        title="Conversor de Moedas" 
        onBack={onBack}
        onSave={handleSave}
        history={history}
        onLoadHistory={handleLoad}
        onDeleteHistory={deleteEntry}
        onClearHistory={clearHistory}
        renderHistoryEntry={renderHistoryEntry}
    >
      <div className="bg-white dark:bg-navy-light p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-6 text-center">Cotações (simulado)</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* Amount Input */}
          <div className="md:col-span-2">
            <label htmlFor="amount" className="block text-sm font-medium text-slate dark:text-slate-light">Valor</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              min="0"
              className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent"
              placeholder="100.00"
            />
          </div>

          {/* From Currency */}
          <div className="md:col-span-1">
            <label htmlFor="from" className="block text-sm font-medium text-slate dark:text-slate-light">De</label>
            <select
              id="from"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent"
            >
              {CURRENCIES.map(curr => <option key={curr} value={curr}>{curr} - {CURRENCY_NAMES[curr]}</option>)}
            </select>
          </div>
          
          {/* Swap Button */}
          <div className="flex justify-center">
             <button
                onClick={swapCurrencies}
                className="p-2 rounded-full text-slate dark:text-slate-light hover:bg-gray-200 dark:hover:bg-slate-dark transition-colors"
                aria-label="Trocar moedas"
              >
                <SwitchIcon className="w-6 h-6" />
              </button>
          </div>

          {/* To Currency */}
          <div className="md:col-span-1">
            <label htmlFor="to" className="block text-sm font-medium text-slate dark:text-slate-light">Para</label>
            <select
              id="to"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent"
            >
              {CURRENCIES.map(curr => <option key={curr} value={curr}>{curr} - {CURRENCY_NAMES[curr]}</option>)}
            </select>
          </div>
        </div>

        {/* Result */}
        <div className="mt-8 pt-6 border-t border-slate-dark">
          {(convertedAmount !== null && typeof amount === 'number') && (
            <div className="text-center">
              <p className="text-lg text-slate dark:text-slate-light">Valor Convertido</p>
              <p className="text-4xl font-bold text-green-accent mt-2 font-mono">
                {formatGenericCurrency(convertedAmount, toCurrency)}
              </p>
              <p className="text-sm text-slate dark:text-slate-light mt-4">
                {formatGenericCurrency(amount, fromCurrency)} = {formatGenericCurrency(convertedAmount, toCurrency)}
              </p>
               <p className="text-xs text-slate/70 dark:text-slate-light/70 mt-4">
                Última atualização: {lastUpdated}
              </p>
              <p className="text-xs text-slate/70 dark:text-slate-light/70 mt-2">
                Taxa de conversão: 1 {fromCurrency} ≈ {(MOCK_RATES[toCurrency] / MOCK_RATES[fromCurrency]).toFixed(4)} {toCurrency}
              </p>
            </div>
          )}
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default CurrencyConverter;
