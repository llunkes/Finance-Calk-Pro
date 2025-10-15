import React, { useState, useMemo } from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { CreditCard, CalculatorView } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useHistory } from '../utils/useHistory';

// --- Mock Data ---
const MOCK_CREDIT_CARDS: CreditCard[] = [
  {
    id: 1, name: 'Platinum Card', issuer: 'BankFin', brand: 'Visa', annuity: 350,
    imageUrl: 'https://placehold.co/100x60/0A192F/64FFDA/png?text=BankFin',
    cashback: 1.5, benefits: ['Seguro Viagem', 'Acesso VIP Lounge'], minIncome: 5000,
  },
  {
    id: 2, name: 'Digital Gold', issuer: 'NeoBank', brand: 'Mastercard', annuity: 0,
    imageUrl: 'https://placehold.co/100x60/64FFDA/0A192F/png?text=NeoBank',
    cashback: 1, benefits: ['Sem anuidade', 'Conta Digital'], minIncome: 1500,
  },
  {
    id: 3, name: 'Infinite Miles', issuer: 'AirTravel', brand: 'Visa', annuity: 1200,
    imageUrl: 'https://placehold.co/100x60/172A45/FFFFFF/png?text=AirTravel',
    milesPerDollar: 2.5, benefits: ['Milhas em Dobro', 'Acesso VIP Lounge', 'Concierge'], minIncome: 15000,
  },
  {
    id: 4, name: 'Essencial', issuer: 'CrediBank', brand: 'Elo', annuity: 120,
    imageUrl: 'https://placehold.co/100x60/495670/FFFFFF/png?text=CrediBank',
    benefits: ['Aceitação Nacional', 'Programa de Pontos'], minIncome: 2000,
  },
  {
    id: 5, name: 'Rewards Plus', issuer: 'BankFin', brand: 'Mastercard', annuity: 0,
    imageUrl: 'https://placehold.co/100x60/0A192F/64FFDA/png?text=BankFin',
    milesPerDollar: 1, benefits: ['Sem anuidade', 'Pontos que não expiram'], minIncome: 2500,
  },
  {
    id: 6, name: 'Ultimate Black', issuer: 'Prestige Cards', brand: 'Amex', annuity: 4500,
    imageUrl: 'https://placehold.co/100x60/000000/FFFFFF/png?text=Prestige',
    cashback: 2.5, milesPerDollar: 3, benefits: ['Acesso Ilimitado a Lounges', 'Concierge Pessoal', 'Seguros Premium'], minIncome: 30000,
  }
];

// --- Constants for Calculation ---
const DOLLAR_RATE_BRL = 5.4; // Simplified exchange rate for miles calculation
const MILE_VALUE_BRL = 0.07; // Estimated value of a single mile in BRL

interface CreditCardComparatorProps {
  onBack: () => void;
}

