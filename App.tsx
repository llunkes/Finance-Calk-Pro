import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import InterestCalculator from './components/InterestCalculator';
import LoanCalculator from './components/LoanCalculator';
import InvestmentCalculator from './components/InvestmentCalculator';
import CurrencyConverter from './components/CurrencyConverter';
import InflationCalculator from './components/InflationCalculator';
import SavingsGoalCalculator from './components/SavingsGoalCalculator';
import CagrCalculator from './components/CagrCalculator';
import RuleOf72Calculator from './components/RuleOf72Calculator';
import RetirementCalculator from './components/RetirementCalculator';
import EmergencyFundCalculator from './components/EmergencyFundCalculator';
import RoiCalculator from './components/RoiCalculator';
import NetSalaryCalculator from './components/NetSalaryCalculator';
import BreakEvenCalculator from './components/BreakEvenCalculator';
import LoanComparisonCalculator from './components/LoanComparisonCalculator';
import PresentValueCalculator from './components/PresentValueCalculator';
import ProfitMarginCalculator from './components/ProfitMarginCalculator';
import TipCalculator from './components/TipCalculator';
import CreditCardComparator from './components/CreditCardComparator';
import ExpenseTracker from './components/ExpenseTracker';
import DebtPayoffPlanner from './components/DebtPayoffPlanner';
import StockAverageCalculator from './components/StockAverageCalculator';
import LeaseVsBuyCalculator from './components/LeaseVsBuyCalculator';
import RetirementWithdrawalCalculator from './components/RetirementWithdrawalCalculator';
import BudgetPlanner from './components/BudgetPlanner';
import ClvCalculator from './components/ClvCalculator';
import CostOfLivingCalculator from './components/CostOfLivingCalculator';
import MortgageRefinanceCalculator from './components/MortgageRefinanceCalculator';
import RentalPropertyCalculator from './components/RentalPropertyCalculator';
import TvmCalculator from './components/TvmCalculator';
import RoasCalculator from './components/RoasCalculator';
import AdPlaceholder from './components/AdPlaceholder';
import { CalculatorView } from './types';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
  });

  const [currentView, setCurrentView] = useState<CalculatorView>(CalculatorView.DASHBOARD);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-navy');
      document.body.classList.remove('bg-gray-100');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('bg-gray-100');
      document.body.classList.remove('bg-navy');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const navigateTo = (view: CalculatorView) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };
  
  const handleBack = () => navigateTo(CalculatorView.DASHBOARD);

  const renderContent = () => {
    switch (currentView) {
      case CalculatorView.INTEREST: return <InterestCalculator onBack={handleBack} />;
      case CalculatorView.LOAN: return <LoanCalculator onBack={handleBack} />;
      case CalculatorView.INVESTMENT: return <InvestmentCalculator onBack={handleBack} />;
      case CalculatorView.CURRENCY: return <CurrencyConverter onBack={handleBack} />;
      case CalculatorView.INFLATION: return <InflationCalculator onBack={handleBack} />;
      case CalculatorView.SAVINGS_GOAL: return <SavingsGoalCalculator onBack={handleBack} />;
      case CalculatorView.CAGR: return <CagrCalculator onBack={handleBack} />;
      case CalculatorView.RULE_OF_72: return <RuleOf72Calculator onBack={handleBack} />;
      case CalculatorView.RETIREMENT: return <RetirementCalculator onBack={handleBack} />;
      case CalculatorView.EMERGENCY_FUND: return <EmergencyFundCalculator onBack={handleBack} />;
      case CalculatorView.ROI: return <RoiCalculator onBack={handleBack} />;
      case CalculatorView.NET_SALARY: return <NetSalaryCalculator onBack={handleBack} />;
      case CalculatorView.BREAK_EVEN: return <BreakEvenCalculator onBack={handleBack} />;
      case CalculatorView.LOAN_COMPARISON: return <LoanComparisonCalculator onBack={handleBack} />;
      case CalculatorView.PRESENT_VALUE: return <PresentValueCalculator onBack={handleBack} />;
      case CalculatorView.PROFIT_MARGIN: return <ProfitMarginCalculator onBack={handleBack} />;
      case CalculatorView.TIP: return <TipCalculator onBack={handleBack} />;
      case CalculatorView.CREDIT_CARD: return <CreditCardComparator onBack={handleBack} />;
      case CalculatorView.EXPENSE_TRACKER: return <ExpenseTracker onBack={handleBack} />;
      case CalculatorView.DEBT_PAYOFF: return <DebtPayoffPlanner onBack={handleBack} />;
      case CalculatorView.STOCK_AVERAGE: return <StockAverageCalculator onBack={handleBack} />;
      case CalculatorView.LEASE_VS_BUY: return <LeaseVsBuyCalculator onBack={handleBack} />;
      case CalculatorView.RETIREMENT_WITHDRAWAL: return <RetirementWithdrawalCalculator onBack={handleBack} />;
      case CalculatorView.BUDGET_PLANNER: return <BudgetPlanner onBack={handleBack} />;
      case CalculatorView.CLV_CALCULATOR: return <ClvCalculator onBack={handleBack} />;
      case CalculatorView.COST_OF_LIVING_COMPARATOR: return <CostOfLivingCalculator onBack={handleBack} />;
      case CalculatorView.MORTGAGE_REFINANCE_CALCULATOR: return <MortgageRefinanceCalculator onBack={handleBack} />;
      case CalculatorView.RENTAL_PROPERTY: return <RentalPropertyCalculator onBack={handleBack} />;
      case CalculatorView.TVM_SOLVER: return <TvmCalculator onBack={handleBack} />;
      case CalculatorView.ROAS_CALCULATOR: return <RoasCalculator onBack={handleBack} />;
      default: return <Dashboard onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-navy min-h-screen font-sans">
      <Header theme={theme} onToggleTheme={handleToggleTheme} />
      
      <AdPlaceholder label="970x90 - Leaderboard" className="h-24 w-full max-w-7xl mx-auto my-4 hidden sm:flex" />

      <div className="flex">
        <aside className="w-48 hidden xl:block sticky top-16 h-screen p-4">
          <AdPlaceholder label="160x600 - Wide Skyscraper" className="h-full" />
        </aside>

        <main className="flex-grow container mx-auto px-4">
            {renderContent()}
        </main>

        <aside className="w-48 hidden xl:block sticky top-16 h-screen p-4">
          <AdPlaceholder label="160x600 - Wide Skyscraper" className="h-full" />
        </aside>
      </div>
      
      <footer className="w-full">
         <AdPlaceholder label="728x90 - Footer Ad" className="h-24 max-w-3xl mx-auto my-4" />
      </footer>
    </div>
  );
}

export default App;