const CreditCardComparator: React.FC<CreditCardComparatorProps> = ({ onBack }) => {
  const [monthlySpending, setMonthlySpending] = useState(4000);
  const [filters, setFilters] = useState({
    noAnnuity: false,
    hasCashback: false,
    hasMiles: false,
  });
  
  const { history, saveEntry, deleteEntry, clearHistory } = useHistory(CalculatorView.CREDIT_CARD);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFilters(prev => ({ ...prev, [name]: checked }));
  };
  
  const filteredAndRankedCards = useMemo(() => {
    const calculatedCards = MOCK_CREDIT_CARDS
      .filter(card => {
        if (filters.noAnnuity && card.annuity > 0) return false;
        if (filters.hasCashback && !card.cashback) return false;
        if (filters.hasMiles && !card.milesPerDollar) return false;
        return true;
      })
      .map(card => {
        const annualSpending = monthlySpending * 12;
        
        const annualCashback = card.cashback ? annualSpending * (card.cashback / 100) : 0;
        
        const annualMilesInBRL = card.milesPerDollar ? (annualSpending / DOLLAR_RATE_BRL) * card.milesPerDollar * MILE_VALUE_BRL : 0;

        const totalAdvantage = annualCashback + annualMilesInBRL - card.annuity;

        return { ...card, totalAdvantage };
      });
      
    return calculatedCards.sort((a, b) => b.totalAdvantage - a.totalAdvantage);
  }, [monthlySpending, filters]);

  const handleSave = () => {
    saveEntry({
        inputs: { monthlySpending, filters },
        results: { topCardName: filteredAndRankedCards[0]?.name, topCardAdvantage: filteredAndRankedCards[0]?.totalAdvantage }
    });
  };

  const handleLoad = (data: any) => {
    setMonthlySpending(data.inputs.monthlySpending);
    setFilters(data.inputs.filters);
  };

  const renderHistoryEntry = (data: any) => (
    <>
        <p>Gasto Mensal: {formatCurrency(data.inputs.monthlySpending)}</p>
        <p><strong>Melhor Opção:</strong> {data.results.topCardName} ({formatCurrency(data.results.topCardAdvantage || 0)})</p>
    </>
  );

  return (
    <CalculatorWrapper 
        title="Comparador de Cartões de Crédito" 
        onBack={onBack}
        onSave={handleSave}
        history={history}
        onLoadHistory={handleLoad}
        onDeleteHistory={deleteEntry}
        onClearHistory={clearHistory}
        renderHistoryEntry={renderHistoryEntry}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1 bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg h-fit sticky top-24">
          <h2 className="text-xl font-semibold text-navy dark:text-gray-100 mb-4">Seu Perfil</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate dark:text-slate-light">Gasto Mensal Médio (R$)</label>
              <input type="number" value={monthlySpending} onChange={(e) => setMonthlySpending(parseFloat(e.target.value) || 0)} className="mt-1 block w-full bg-gray-100 dark:bg-navy border-slate-dark border-2 rounded-md p-2 text-navy dark:text-white focus:ring-green-accent focus:border-green-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-navy dark:text-gray-100 mb-2">Filtros</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" name="noAnnuity" checked={filters.noAnnuity} onChange={handleFilterChange} className="form-checkbox h-5 w-5 rounded bg-slate-dark border-slate-light text-green-accent focus:ring-green-accent"/>
                  <span className="text-slate dark:text-slate-light">Sem anuidade</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" name="hasCashback" checked={filters.hasCashback} onChange={handleFilterChange} className="form-checkbox h-5 w-5 rounded bg-slate-dark border-slate-light text-green-accent focus:ring-green-accent"/>
                  <span className="text-slate dark:text-slate-light">Com Cashback</span>
                </label>
                 <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" name="hasMiles" checked={filters.hasMiles} onChange={handleFilterChange} className="form-checkbox h-5 w-5 rounded bg-slate-dark border-slate-light text-green-accent focus:ring-green-accent"/>
                  <span className="text-slate dark:text-slate-light">Com Milhas</span>
                </label>
              </div>
            </div>
             <button
              onClick={() => alert('Gerando relatório PDF...')}
              className="w-full px-4 py-2 mt-4 bg-green-accent text-navy font-bold rounded-md hover:bg-green-accent-dark transition-colors"
            >
              Gerar Relatório PDF
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          {filteredAndRankedCards.length > 0 ? (
            filteredAndRankedCards.map((card, index) => (
            <div key={card.id} className={`bg-white dark:bg-navy-light p-5 rounded-lg shadow-lg flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden ${index === 0 ? 'border-2 border-green-accent' : ''}`}>
              {index === 0 && <div className="absolute top-0 right-0 bg-green-accent text-navy text-xs font-bold px-4 py-1 rounded-bl-lg">MELHOR OPÇÃO</div>}
              <img src={card.imageUrl} alt={`${card.issuer} ${card.name}`} className="w-32 h-20 object-cover rounded-md flex-shrink-0" />
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-xl font-bold text-navy dark:text-white">{card.name} <span className="text-base font-normal text-slate dark:text-slate-light">- {card.issuer}</span></h3>
                <div className="flex flex-wrap gap-2 my-2 justify-center sm:justify-start">
                    {card.benefits.map(b => <span key={b} className="text-xs bg-slate-dark text-slate-light px-2 py-1 rounded-full">{b}</span>)}
                </div>
                 <div className="text-sm text-slate dark:text-slate-light space-x-4">
                    <span>Anuidade: <span className="font-semibold text-white">{card.annuity > 0 ? formatCurrency(card.annuity) : 'Grátis'}</span></span>
                    {card.cashback && <span>Cashback: <span className="font-semibold text-white">{card.cashback}%</span></span>}
                    {card.milesPerDollar && <span>Milhas: <span className="font-semibold text-white">{card.milesPerDollar}/US$</span></span>}
                </div>
              </div>
              <div className="flex-shrink-0 text-center bg-gray-100 dark:bg-navy p-4 rounded-lg">
                <p className="text-sm text-slate dark:text-slate-light">Vantagem Anual Estimada</p>
                <p className={`text-2xl font-bold font-mono ${card.totalAdvantage >= 0 ? 'text-green-accent' : 'text-red-400'}`}>
                    {formatCurrency(card.totalAdvantage)}
                </p>
              </div>
            </div>
            ))
          ) : (
            <div className="bg-white dark:bg-navy-light p-8 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-bold text-navy dark:text-white">Nenhum cartão encontrado</h3>
                <p className="text-slate dark:text-slate-light mt-2">Tente ajustar seus filtros para encontrar mais opções.</p>
            </div>
          )}
        </div>
      </div>
    </CalculatorWrapper>
  );
};

export default CreditCardComparator;